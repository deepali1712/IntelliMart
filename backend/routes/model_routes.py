from flask import Blueprint, request
from utils.response_helper import api_response, error_response
from services.data_manager import DataManager

model_bp = Blueprint('models', __name__)

# ==========================================
# 1. CLASSIFICATION (NAÏVE BAYES)
# ==========================================

@model_bp.route('/api/models/classification/evaluation', methods=['GET'])
def get_classification_eval():
    dm = DataManager.get_instance()
    return api_response(data=dm.ml_service.classification_eval)

@model_bp.route('/api/models/classification/predict', methods=['POST'])
def predict_classification():
    dm = DataManager.get_instance()
    req = request.json or {}
    actual_price = req.get('actual_price', 1000)
    discount_percentage = req.get('discount_percentage', 20)
    category = req.get('category', 'Computers&Accessories')

    result = dm.ml_service.predict_classification(
        actual_price=actual_price,
        discount_percentage=discount_percentage,
        category=category
    )
    return api_response(data=result)

# Legacy alias
@model_bp.route('/api/admin/metrics', methods=['GET'])
def legacy_metrics():
    dm = DataManager.get_instance()
    eval_data = dm.ml_service.classification_eval
    # AdminDashboard expects raw: {accuracy, precision, recall, f1_score}
    return api_response(data={
        "accuracy": eval_data["accuracy"],
        "precision": eval_data["precision"],
        "recall": eval_data["recall"],
        "f1_score": eval_data["f1_score"],
        "details": eval_data
    })

# Legacy alias
@model_bp.route('/api/admin/predict', methods=['POST'])
def legacy_predict():
    dm = DataManager.get_instance()
    req = request.json or {}
    actual_price = req.get('actual_price', 1000)
    discount_percentage = req.get('discount_percentage', 20)
    category = req.get('category', 'Computers&Accessories')

    result = dm.ml_service.predict_classification(actual_price, discount_percentage, category)
    return api_response(data=result)

# ==========================================
# 2. CLUSTERING (K-MEANS)
# ==========================================

@model_bp.route('/api/models/clustering/run', methods=['POST'])
def run_clustering():
    dm = DataManager.get_instance()
    req = request.json or {}
    k = req.get('k', 3)
    features = req.get('features', None)
    seed = req.get('seed', None)

    result = dm.ml_service.run_clustering(k=k, feature_names=features, seed=seed)
    return api_response(data=result)

@model_bp.route('/api/models/clustering/summary', methods=['GET'])
def get_clustering_summary():
    dm = DataManager.get_instance()
    k = request.args.get('k', 3, type=int)
    result = dm.ml_service.run_clustering(k=k)
    return api_response(data=result)

# Legacy alias
@model_bp.route('/api/admin/clusters', methods=['GET'])
def legacy_clusters():
    dm = DataManager.get_instance()
    k = request.args.get('k', 3, type=int)
    result = dm.ml_service.run_clustering(k=k)
    # AdminDashboard expects { points: [...] }
    # Also adapt fields for existing scatter chart
    points = []
    for p in result["points"]:
        points.append({
            "product_name": p["product_name"],
            "discount_percentage_clean": p["discount"],
            "rating_clean": p["rating"],
            "cluster": p["cluster"],
            "price": p["price"]
        })
    return api_response(data={"points": points, "details": result})

# ==========================================
# 3. REGRESSION (LINEAR REGRESSION)
# ==========================================

@model_bp.route('/api/models/regression/evaluation', methods=['GET'])
def get_regression_eval():
    dm = DataManager.get_instance()
    return api_response(data=dm.ml_service.regression_eval)

@model_bp.route('/api/models/regression/predict', methods=['POST'])
def predict_regression():
    dm = DataManager.get_instance()
    req = request.json or {}
    discount_percentage = req.get('discount_percentage', 20)
    rating = req.get('rating', 4.2)
    actual_price = req.get('actual_price', 1000)

    result = dm.ml_service.predict_regression(discount_percentage, rating, actual_price)
    return api_response(data=result)

# Legacy alias
@model_bp.route('/api/admin/regression', methods=['GET'])
def legacy_regression():
    dm = DataManager.get_instance()
    trend = dm.ml_service.regression_eval["trend_data"]
    # AdminDashboard expects: [{ discount: ..., salesVolume: ... }]
    adapted = [{"discount": t["discount"], "salesVolume": int(t["avg_rating_count"])} for t in trend]
    return api_response(data=adapted)
