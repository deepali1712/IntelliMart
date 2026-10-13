import pytest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from services.data_manager import DataManager

@pytest.fixture(scope="module")
def client():
    # Warm up data manager
    DataManager.get_instance()
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    json_data = res.get_json()
    assert json_data["data"]["status"] == "ready"
    assert json_data["data"]["row_count"] == 1465

def test_products_endpoint_pagination_and_filter(client):
    res = client.get('/api/products?page=1&per_page=10&min_rating=4.0')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data["data"]["products"]) == 10
    assert data["meta"]["page"] == 1
    assert data["meta"]["total"] > 0

def test_product_detail_404_error(client):
    res = client.get('/api/products/NONEXISTENT_ITEM_ID_999')
    assert res.status_code == 404
    data = res.get_json()
    assert data["error"] is not None
    assert "not found" in data["error"]["message"].lower()

def test_recommendation_exclusion_api(client):
    # Fetch a valid product
    prod_res = client.get('/api/products?per_page=1')
    prod_id = prod_res.get_json()["data"]["products"][0]["product_id"]

    rec_res = client.get(f'/api/products/{prod_id}/recommendations')
    assert rec_res.status_code == 200
    recs = rec_res.get_json()["data"]
    rec_ids = [r["product_id"] for r in recs]
    assert prod_id not in rec_ids

def test_olap_slice_api(client):
    res = client.post('/api/olap/slice', json={"dimension": "main_category", "value": "Electronics"})
    assert res.status_code == 200
    data = res.get_json()["data"]
    assert "SELECT *" in data["pseudo_sql"]
    assert data["rows_affected"] > 0
