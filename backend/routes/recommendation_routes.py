from flask import Blueprint, request
from utils.response_helper import api_response, error_response
from services.data_manager import DataManager

rec_bp = Blueprint('recommendations', __name__)

@rec_bp.route('/api/products/<product_id>/recommendations', methods=['GET'])
def get_recommendations_for_product(product_id):
    dm = DataManager.get_instance()
    top_k = request.args.get('limit', 5, type=int)
    recs = dm.recommender_service.recommend_for_product(product_id, top_k=top_k)
    if recs is None:
        return error_response(f"Product '{product_id}' not found", status=404)
    return api_response(data=recs)

@rec_bp.route('/api/recommendations/search', methods=['GET'])
def get_recommendations_for_text():
    dm = DataManager.get_instance()
    query = request.args.get('q', '')
    top_k = request.args.get('limit', 5, type=int)
    recs = dm.recommender_service.recommend_for_text(query, top_k=top_k)
    return api_response(data=recs)

# Legacy alias
@rec_bp.route('/api/recommend/<product_id>', methods=['GET'])
def legacy_recommend(product_id):
    dm = DataManager.get_instance()
    recs = dm.recommender_service.recommend_for_product(product_id, top_k=5)
    if recs is None:
        return error_response(f"Product '{product_id}' not found", status=404)
    return api_response(data=recs)
