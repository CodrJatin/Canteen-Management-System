import os
from flask import Flask
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
    CORS(app)

    production_url = os.getenv("FRONTEND_URL") 
    
    origins_whitelist = [
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ]
    
    if production_url:
        origins_whitelist.append(production_url)

    # 2. Apply CORS to the /api/* routes specifically
    CORS(app, resources={
        r"/api/*": {
            "origins": origins_whitelist,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })




    # SECURE: Get the URI from the environment variable instead of hardcoding it
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    
    # Initialize Mongo with the app
    mongo.init_app(app)

    # Register Blueprints
    app.register_blueprint(stock_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(auth_bp)

    return app