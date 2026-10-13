import os
import pandas as pd
import numpy as np

def assign_rating_bucket(rating):
    if pd.isna(rating):
        return "Unknown"
    if rating < 3.5:
        return "< 3.5"
    if rating < 4.0:
        return "3.5 - 3.9"
    if rating < 4.3:
        return "4.0 - 4.2"
    return "4.3 - 5.0"

def assign_discount_bucket(discount):
    if pd.isna(discount):
        return "Unknown"
    if discount < 20:
        return "0 - 20%"
    if discount < 40:
        return "20 - 40%"
    if discount < 60:
        return "40 - 60%"
    if discount < 80:
        return "60 - 80%"
    return "80%+"

def assign_price_bucket(price):
    if pd.isna(price):
        return "Unknown"
    if price < 500:
        return "Under ₹500"
    if price < 1500:
        return "₹500 - ₹1,500"
    if price < 5000:
        return "₹1,500 - ₹5,000"
    if price < 15000:
        return "₹5,000 - ₹15,000"
    return "₹15,000+"

def clean_dataset(raw_csv_path, output_csv_path=None):
    """
    Cleans raw Amazon dataset and engineers OLAP and ML features.
    Returns: (cleaned_df, cleaning_report)
    """
    if not os.path.exists(raw_csv_path):
        raise FileNotFoundError(f"Raw dataset not found at {raw_csv_path}")

    df_raw = pd.read_csv(raw_csv_path)
    report = {
        "raw_rows": len(df_raw),
        "raw_columns": list(df_raw.columns),
        "dropped_rows": 0,
        "dropped_reasons": {},
        "imputations": {},
        "engineered_columns": []
    }

    df = df_raw.copy()

    # 1. Clean Prices
    # Strip ₹ and commas
    df['discounted_price_clean'] = (
        df['discounted_price']
        .astype(str)
        .str.replace('₹', '', regex=False)
        .str.replace(',', '', regex=False)
        .str.strip()
    )
    df['discounted_price_clean'] = pd.to_numeric(df['discounted_price_clean'], errors='coerce')
    disc_price_median = float(df['discounted_price_clean'].median())
    disc_price_nulls = int(df['discounted_price_clean'].isna().sum())
    if disc_price_nulls > 0:
        df['discounted_price_clean'] = df['discounted_price_clean'].fillna(disc_price_median)
        report["imputations"]["discounted_price_clean"] = {
            "count": disc_price_nulls,
            "strategy": "median",
            "fill_value": disc_price_median
        }

    df['actual_price_clean'] = (
        df['actual_price']
        .astype(str)
        .str.replace('₹', '', regex=False)
        .str.replace(',', '', regex=False)
        .str.strip()
    )
    df['actual_price_clean'] = pd.to_numeric(df['actual_price_clean'], errors='coerce')
    act_price_median = float(df['actual_price_clean'].median())
    act_price_nulls = int(df['actual_price_clean'].isna().sum())
    if act_price_nulls > 0:
        df['actual_price_clean'] = df['actual_price_clean'].fillna(act_price_median)
        report["imputations"]["actual_price_clean"] = {
            "count": act_price_nulls,
            "strategy": "median",
            "fill_value": act_price_median
        }

    # 2. Clean Discount Percentage
    df['discount_percentage_clean'] = (
        df['discount_percentage']
        .astype(str)
        .str.replace('%', '', regex=False)
        .str.strip()
    )
    df['discount_percentage_clean'] = pd.to_numeric(df['discount_percentage_clean'], errors='coerce').astype(float)
    disc_pct_median = float(df['discount_percentage_clean'].median())
    disc_pct_nulls = int(df['discount_percentage_clean'].isna().sum())
    if disc_pct_nulls > 0:
        df['discount_percentage_clean'] = df['discount_percentage_clean'].fillna(disc_pct_median).astype(float)
        report["imputations"]["discount_percentage_clean"] = {
            "count": disc_pct_nulls,
            "strategy": "median",
            "fill_value": disc_pct_median
        }


    # 3. Clean Rating
    raw_ratings = df['rating'].astype(str)
    rating_numeric = pd.to_numeric(raw_ratings, errors='coerce')
    rating_nulls = int(rating_numeric.isna().sum())
    rating_median = float(rating_numeric.median())
    df['rating_clean'] = rating_numeric.fillna(rating_median)
    if rating_nulls > 0:
        report["imputations"]["rating_clean"] = {
            "count": rating_nulls,
            "strategy": "median (handled non-numeric e.g. '|')",
            "fill_value": rating_median
        }

    # 4. Clean Rating Count
    raw_rc = df['rating_count'].astype(str).str.replace(',', '', regex=False).str.strip()
    rc_numeric = pd.to_numeric(raw_rc, errors='coerce')
    rc_nulls = int(rc_numeric.isna().sum())
    rc_median = float(rc_numeric.median())
    df['rating_count_clean'] = rc_numeric.fillna(rc_median)
    if rc_nulls > 0:
        report["imputations"]["rating_count_clean"] = {
            "count": rc_nulls,
            "strategy": "median",
            "fill_value": rc_median
        }

    # 5. Extract Category Levels
    def parse_categories(cat_str):
        if pd.isna(cat_str):
            return "General", "General", "General"
        parts = [p.strip() for p in str(cat_str).split('|') if p.strip()]
        if not parts:
            return "General", "General", "General"
        main = parts[0]
        sub = parts[1] if len(parts) > 1 else "General"
        leaf = parts[-1]
        return main, sub, leaf

    cat_parsed = df['category'].apply(parse_categories)
    df['main_category'] = [c[0] for c in cat_parsed]
    df['sub_category'] = [c[1] for c in cat_parsed]
    df['leaf_category'] = [c[2] for c in cat_parsed]
    df['primary_category'] = df['main_category']  # Backward compatibility alias

    # 6. Engineered Buckets
    df['rating_bucket'] = df['rating_clean'].apply(assign_rating_bucket)
    df['discount_bucket'] = df['discount_percentage_clean'].apply(assign_discount_bucket)
    df['price_bucket'] = df['discounted_price_clean'].apply(assign_price_bucket)

    report["engineered_columns"].extend([
        "rating_bucket", "discount_bucket", "price_bucket",
        "main_category", "sub_category", "leaf_category"
    ])

    # 7. Classification Targets
    # Balanced rating tier (4.2 threshold chosen for ~47% / 53% class balance)
    df['rating_tier'] = df['rating_clean'].apply(lambda x: 'High' if x >= 4.2 else 'Low')
    # Backward compatibility target
    df['sales_category'] = df['rating_clean'].apply(lambda x: 'High' if x >= 4.0 else 'Low')

    # 8. Combined Features for NLP Recommender
    df['combined_features'] = (
        df['product_name'].fillna('') + ' ' +
        df['main_category'] + ' ' +
        df['sub_category'] + ' ' +
        df['about_product'].fillna('')
    )

    report["final_rows"] = len(df)
    report["final_columns"] = list(df.columns)

    if output_csv_path:
        os.makedirs(os.path.dirname(output_csv_path), exist_ok=True)
        df.to_csv(output_csv_path, index=False)

    return df, report
