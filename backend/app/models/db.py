from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def get_db():
    uri = os.getenv("MONGO_URI")
    client = MongoClient(uri)
    
    # 1. Use the name from your REAL DATABASE LIST
    db = client["canteenDB"] 
    
    # 2. Let's confirm the collection is inside
    print("--- SUCCESS! ---")
    print(f"Connected to Database: {db.name}")
    print(f"Collections inside: {db.list_collection_names()}")
    print("----------------")
    
    return db