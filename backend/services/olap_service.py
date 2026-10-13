import pandas as pd
import numpy as np
from config import ALLOWED_DIMENSIONS, ALLOWED_MEASURES, DIMENSION_COLUMN_MAP, MEASURE_AGG_MAP

class OLAPService:
    def __init__(self, df):
        self.df = df

    def _validate_dimension(self, dim, default="main_category"):
        if dim in ALLOWED_DIMENSIONS:
            return DIMENSION_COLUMN_MAP[dim]
        return DIMENSION_COLUMN_MAP[default]

    def _validate_measure(self, measure, default="product_count"):
        if measure in ALLOWED_MEASURES:
            return MEASURE_AGG_MAP[measure]
        return MEASURE_AGG_MAP[default]

    def slice(self, dimension="main_category", value="Computers&Accessories"):
        dim_col = self._validate_dimension(dimension)
        filtered_df = self.df[self.df[dim_col].astype(str) == str(value)]

        pseudo_sql = f"SELECT * FROM product_cube WHERE {dim_col} = '{value}';"

        sample_records = filtered_df[[
            'product_name', 'main_category', 'sub_category',
            'discounted_price_clean', 'actual_price_clean',
            'discount_percentage_clean', 'rating_clean', 'rating_count_clean'
        ]].head(50).to_dict(orient='records')

        return {
            "operation": f"Slice on {dimension} = '{value}'",
            "pseudo_sql": pseudo_sql,
            "rows_affected": len(filtered_df),
            "total_catalog_rows": len(self.df),
            "data": sample_records
        }

    def dice(self, conditions):
        """
        Dicing: filters across multiple dimensions.
        conditions: dict like {"main_category": "Electronics", "min_rating": 4.0, "max_price": 5000}
        """
        filtered = self.df.copy()
        sql_clauses = []

        if conditions.get("category") and conditions["category"] != "All":
            cat = str(conditions["category"])
            filtered = filtered[filtered['main_category'] == cat]
            sql_clauses.append(f"main_category = '{cat}'")

        if conditions.get("sub_category") and conditions["sub_category"] != "All":
            scat = str(conditions["sub_category"])
            filtered = filtered[filtered['sub_category'] == scat]
            sql_clauses.append(f"sub_category = '{scat}'")

        if conditions.get("min_rating") is not None and float(conditions.get("min_rating", 0)) > 0:
            mr = float(conditions["min_rating"])
            filtered = filtered[filtered['rating_clean'] >= mr]
            sql_clauses.append(f"rating >= {mr}")

        if conditions.get("min_discount") is not None and float(conditions.get("min_discount", 0)) > 0:
            md = float(conditions["min_discount"])
            filtered = filtered[filtered['discount_percentage_clean'] >= md]
            sql_clauses.append(f"discount_percentage >= {md}%")

        if conditions.get("max_price") is not None and float(conditions.get("max_price", 0)) > 0:
            mp = float(conditions["max_price"])
            filtered = filtered[filtered['discounted_price_clean'] <= mp]
            sql_clauses.append(f"discounted_price <= {mp}")

        where_clause = " AND ".join(sql_clauses) if sql_clauses else "1=1"
        pseudo_sql = f"SELECT * FROM product_cube WHERE {where_clause};"

        sample = filtered[[
            'product_name', 'main_category', 'sub_category',
            'discounted_price_clean', 'actual_price_clean',
            'discount_percentage_clean', 'rating_clean', 'rating_count_clean'
        ]].head(50).to_dict(orient='records')

        return {
            "operation": f"Dice across {len(sql_clauses)} dimension constraint(s)",
            "pseudo_sql": pseudo_sql,
            "rows_affected": len(filtered),
            "total_catalog_rows": len(self.df),
            "data": sample
        }

    def rollup(self, level="main_category", category=None):
        """
        Roll-up aggregates detail to higher levels:
        e.g. sub_category -> main_category
        """
        df = self.df.copy()
        if category and category != "All":
            df = df[df['main_category'] == category]

        group_col = self._validate_dimension(level, default="main_category")

        grouped = df.groupby(group_col).agg({
            'product_id': 'count',
            'actual_price_clean': 'mean',
            'discounted_price_clean': 'mean',
            'discount_percentage_clean': 'mean',
            'rating_clean': 'mean',
            'rating_count_clean': 'sum'
        }).reset_index()

        grouped.columns = [
            'dimension', 'product_count', 'avg_actual_price',
            'avg_discounted_price', 'avg_discount', 'avg_rating', 'total_rating_count'
        ]

        # Round numeric values
        for c in ['avg_actual_price', 'avg_discounted_price', 'avg_discount', 'avg_rating']:
            grouped[c] = grouped[c].round(2)

        pseudo_sql = (
            f"SELECT {group_col}, COUNT(*) AS product_count, "
            f"AVG(actual_price) AS avg_price, AVG(rating) AS avg_rating "
            f"FROM product_cube GROUP BY {group_col};"
        )

        return {
            "operation": f"Roll-Up Aggregation by {level}",
            "pseudo_sql": pseudo_sql,
            "rows_affected": len(df),
            "data": grouped.to_dict(orient='records')
        }

    def drilldown(self, category="Computers&Accessories", sub_category=None):
        """
        Drill-down: all categories -> one category -> its sub-categories or products
        """
        df = self.df.copy()
        breadcrumbs = ["Catalog", category]

        if category and category != "All":
            df = df[df['main_category'] == category]

        if sub_category and sub_category != "All":
            df = df[df['sub_category'] == sub_category]
            breadcrumbs.append(sub_category)
            # Drill to products
            group_view = False
            result_data = df[[
                'product_name', 'sub_category', 'discounted_price_clean',
                'rating_clean', 'discount_percentage_clean'
            ]].head(50).to_dict(orient='records')
            pseudo_sql = f"SELECT * FROM product_cube WHERE main_category = '{category}' AND sub_category = '{sub_category}';"
        else:
            # Drill to sub-categories
            group_view = True
            grouped = df.groupby('sub_category').agg({
                'product_id': 'count',
                'discounted_price_clean': 'mean',
                'rating_clean': 'mean'
            }).reset_index()
            grouped.columns = ['sub_category', 'product_count', 'avg_price', 'avg_rating']
            grouped['avg_price'] = grouped['avg_price'].round(2)
            grouped['avg_rating'] = grouped['avg_rating'].round(2)
            result_data = grouped.to_dict(orient='records')
            pseudo_sql = f"SELECT sub_category, COUNT(*), AVG(price) FROM product_cube WHERE main_category = '{category}' GROUP BY sub_category;"

        return {
            "operation": f"Drill-Down to {'Products' if sub_category else 'Sub-Categories'}",
            "breadcrumbs": breadcrumbs,
            "is_leaf": not group_view,
            "pseudo_sql": pseudo_sql,
            "rows_affected": len(df),
            "data": result_data
        }

    def pivot(self, row_dim="main_category", col_dim="rating_bucket", measure="product_count"):
        row_col = self._validate_dimension(row_dim, default="main_category")
        col_col = self._validate_dimension(col_dim, default="rating_bucket")
        val_col, agg_fn = self._validate_measure(measure, default="product_count")

        df = self.df.copy()

        pivot_df = pd.pivot_table(
            df,
            index=row_col,
            columns=col_col,
            values=val_col,
            aggfunc='count' if agg_fn == 'count' else ('mean' if agg_fn == 'mean' else 'sum'),
            fill_value=0
        )

        if agg_fn in ['mean']:
            pivot_df = pivot_df.round(2)

        # Structure for table and heatmap
        row_names = list(pivot_df.index)
        col_names = [str(c) for c in pivot_df.columns]

        heatmap_matrix = []
        max_val = float(pivot_df.values.max()) if pivot_df.size > 0 else 1.0

        for r in row_names:
            row_dict = {"dimension": str(r)}
            for c in col_names:
                v = float(pivot_df.loc[r, c]) if c in pivot_df.columns else 0.0
                row_dict[str(c)] = v
                heatmap_matrix.append({
                    "row": str(r),
                    "col": str(c),
                    "value": v,
                    "intensity": round(v / max_val, 3) if max_val > 0 else 0
                })

        table_records = []
        for r in row_names:
            rec = {"row_dimension": str(r)}
            for c in col_names:
                rec[str(c)] = float(pivot_df.loc[r, c])
            table_records.append(rec)

        pseudo_sql = (
            f"SELECT {row_col}, {col_col}, {agg_fn.upper()}({val_col}) "
            f"FROM product_cube "
            f"GROUP BY {row_col}, {col_col};"
        )

        return {
            "operation": f"Pivot Table: {row_dim} (rows) × {col_dim} (cols) measuring {measure}",
            "pseudo_sql": pseudo_sql,
            "row_headers": [str(r) for r in row_names],
            "col_headers": col_names,
            "measure": measure,
            "table_data": table_records,
            "heatmap_data": heatmap_matrix
        }
