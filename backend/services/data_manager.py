import time
import os
import pandas as pd
import numpy as np
from config import RAW_DATA_PATH, CLEANED_DATA_PATH, RANDOM_SEED
from services.cleaner import clean_dataset
from services.olap_service import OLAPService
from services.ml_service import MLService
from services.sentiment_service import SentimentService
from services.association_service import AssociationService
from services.recommender_service import RecommenderService

class DataManager:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = DataManager()
        return cls._instance

    def __init__(self):
        self.startup_time = time.time()
        self.ready = False
        self.init_error = None
        self.df = None
        self.cleaning_report = None
        self.olap_service = None
        self.ml_service = None
        self.sentiment_service = None
        self.association_service = None
        self.recommender_service = None

        self.initialize()

    def initialize(self):
        try:
            print("==> Initializing IntelliMart Data Warehouse Pipeline...")
            # 1. Clean dataset and build analytical dataframe
            self.df, self.cleaning_report = clean_dataset(RAW_DATA_PATH, CLEANED_DATA_PATH)
            print(f"Loaded and cleaned {len(self.df)} records.")

            # 2. Warm up OLAP
            print("Warming up OLAP engine...")
            self.olap_service = OLAPService(self.df)

            # 3. Warm up ML models (Classification, Clustering, Regression)
            print("Warming up Machine Learning models (Naïve Bayes, K-Means, Regression)...")
            self.ml_service = MLService(self.df, seed=RANDOM_SEED)

            # 4. Warm up Sentiment Analyzer
            print("Warming up VADER Sentiment Analyzer...")
            self.sentiment_service = SentimentService(self.df)

            # 5. Warm up Association Rules
            print("Mining co-review reviewer baskets for Apriori...")
            self.association_service = AssociationService(self.df)

            # 6. Warm up TF-IDF Recommender
            print("Building TF-IDF Recommender index...")
            self.recommender_service = RecommenderService(self.df)

            self.ready = True
            print("==> IntelliMart Data & Analytics Engine READY!")
        except Exception as e:
            self.ready = False
            self.init_error = str(e)
            print(f"Error during DataManager initialization: {e}")

    def get_health(self):
        return {
            "status": "ready" if self.ready else "error",
            "uptime_seconds": round(time.time() - self.startup_time, 1),
            "dataset_loaded": self.ready and self.df is not None,
            "row_count": len(self.df) if self.df is not None else 0,
            "models_ready": {
                "olap_cube": self.olap_service is not None,
                "naive_bayes": self.ml_service is not None,
                "kmeans_clustering": self.ml_service is not None,
                "linear_regression": self.ml_service is not None,
                "vader_sentiment": self.sentiment_service is not None,
                "apriori_association": self.association_service is not None,
                "tfidf_recommender": self.recommender_service is not None,
            },
            "init_error": self.init_error
        }

    def get_summary(self):
        if not self.ready:
            return {}

        df = self.df
        numeric_cols = ['discounted_price_clean', 'actual_price_clean', 'discount_percentage_clean', 'rating_clean', 'rating_count_clean']
        stats = {}
        for col in numeric_cols:
            stats[col] = {
                "mean": round(float(df[col].mean()), 2),
                "std": round(float(df[col].std()), 2),
                "min": round(float(df[col].min()), 2),
                "median": round(float(df[col].median()), 2),
                "max": round(float(df[col].max()), 2),
            }

        cat_counts = df['main_category'].value_counts().to_dict()
        category_dist = [{"category": k, "count": int(v)} for k, v in cat_counts.items()]

        return {
            "total_records": len(df),
            "total_columns": len(df.columns),
            "unique_categories": df['main_category'].nunique(),
            "unique_subcategories": df['sub_category'].nunique(),
            "cleaning_report": self.cleaning_report,
            "numeric_stats": stats,
            "category_distribution": category_dist,
            "average_rating": round(float(df['rating_clean'].mean()), 2),
            "average_discount": round(float(df['discount_percentage_clean'].mean()), 1),
            "total_reviews_proxy": int(df['rating_count_clean'].sum()),
        }

    def get_columns(self):
        if not self.ready:
            return []

        cols = []
        for col in self.df.columns:
            dtype = str(self.df[col].dtype)
            null_count = int(self.df[col].isna().sum())
            cols.append({
                "column_name": col,
                "dtype": dtype,
                "null_count": null_count,
                "sample_values": [str(x) for x in self.df[col].dropna().head(3).tolist()],
                "is_engineered": col in self.cleaning_report.get("engineered_columns", [])
            })
        return cols

    def get_preview(self, page=1, per_page=20, search=None, category=None, sort_by=None, sort_dir="asc"):
        if not self.ready:
            return {"items": [], "total": 0, "page": page, "per_page": per_page}

        data = self.df.copy()

        if category and category != "All":
            data = data[data['main_category'] == category]

        if search and search.strip():
            s = search.strip().lower()
            data = data[
                data['product_name'].str.lower().str.contains(s, na=False) |
                data['main_category'].str.lower().str.contains(s, na=False) |
                data['sub_category'].str.lower().str.contains(s, na=False)
            ]

        if sort_by and sort_by in data.columns:
            ascending = (sort_dir != "desc")
            data = data.sort_values(by=sort_by, ascending=ascending)

        total = len(data)
        per_page = min(100, max(1, int(per_page)))
        page = max(1, int(page))
        start = (page - 1) * per_page
        end = start + per_page

        preview_cols = [
            'product_id', 'product_name', 'main_category', 'sub_category',
            'discounted_price_clean', 'actual_price_clean', 'discount_percentage_clean',
            'rating_clean', 'rating_count_clean', 'rating_bucket', 'discount_bucket',
            'price_bucket', 'img_link'
        ]

        page_records = data[preview_cols].iloc[start:end].to_dict(orient='records')

        return {
            "items": page_records,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": int(np.ceil(total / per_page)) if total > 0 else 1
        }
