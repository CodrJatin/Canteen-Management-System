from flask import Blueprint, request, jsonify
from app.models.db import get_db
from bson import ObjectId

stock_bp = Blueprint('stock', __name__)
db = get_db()

@stock_bp.route('/stock', methods=['GET'])

@stock_bp.route('/stock', methods=['GET'])
def get_stock():
    try:
        items = list(db.stock.find()) 
        for item in items:
            item['_id'] = str(item['_id'])
        return jsonify(items)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@stock_bp.route('/api/stock', methods=['POST'])
def add_item():
    try:
        new_item = request.json
        # Ensure 'stock' and 'price' are numbers
        new_item['quantity'] = int(new_item.get('quantity', 0))
        new_item['price'] = float(new_item.get('price', 0))
        
        result = db.stock.insert_one(new_item)
        new_item['_id'] = str(result.inserted_id)
        return jsonify(new_item), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@stock_bp.route('/stock/<item_id>', methods=['PUT'])
def update_stock_item(item_id): # Renamed to be unique
    try:
        data = request.json
        # Convert numeric strings to actual numbers
        if 'price' in data: data['price'] = float(data['price'])
        if 'quantity' in data: data['quantity'] = int(data['quantity'])

        result = db.stock.update_one(
            {'_id': ObjectId(item_id)},
            {'$set': data}
        )
        
        if result.matched_count:
            return jsonify({"message": "Updated successfully"}), 200
        return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@stock_bp.route('/api/stock/<item_id>', methods=['DELETE'])
def delete_stock_item(item_id): # Renamed to be unique
    try:
        result = db.stock.delete_one({'_id': ObjectId(item_id)})
        if result.deleted_count:
            return jsonify({"message": "Deleted successfully"}), 200
        return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500