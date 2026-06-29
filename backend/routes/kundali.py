from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from models.kundali import create_kundali
from config import MONGO_URI, GOOGLE_SCRIPT_URL
from routes.auth import get_current_user
import requests

kundali_bp = Blueprint("kundali", __name__)
client = MongoClient(MONGO_URI)
db = client["kundali_db"]
kundali_col = db["kundalis"]

@kundali_bp.route("/save", methods=["POST"])
def save_kundali():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    kundali = create_kundali(str(user["_id"]), data)
    result = kundali_col.insert_one(kundali)
    kundali["_id"] = str(result.inserted_id)

    # Sync to Google Sheets
    try:
        requests.post(GOOGLE_SCRIPT_URL, json={
            "action": "save_kundali",
            "kundaliId": kundali["kundali_id"],
            "userId": str(user["_id"]),
            "name": kundali["name"],
            "dob": kundali["dob"],
            "tob": kundali["tob"],
            "pob": kundali["pob"],
            "lagna": kundali["lagna"],
            "savedAt": kundali["saved_at"]
        }, timeout=5)
    except:
        pass

    return jsonify({"message": "કુંડળી સાચવી!", "kundali": serialize(kundali)}), 201

@kundali_bp.route("/my", methods=["GET"])
def my_kundalis():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    records = list(kundali_col.find(
        {"user_id": str(user["_id"])},
        sort=[("saved_at", -1)]
    ))
    return jsonify({"kundalis": [serialize(k) for k in records]}), 200

@kundali_bp.route("/<kundali_id>", methods=["GET"])
def get_kundali(kundali_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    record = kundali_col.find_one({
        "kundali_id": kundali_id,
        "user_id": str(user["_id"])
    })
    if not record:
        return jsonify({"error": "મળ્યું નહીં"}), 404
    return jsonify({"kundali": serialize(record)}), 200

@kundali_bp.route("/<kundali_id>", methods=["DELETE"])
def delete_kundali(kundali_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    kundali_col.delete_one({
        "kundali_id": kundali_id,
        "user_id": str(user["_id"])
    })
    return jsonify({"message": "કાઢી નાખ્યું"}), 200

def serialize(doc):
    doc["_id"] = str(doc.get("_id", ""))
    return doc
