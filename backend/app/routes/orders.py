from flask import Blueprint, jsonify
from app.extensions import mongo # Using our established extensions pattern

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        # Fetch all orders, sorted by newest first
        all_orders = list(mongo.db.orders.find().sort("date", -1).sort("timePaid", -1))
        
        for order in all_orders:
            order['_id'] = str(order['_id']) # Convert ObjectId to string
            
        return jsonify(all_orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500