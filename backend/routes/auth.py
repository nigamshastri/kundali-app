from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
from models.user import create_user, check_password, public_user
from config import MONGO_URI, JWT_SECRET, JWT_EXPIRY_HOURS, GOOGLE_SCRIPT_URL
import requests

auth_bp = Blueprint("auth", __name__)
client = MongoClient(MONGO_URI)
db = client["kundali_db"]
users_col = db["users"]

def make_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(token):
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return data["user_id"]
    except:
        return None

def get_current_user():
    auth = request.headers.get("Authorization", "")
    token = auth.replace("Bearer ", "").strip()
    if not token:
        return None
    uid = verify_token(token)
    if not uid:
        return None
    user = users_col.find_one({"_id": ObjectId(uid)})
    return user

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    name  = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    phone = data.get("phone", "").strip()
    password = data.get("password", "")

    if not all([name, email, phone, password]):
        return jsonify({"error": "બધાં ક્ષેત્રો ભરો"}), 400
    if len(password) < 6:
        return jsonify({"error": "પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરનો હોવો જોઈએ"}), 400
    if users_col.find_one({"email": email}):
        return jsonify({"error": "આ ઇ-મેઇલ પહેલાંથી નોંધાયેલ છે"}), 409

    user = create_user(name, email, phone, password)
    result = users_col.insert_one(user)
    user_id = str(result.inserted_id)
    token = make_token(user_id)

    # Sync to Google Sheets
    try:
        requests.post(GOOGLE_SCRIPT_URL, json={
            "action": "add_user",
            "userId": user_id,
            "name": name,
            "email": email,
            "phone": phone,
            "registeredAt": user["created_at"]
        }, timeout=5)
    except:
        pass

    user["_id"] = result.inserted_id
    return jsonify({"token": token, "user": public_user(user)}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = users_col.find_one({"email": email})
    if not user or not check_password(password, user["password"]):
        return jsonify({"error": "ઇ-મેઇલ અથવા પાસવર્ડ ખોટો છે"}), 401

    token = make_token(str(user["_id"]))
    return jsonify({"token": token, "user": public_user(user)}), 200

@auth_bp.route("/me", methods=["GET"])
def me():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"user": public_user(user)}), 200

@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    users_col.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "name": data.get("name", user["name"]),
            "phone": data.get("phone", user["phone"]),
            "profile.gender": data.get("gender", ""),
            "profile.city": data.get("city", ""),
            "profile.dob": data.get("dob", "")
        }}
    )
    updated = users_col.find_one({"_id": user["_id"]})
    return jsonify({"user": public_user(updated)}), 200
