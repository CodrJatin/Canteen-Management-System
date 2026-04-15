import os
from flask import Flask, make_response, request
from flask_cors import CORS
from dotenv import load_dotenv
from .extensions import mongo
from .routes.orders import orders_bp
from .routes.stock import stock_bp 
from .routes.auth import auth_bp
from .routes.wallet import wallet_bp


load_dotenv()

def create_app():
    app = Flask(__name__)
    
    @app.route('/')
    def home():
        return {"status": "Canteen API is Live"}, 200

    
    production_url = os.getenv("FRONTEND_URL") 
    origins_whitelist = [
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ]
    if production_url:
        
        origins_whitelist.append(production_url.rstrip('/'))

    
    CORS(app, resources={
        r"/api/*": {
            "origins": origins_whitelist,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    mongo.init_app(app)

    
    app.register_blueprint(stock_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(wallet_bp, url_prefix='/api')

    return app