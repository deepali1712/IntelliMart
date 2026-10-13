import pytest
import os
import sys
import pandas as pd
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config import RAW_DATA_PATH
from services.cleaner import clean_dataset
from services.olap_service import OLAPService

@pytest.fixture(scope="module")
def prepared_olap():
    df, _ = clean_dataset(RAW_DATA_PATH)
    service = OLAPService(df)
    return df, service

def test_olap_slice_against_pandas(prepared_olap):
    df, service = prepared_olap
    result = service.slice("main_category", "Computers&Accessories")

    expected_count = len(df[df['main_category'] == 'Computers&Accessories'])
    assert result["rows_affected"] == expected_count
    assert "SELECT *" in result["pseudo_sql"]
    assert "Computers&Accessories" in result["pseudo_sql"]

def test_olap_rollup_against_pandas(prepared_olap):
    df, service = prepared_olap
    result = service.rollup("main_category")

    # Manual pandas calculation
    manual = df.groupby('main_category').agg({
        'product_id': 'count',
        'actual_price_clean': 'mean'
    }).reset_index()

    rollup_data = result["data"]
    assert len(rollup_data) == len(manual)

    for item in rollup_data:
        cat = item['dimension']
        match_manual = manual[manual['main_category'] == cat].iloc[0]
        assert item['product_count'] == match_manual['product_id']
        assert abs(item['avg_actual_price'] - round(match_manual['actual_price_clean'], 2)) < 0.1

def test_olap_pivot_against_pandas(prepared_olap):
    df, service = prepared_olap
    result = service.pivot("main_category", "rating_bucket", "product_count")

    # Manual pandas pivot
    manual_pivot = pd.pivot_table(
        df,
        index='main_category',
        columns='rating_bucket',
        values='product_id',
        aggfunc='count',
        fill_value=0
    )

    for rec in result["table_data"]:
        cat = rec["row_dimension"]
        for col in result["col_headers"]:
            assert rec[col] == manual_pivot.loc[cat, col]
