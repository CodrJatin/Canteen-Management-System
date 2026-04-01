import os
from flask import Flask, make_response, request
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

    # 1. Define origins
    production_url = os.getenv("FRONTEND_URL") 
    origins_whitelist = [
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ]
    if production_url:
        # Ensure there's no trailing slash in the URL from env
        origins_whitelist.append(production_url.rstrip('/'))

    # 2. Initialize CORS (Supports Credentials & Patch)
    CORS(app, resources={
        r"/api/*": {
            "origins": origins_whitelist,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # 3. GLOBAL PREFLIGHT & CORS HANDLER (The Vercel Fix)
    @app.after_request
    def handle_cors_and_options(response):
        # Dynamically set origin to allow credentials
        origin = request.headers.get('Origin')
        if origin in origins_whitelist:
            response.headers.add('Access-Control-Allow-Origin', origin)
            
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        
        # If the browser is just doing a preflight check (OPTIONS)
        if request.method == 'OPTIONS':
            return make_response('', 200)
            
        return response

    # 4. Database Configuration
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    mongo.init_app(app)

    # 5. Register Blueprints with Organized Prefixes
    app.register_blueprint(stock_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(wallet_bp, url_prefix='/api')

    return app