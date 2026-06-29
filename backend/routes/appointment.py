from flask import Blueprint, request, jsonify
from datetime import datetime
from config import GOOGLE_SCRIPT_URL
from routes.auth import get_current_user
from database import get_db
import requests
import uuid

appt_bp = Blueprint("appointment", __name__)

def create_appointment(user_id, data):
    return {
        "appointment_id": "A" + str(uuid.uuid4())[:6].upper(),
        "user_id": user_id,
        "name": data.get("name", ""),
        "phone": data.get("phone", ""),
        "date": data.get("date", ""),
        "time": data.get("time", ""),
        "service": data.get("service", ""),
        "mode": data.get("mode", ""),
        "note": data.get("note", ""),
        "status": "pending",
        "booked_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

def serialize(doc):
    doc["_id"] = str(doc.get("_id", ""))
    return doc

@appt_bp.route("/book", methods=["POST"])
def book():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    db = get_db()
    appt = create_appointment(str(user["_id"]), data)
    db["appointments"].insert_one(appt)
    return jsonify({"message": "બુક થઈ!", "appointment": serialize(appt)}), 201

@appt_bp.route("/my", methods=["GET"])
def my_appointments():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    db = get_db()
    appts = list(db["appointments"].find({"user_id": str(user["_id"])}, sort=[("date", -1)]))
    return jsonify({"appointments": [serialize(a) for a in appts]}), 200

@appt_bp.route("/status/<appt_id>", methods=["PUT"])
def update_status(appt_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    db = get_db()
    db["appointments"].update_one(
        {"appointment_id": appt_id},
        {"$set": {"status": data.get("status"), "updated_at": datetime.utcnow().isoformat()}}
    )
    return jsonify({"message": "અપડેટ થયો"}), 200

@appt_bp.route("/cancel/<appt_id>", methods=["PUT"])
def cancel(appt_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    db = get_db()
    db["appointments"].update_one(
        {"appointment_id": appt_id},
        {"$set": {"status": "cancelled", "updated_at": datetime.utcnow().isoformat()}}
    )
    return jsonify({"message": "રદ કરી"}), 200

@appt_bp.route("/available-slots", methods=["GET"])
def available_slots():
    date = request.args.get("date")
    if not date:
        return jsonify({"error": "Date required"}), 400
    db = get_db()
    booked = db["appointments"].find({"date": date, "status": {"$nin": ["cancelled"]}}, {"time": 1})
    return jsonify({"booked_times": [b["time"] for b in booked]}), 200
