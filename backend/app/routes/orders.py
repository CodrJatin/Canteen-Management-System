from bson import ObjectId
from datetime import datetime, timezone, timedelta
from app.extensions import mongo
from flask import Blueprint, jsonify, request
from pymongo import UpdateOne

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        
        all_orders = list(mongo.db.orders.find().sort("date", -1).sort("timePaid", -1))
        
        for order in all_orders:
            order['_id'] = str(order['_id']) 
            
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

        
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user or user.get('walletBalance', 0) < total_amount:
            return jsonify({"error": "Insufficient wallet balance"}), 400

        
        bulk_ops = []
        for item in items:
            bulk_ops.append(
                UpdateOne(
                    {"_id": ObjectId(item['id'])}, 
                    {"$inc": {"quantity": -item['qty']}}
                )
            )
        
        if bulk_ops:
            
            mongo.db.stock.bulk_write(bulk_ops)

        
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"walletBalance": -total_amount}}
        )

        
        
        IST = timezone(timedelta(hours=5, minutes=30))
        now_obj = datetime.now(IST) 
        
        
        raw_id = str(ObjectId())
        custom_id = f"ORD-{raw_id[-6:].upper()}" 

        
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

        
        
        mongo.db.orders.insert_one(new_order)

        return jsonify({
            "message": "Order placed successfully",
            "order_id": new_order["id"],              
            "new_balance": user.get('walletBalance', 0) - total_amount,
            "total": total_amount
        }), 201

    except Exception as e:
        print(f"ORDER ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

@orders_bp.route('/orders/status/<order_id>', methods=['PATCH'])
def update_order_status(order_id):

    try:
        
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
    



@orders_bp.route('/orders/chef', methods=['GET'])
def get_chef_orders():
    try:
        
        chef_orders = list(mongo.db.orders.find({"status": "Preparing"}).sort("timePreparing", 1))
        
        for order in chef_orders:
            order['_id'] = str(order['_id'])
            
        return jsonify(chef_orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orders_bp.route('/orders/serve/<order_id>', methods=['PATCH'])
def mark_as_served(order_id):
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
    

@orders_bp.route('/orders/user/<user_id>', methods=['GET'])
def get_user_orders(user_id):
    try:
        user_orders = list(mongo.db.orders.find({"user_id": user_id}).sort("date", -1).sort("timePaid", -1))
        for o in user_orders:
            o['_id'] = str(o['_id'])
        return jsonify(user_orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orders_bp.route('/orders/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    try:
        
        order = mongo.db.orders.find_one({"id": order_id})
        
        if not order:
            return jsonify({"error": "Order not found"}), 404

        
        if order.get("status") == "Served":
            return jsonify({"error": "Cannot delete an order that has already been served."}), 400

        
        user_id = order.get('user_id')
        total_amount = float(order.get('total', 0))
        
        from pymongo import ReturnDocument
        updated_user = mongo.db.users.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$inc": {"walletBalance": total_amount}},
            return_document=ReturnDocument.AFTER
        )
        new_balance = updated_user.get('walletBalance', 0) if updated_user else 0

        
        items = order.get('items', [])
        bulk_ops = []
        for item in items:
            bulk_ops.append(
                UpdateOne(
                    {"_id": ObjectId(item['id'])}, 
                    {"$inc": {"quantity": item['qty']}}
                )
            )
        
        if bulk_ops:
            mongo.db.stock.bulk_write(bulk_ops)

        
        mongo.db.orders.delete_one({"id": order_id})

        return jsonify({
            "message": f"Order {order_id} deleted successfully. Refunded ₹{total_amount}.",
            "new_balance": new_balance
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500