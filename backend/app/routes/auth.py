from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import mongo 

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'customer')

    # Check if user exists
    if mongo.db.users.find_one({"username": username}):
        return jsonify({"error": "Username already taken"}), 400

    # Secure the password
    hashed_password = generate_password_hash(password)
    
    # --- UPDATED: ADDED walletBalance: 0 ---
    mongo.db.users.insert_one({
        "username": username,
        "password": hashed_password,
        "role": role,
        "walletBalance": 0  # Every new user starts with zero balance
    })
    
    return jsonify({"message": "Account created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = mongo.db.users.find_one({"username": username})

    if user and check_password_hash(user['password'], password):
        # Convert ObjectId to string if you need the ID on frontend
        user_id = str(user['_id']) 
        
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user_id,
                "username": user['username'],
                "role": user['role'],
                # .get(key, default) handles legacy users who don't have the field yet
                "walletBalance": user.get('walletBalance', 0)
            }
        }), 200
    
    return jsonify({"error": "Invalid username or password"}), 401