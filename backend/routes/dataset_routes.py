import io
from flask import Blueprint, request, send_file, Response
from utils.response_helper import api_response, error_response
from services.data_manager import DataManager

dataset_bp = Blueprint('dataset', __name__)

@dataset_bp.route('/api/dataset/summary', methods=['GET'])
def get_summary():
    dm = DataManager.get_instance()
    summary = dm.get_summary()
    return api_response(data=summary)

@dataset_bp.route('/api/dataset/columns', methods=['GET'])
def get_columns():
    dm = DataManager.get_instance()
    columns = dm.get_columns()
    return api_response(data=columns)

@dataset_bp.route('/api/dataset/preview', methods=['GET'])
def get_preview():
    dm = DataManager.get_instance()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', None)
    category = request.args.get('category', None)
    sort_by = request.args.get('sort_by', None)
    sort_dir = request.args.get('sort_dir', 'asc')

    preview_data = dm.get_preview(
        page=page,
        per_page=per_page,
        search=search,
        category=category,
        sort_by=sort_by,
        sort_dir=sort_dir
    )
    return api_response(data=preview_data["items"], meta={
        "total": preview_data["total"],
        "page": preview_data["page"],
        "per_page": preview_data["per_page"],
        "total_pages": preview_data["total_pages"]
    })

@dataset_bp.route('/api/dataset/download', methods=['GET'])
def download_cleaned_csv():
    dm = DataManager.get_instance()
    if not dm.ready or dm.df is None:
        return error_response("Dataset not ready for download", status=503)

    csv_buffer = io.StringIO()
    dm.df.to_csv(csv_buffer, index=False)
    csv_bytes = io.BytesIO(csv_buffer.getvalue().encode('utf-8'))

    return send_file(
        csv_bytes,
        mimetype="text/csv",
        as_attachment=True,
        download_name="intellimart_cleaned_dataset.csv"
    )
