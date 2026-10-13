from flask import Blueprint, request
from utils.response_helper import api_response, error_response
from services.data_manager import DataManager

olap_bp = Blueprint('olap', __name__)

@olap_bp.route('/api/olap/slice', methods=['POST'])
def olap_slice():
    dm = DataManager.get_instance()
    req = request.json or {}
    dimension = req.get('dimension', 'main_category')
    value = req.get('value', 'Computers&Accessories')
    result = dm.olap_service.slice(dimension=dimension, value=value)
    return api_response(data=result)

@olap_bp.route('/api/olap/dice', methods=['POST'])
def olap_dice():
    dm = DataManager.get_instance()
    req = request.json or {}
    result = dm.olap_service.dice(conditions=req)
    return api_response(data=result)

@olap_bp.route('/api/olap/rollup', methods=['POST'])
def olap_rollup():
    dm = DataManager.get_instance()
    req = request.json or {}
    level = req.get('level', 'main_category')
    category = req.get('category', 'All')
    result = dm.olap_service.rollup(level=level, category=category)
    return api_response(data=result)

@olap_bp.route('/api/olap/drilldown', methods=['POST'])
def olap_drilldown():
    dm = DataManager.get_instance()
    req = request.json or {}
    category = req.get('category', 'Computers&Accessories')
    sub_category = req.get('sub_category', None)
    result = dm.olap_service.drilldown(category=category, sub_category=sub_category)
    return api_response(data=result)

@olap_bp.route('/api/olap/pivot', methods=['POST'])
def olap_pivot():
    dm = DataManager.get_instance()
    req = request.json or {}
    row_dim = req.get('row_dim', 'main_category')
    col_dim = req.get('col_dim', 'rating_bucket')
    measure = req.get('measure', 'product_count')
    result = dm.olap_service.pivot(row_dim=row_dim, col_dim=col_dim, measure=measure)
    return api_response(data=result)

# Legacy alias for backward compatibility with existing AdminDashboard
@olap_bp.route('/api/admin/olap', methods=['POST'])
def legacy_olap():
    dm = DataManager.get_instance()
    req = request.json or {}
    op = req.get('operation', 'slice')
    category = req.get('category', 'All')

    if op == 'slice':
        result = dm.olap_service.slice(dimension='main_category', value=category if category != 'All' else 'Computers&Accessories')
    elif op == 'dice':
        result = dm.olap_service.dice(conditions={
            "category": category,
            "min_rating": req.get('min_rating', 0),
            "min_discount": req.get('min_discount', 0)
        })
    elif op == 'rollup':
        result = dm.olap_service.rollup(level='main_category', category=category)
    elif op == 'drilldown':
        result = dm.olap_service.drilldown(category=category if category != 'All' else 'Computers&Accessories')
    elif op == 'pivot':
        result = dm.olap_service.pivot(row_dim='main_category', col_dim='rating_bucket', measure='product_count')
    else:
        result = dm.olap_service.slice(dimension='main_category', value='Computers&Accessories')

    # Return raw dict so existing AdminDashboard works without breaking
    return api_response(data=result)
