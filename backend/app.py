"""
Main Application Entry Point for E-Book Management System API.
Author: Software Engineering Mini Project Team
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from database import init_database, get_db_status
from routes.auth import auth_bp
from routes.users import users_bp
from routes.books import books_bp
from routes.library import library_bp

# Load environment configuration
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'ebook-mini-project-secret-key-2026')

# Enable CORS for frontend requests (React / Vite)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register API Route Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(books_bp)
app.register_blueprint(library_bp)

@app.route('/')
def index():
    """Root endpoint verifying API server is online."""
    return jsonify({
        'name': 'E-Book Management System API',
        'status': 'Online',
        'version': '1.0.0',
        'db_info': get_db_status()
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint with database status."""
    return jsonify({
        'status': 'healthy',
        'database': get_db_status()
    })

# Global Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'message': 'Resource not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    # Initialize database tables and seed data upon startup
    print("=" * 65)
    print(" Starting E-Book Management System Backend Server")
    print("=" * 65)
    init_database()
    port = int(os.getenv('PORT', 5000))
    print(f"[SERVER] Running on http://127.0.0.1:{port}")
    app.run(host='127.0.0.1', port=port, debug=True)
