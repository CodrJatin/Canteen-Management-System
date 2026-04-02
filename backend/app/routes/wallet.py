from flask import Blueprint, request, jsonify
from bson import ObjectId
from app.extensions import mongo

wallet_bp = Blueprint('wallet', __name__)

# --- 1. RECHARGE (Add Money) ---
@wallet_bp.route('/wallet/recharge', methods=['POST'])
@wallet_bp.route('/recharge', methods=['POST'])
def recharge_wallet():
    try:
        data = request.json
        user_id = data.get('user_id')
        amount = float(data.get('amount', 0))

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # We use $inc to directly update the field in MongoDB
        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$inc': {'walletBalance': amount}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "message": "Recharge successful", 
            "added": amount
        }), 200

    except Exception as e:
        # This will now print the actual error to your terminal
        print(f"CRASH ERROR: {str(e)}") 
        return jsonify({"error": str(e)}), 500


# --- 2. DEDUCT (Place Order) ---
@wallet_bp.route('/wallet/deduct', methods=['POST'])
def deduct_balance():
    try:
        data = request.json
        user_id = data.get('user_id')
        total_bill = float(data.get('amount', 0))

        # Security: Fetch current user to verify funds
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        current_balance = float(user.get('walletBalance', 0))

        # THE GATEKEEPER: Prevent negative balance
        if current_balance < total_bill:
            return jsonify({
                "error": "Insufficient Funds", 
                "required": total_bill, 
                "available": current_balance
            }), 402

        # If funds are okay, proceed to deduct
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$inc': {'walletBalance': -total_bill}}
        )

        return jsonify({"message": "Payment successful", "deducted": total_bill}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500