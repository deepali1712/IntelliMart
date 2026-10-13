import pytest
import os
import sys
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config import RAW_DATA_PATH
from services.cleaner import clean_dataset
from services.ml_service import MLService
from services.recommender_service import RecommenderService
from services.sentiment_service import SentimentService

@pytest.fixture(scope="module")
def dataset_and_services():
    df, _ = clean_dataset(RAW_DATA_PATH)
    ml = MLService(df, seed=42)
    rec = RecommenderService(df)
    sent = SentimentService(df)
    return df, ml, rec, sent

def test_naive_bayes_no_leakage_and_metrics_sanity(dataset_and_services):
    df, ml, _, _ = dataset_and_services
    eval_res = ml.classification_eval

    # Verify features used do NOT include rating or target
    features = eval_res["features_used"]
    for f in features:
        assert "rating" not in f.lower(), f"Potential target leakage in feature {f}!"

    # Metrics sanity
    assert 40.0 <= eval_res["accuracy"] <= 90.0
    assert 0.0 <= eval_res["precision"] <= 100.0
    assert 0.0 <= eval_res["recall"] <= 100.0
    assert 0.0 <= eval_res["f1_score"] <= 100.0

    # Test inference output
    pred = ml.predict_classification(actual_price=1500, discount_percentage=40, category="Electronics")
    assert pred["predicted_category"] in ["High", "Low"]
    assert abs((pred["probability_high"] + pred["probability_low"]) - 100.0) < 0.5

def test_recommender_strictly_excludes_query_item(dataset_and_services):
    df, _, rec, _ = dataset_and_services
    test_id = df.iloc[0]['product_id']

    recommendations = rec.recommend_for_product(test_id, top_k=5)
    assert len(recommendations) == 5

    # Check query item is strictly excluded
    rec_ids = [r["product_id"] for r in recommendations]
    assert test_id not in rec_ids, "Recommender returned query item itself!"

    # Check similarity score formatting & reasons
    for r in recommendations:
        assert 0.0 <= r["similarity_score"] <= 100.0
        assert len(r["reason"]) > 0

def test_vader_sentiment_sanity(dataset_and_services):
    _, _, _, sent = dataset_and_services
    summary = sent.get_summary()

    dist = summary["distribution"]
    assert len(dist) == 3
    names = {d["name"] for d in dist}
    assert names == {"Positive", "Neutral", "Negative"}

    total_pct = sum(d["value"] for d in dist)
    assert 99.0 <= total_pct <= 101.0
