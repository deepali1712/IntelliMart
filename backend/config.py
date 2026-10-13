import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
RAW_DATA_PATH = os.path.join(DATA_DIR, 'amazon.csv')
CLEANED_DATA_PATH = os.path.join(DATA_DIR, 'amazon_cleaned.csv')

PORT = int(os.environ.get('PORT', 5001))
HOST = os.environ.get('HOST', '0.0.0.0')
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

RANDOM_SEED = 42

ALLOWED_DIMENSIONS = [
    "main_category",
    "sub_category",
    "rating_bucket",
    "discount_bucket",
    "price_bucket",
    "sales_category",
]

ALLOWED_MEASURES = [
    "product_count",
    "avg_price",
    "avg_discounted_price",
    "avg_rating",
    "avg_discount",
    "total_rating_count",
]

DIMENSION_COLUMN_MAP = {
    "main_category": "main_category",
    "sub_category": "sub_category",
    "rating_bucket": "rating_bucket",
    "discount_bucket": "discount_bucket",
    "price_bucket": "price_bucket",
    "sales_category": "sales_category",
}

MEASURE_AGG_MAP = {
    "product_count": ("product_id", "count"),
    "avg_price": ("actual_price_clean", "mean"),
    "avg_discounted_price": ("discounted_price_clean", "mean"),
    "avg_rating": ("rating_clean", "mean"),
    "avg_discount": ("discount_percentage_clean", "mean"),
    "total_rating_count": ("rating_count_clean", "sum"),
}
