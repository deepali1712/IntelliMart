from flask import Blueprint, request
from utils.response_helper import api_response, error_response
from services.data_manager import DataManager

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/analytics/sentiment', methods=['GET'])
def get_sentiment():
    dm = DataManager.get_instance()
    category = request.args.get('category', 'All')
    summary = dm.sentiment_service.get_summary(category=category)
    return api_response(data=summary)

@analytics_bp.route('/api/analytics/sentiment/by-category', methods=['GET'])
def get_sentiment_by_category():
    dm = DataManager.get_instance()
    summary = dm.sentiment_service.get_summary()
    return api_response(data=summary["category_breakdown"])

@analytics_bp.route('/api/analytics/sentiment/reviews', methods=['GET'])
def get_sentiment_reviews():
    dm = DataManager.get_instance()
    category = request.args.get('category', 'All')
    summary = dm.sentiment_service.get_summary(category=category)
    return api_response(data=summary["products"])

# Legacy alias
@analytics_bp.route('/api/admin/sentiment', methods=['GET'])
def legacy_sentiment():
    dm = DataManager.get_instance()
    category = request.args.get('category', 'All')
    summary = dm.sentiment_service.get_summary(category=category)
    # AdminDashboard expects: [{ name: "Positive", value: ..., color: ... }, ...]
    return api_response(data=summary["distribution"])

# Legacy alias for single product sentiment
@analytics_bp.route('/api/sentiment/<product_id>', methods=['GET'])
def legacy_product_sentiment(product_id):
    dm = DataManager.get_instance()
    res = dm.sentiment_service.get_product_sentiment(product_id)
    if not res:
        return error_response(f"Product '{product_id}' not found", status=404)

    # Legacy format: positive_pct, neutral_pct, negative_pct
    return api_response(data={
        "positive_pct": round(res["pos"] * 100, 1),
        "neutral_pct": round(res["neu"] * 100, 1),
        "negative_pct": round(res["neg"] * 100, 1),
        "sentiment": res["sentiment"],
        "compound": res["compound"],
        "sample_reviews": [res["review_snippet"]]
    })

@analytics_bp.route('/api/analytics/association-rules', methods=['POST', 'GET'])
def get_association_rules():
    dm = DataManager.get_instance()
    if request.method == 'POST':
        req = request.json or {}
    else:
        req = request.args.to_dict()

    basket_type = req.get('basket_type', 'sub_category') # 'sub_category' or 'product'
    min_support = float(req.get('min_support', 0.01))
    min_confidence = float(req.get('min_confidence', 0.1))
    min_lift = float(req.get('min_lift', 1.0))
    max_len = int(req.get('max_len', 3))

    rules_result = dm.association_service.mine_rules(
        basket_type=basket_type,
        min_support=min_support,
        min_confidence=min_confidence,
        min_lift=min_lift,
        max_len=max_len
    )
    return api_response(data=rules_result)

# Legacy alias
@analytics_bp.route('/api/admin/apriori', methods=['GET'])
def legacy_apriori():
    dm = DataManager.get_instance()
    rules_result = dm.association_service.mine_rules(
        basket_type='sub_category',
        min_support=0.01,
        min_confidence=0.05,
        min_lift=0.5
    )
    # AdminDashboard expects: [{ rule: "A → B", support: "X%", confidence: "Y%" }]
    formatted = []
    for r in rules_result["rules"][:10]:
        formatted.append({
            "rule": r["rule"],
            "support": f"{r['support_pct']}%",
            "confidence": f"{r['confidence_pct']}%"
        })
    return api_response(data=formatted)
