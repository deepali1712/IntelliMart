import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import PORT, HOST, CORS_ORIGINS
from services.data_manager import DataManager
from routes.health_routes import health_bp
from routes.dataset_routes import dataset_bp
from routes.catalog_routes import catalog_bp
from routes.olap_routes import olap_bp
from routes.model_routes import model_bp
from routes.analytics_routes import analytics_bp
from routes.recommendation_routes import rec_bp

def create_app():
    app = Flask(__name__)

    # Restrict dev CORS to Vite origin
    CORS(app, origins=CORS_ORIGINS, supports_credentials=True)

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(dataset_bp)
    app.register_blueprint(catalog_bp)
    app.register_blueprint(olap_bp)
    app.register_blueprint(model_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(rec_bp)

    @app.route('/', methods=['GET'])
    def root():
        dm = DataManager.get_instance()
        return jsonify({
            "service": "IntelliMart Data Warehousing & Data Mining API",
            "version": "2.0.0",
            "status": "ready" if dm.ready else "initializing",
            "docs": "/admin/docs",
            "health": "/api/health"
        })

    # Global 404 handler
    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({
            "data": None,
            "meta": {},
            "error": {"message": "Resource not found", "status": 404}
        }), 404

    # Global 500 handler
    @app.errorhandler(500)
    def handle_server_error(e):
        return jsonify({
            "data": None,
            "meta": {},
            "error": {"message": "Internal server error occurred", "status": 500}
        }), 500

    return app

if __name__ == '__main__':
    print(f"Starting IntelliMart API on http://{HOST}:{PORT}...")
    # Initialize DataManager warming cache before server accepts traffic
    DataManager.get_instance()
    app = create_app()
    app.run(host=HOST, port=PORT, debug=False)