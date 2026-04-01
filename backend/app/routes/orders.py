from bson import ObjectId
from datetime import datetime, timezone, timedelta
from app.extensions import mongo
from flask import Blueprint, jsonify, request
from pymongo import UpdateOne
from bson import ObjectId

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        # Fetch all orders, sorted by newest first
        all_orders = list(mongo.db.orders.find().sort("date", -1).sort("timePaid", -1))
        
        for order in all_orders:
            order['_id'] = str(order['_id']) # Convert ObjectId to string
            
        return jsonify(all_orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@orders_bp.route('/orders/place', methods=['POST'])
def place_order():
    try:
        data = request.json
        user_id = data.get('user_id')
        items = data.get('items') 
        total_amount = float(data.get('total_amount', 0))

        # 1. Fetch User & Check Balance
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user or user.get('walletBalance', 0) < total_amount:
            return jsonify({"error": "Insufficient wallet balance"}), 400

        # --- THE STOCK DEDUCTION (BULK APPROACH) ---
        bulk_ops = []
        for item in items:
            bulk_ops.append(
                UpdateOne(
                    {"_id": ObjectId(item['id'])}, 
                    {"$inc": {"quantity": -item['qty']}}
                )
            )
        
        if bulk_ops:
            # Executes all deductions in one database trip
            mongo.db.stock.bulk_write(bulk_ops)

        # 2. Deduct Balance
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"walletBalance": -total_amount}}
        )

        # 3. Generate Custom Data for your JSON structure
        # 1. Define IST and get the current time OBJECT
        IST = timezone(timedelta(hours=5, minutes=30))
        now_obj = datetime.now(IST) 
        
        # 2. Generate the ID
        raw_id = str(ObjectId())
        custom_id = f"ORD-{raw_id[-6:].upper()}" 

        # 3. Create Order Object
        new_order = {
            "id": custom_id,                          
            "user_id": user_id,                       
            "userName": user.get('username'),         
            "total": total_amount,
            "status": "Paid",                         
            "date": now_obj.strftime("%Y-%m-%d"),
            "timePaid": now_obj.strftime("%H:%M:%S"), 
            "timePreparing": None,
            "timeServed": None,
            "items": items                             
        }

        # 5. Save to Database
        # Note: MongoDB will still add an internal "_id" ($oid) automatically
        mongo.db.orders.insert_one(new_order)

        return jsonify({
            "message": "Order placed successfully",
            "order_id": new_order["id"],              # Returning the ORD-XXXX ID
            "new_balance": user.get('walletBalance', 0) - total_amount,
            "total": total_amount
        }), 201

    except Exception as e:
        print(f"ORDER ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

@orders_bp.route('/orders/status/<order_id>', methods=['PATCH', 'OPTIONS'])
def update_order_status(order_id):


    if request.method == 'OPTIONS':
        return '', 200 # Handle the preflight handshake


    try:
        # We search for the custom order_id (e.g., ORD-XXXXXX)
        order = mongo.db.orders.find_one({"id": order_id})
        
        if not order:
            return jsonify({"error": "Order not found"}), 404

        IST = timezone(timedelta(hours=5, minutes=30))
        now = datetime.now(IST).strftime("%H:%M:%S")
        
        mongo.db.orders.update_one(
        {"id": order_id, "status": "Paid"},
        {
            "$set": {
            "status": "Preparing",
            "timePreparing": now
        }
    }
)

        return jsonify({
            "message": f"Order {order_id} is now Preparing",
            "status": "Preparing"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# orders.py

@orders_bp.route('/orders/chef', methods=['GET'])
def get_chef_orders():
    try:
        # Fetch only orders that are currently being prepared
        chef_orders = list(mongo.db.orders.find({"status": "Preparing"}).sort("timePreparing", 1))
        
        for order in chef_orders:
            order['_id'] = str(order['_id'])
            
        return jsonify(chef_orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orders_bp.route('/orders/serve/<order_id>', methods=['PATCH', 'OPTIONS'])
def mark_as_served(order_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        IST = timezone(timedelta(hours=5, minutes=30))
        now = datetime.now(IST).strftime("%H:%M:%S")
        
        result = mongo.db.orders.update_one(
            {"id": order_id},
            {"$set": {
                "status": "Served",
                "timeServed": now
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Order not found"}), 404
            
        return jsonify({"message": f"Order {order_id} served!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500