import pytest
import os
import pandas as pd
import numpy as np
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config import RAW_DATA_PATH
from services.cleaner import clean_dataset

def test_cleaner_numeric_parsing():
    df, report = clean_dataset(RAW_DATA_PATH)
    assert len(df) == 1465
    assert report["raw_rows"] == 1465
    assert report["dropped_rows"] == 0

    # Test price parsing
    assert pd.api.types.is_float_dtype(df['discounted_price_clean'])
    assert pd.api.types.is_float_dtype(df['actual_price_clean'])
    assert (df['discounted_price_clean'] > 0).all()
    assert (df['actual_price_clean'] > 0).all()

    # Test discount percentage parsing
    assert pd.api.types.is_float_dtype(df['discount_percentage_clean'])
    assert (df['discount_percentage_clean'] >= 0).all()
    assert (df['discount_percentage_clean'] <= 100).all()

    # Test rating parsing (specifically non-numeric '|' coercion)
    assert pd.api.types.is_float_dtype(df['rating_clean'])
    assert df['rating_clean'].isna().sum() == 0
    assert (df['rating_clean'] >= 1.0).all()
    assert (df['rating_clean'] <= 5.0).all()

    # Test rating count parsing
    assert pd.api.types.is_float_dtype(df['rating_count_clean'])
    assert df['rating_count_clean'].isna().sum() == 0

def test_cleaner_category_and_bucket_engineering():
    df, report = clean_dataset(RAW_DATA_PATH)
    assert "main_category" in df.columns
    assert "sub_category" in df.columns
    assert "rating_bucket" in df.columns
    assert "discount_bucket" in df.columns
    assert "price_bucket" in df.columns

    # Verify bucket values are populated without NaN
    assert df['rating_bucket'].isna().sum() == 0
    assert df['discount_bucket'].isna().sum() == 0
    assert df['price_bucket'].isna().sum() == 0

    # Verify classification targets
    assert set(df['rating_tier'].unique()).issubset({'High', 'Low'})
    assert set(df['sales_category'].unique()).issubset({'High', 'Low'})
