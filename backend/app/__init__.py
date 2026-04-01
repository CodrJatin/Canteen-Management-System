import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from .extensions import mongo
from .routes.orders import orders_bp
from .routes.stock import stock_bp 
from .routes.auth import auth_bp
from .routes.wallet import wallet_bp

# Load the variables from .env into the system
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    @app.route('/')
    def home():
        return {"status": "Canteen API is Live"}, 200
    
    # Add this global handler just in case the blueprint isn't catching the preflight
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
        return response

    # 1. Define origins
    production_url = os.getenv("FRONTEND_URL") 
    origins_whitelist = [
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ]
    if production_url:
        # Ensure there's no trailing slash to prevent CORS mismatch
        origins_whitelist.append(production_url.rstrip('/'))

    # 2. Initialize CORS (PRODUCTION READY)
    # This automatically handles OPTIONS preflight and prevents "Multiple Value" errors.
    CORS(app, resources={
    r"/api/*": {
        "origins": origins_whitelist,
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

    # Database Configuration
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    mongo.init_app(app)

    # 3. Register Blueprints with Organized Prefixes
    # Prefixing /api/orders ensures your frontend fetch hits the right spot.
    app.register_blueprint(stock_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(wallet_bp, url_prefix='/api')

    return app