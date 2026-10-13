from flask import Blueprint
from utils.response_helper import api_response
from services.data_manager import DataManager

health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health', methods=['GET'])
def check_health():
    dm = DataManager.get_instance()
    health_data = dm.get_health()
    status_code = 200 if health_data["status"] == "ready" else 503
    return api_response(data=health_data, status=status_code)
