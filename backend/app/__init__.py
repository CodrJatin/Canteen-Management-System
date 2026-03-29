import os
from flask import Flask, make_response
from flask_cors import CORS
from dotenv import load_dotenv
from .extensions import mongo
from .routes.orders import orders_bp
from .routes.stock import stock_bp 
from .routes.auth import auth_bp

# Load the variables from .env into the system
load_dotenv()

def create_app():
    app = Flask(__name__)

    # 1. Define origins
    production_url = os.getenv("FRONTEND_URL") 
    origins_whitelist = [
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ]
    if production_url:
        # Ensure there's no trailing slash in the URL from env
        origins_whitelist.append(production_url.rstrip('/'))

    # 2. Initialize CORS with broad support for the Preflight check
    CORS(app, resources={
        r"/api/*": {
            "origins": origins_whitelist,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # 3. GLOBAL PREFLIGHT HANDLER (The Vercel Fix)
    @app.after_request
    def handle_options(response):
        # If the browser is just asking for permission (OPTIONS)
        # we make sure it gets a 200 OK immediately.
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    # Database Configuration
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    mongo.init_app(app)

    # Register Blueprints
    # Note: Ensure these blueprints use the url_prefix='/api' if your React code expects it
    app.register_blueprint(stock_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    return app