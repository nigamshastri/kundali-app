from flask import Blueprint, request, jsonify
from datetime import datetime
from models.appointment import create_appointment, auto_update_status
from config import GOOGLE_SCRIPT_URL
from routes.auth import get_current_user
from database import get_db
import requests

appt_bp = Blueprint("appointment", __name__)

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
    conflict = db["appointments"].find_one({
        "date": data.get("date"),
        "time": data.get("time"),
        "status": {"$nin": ["cancelled"]}
    })
    if conflict:
        return jsonify({"error": "આ સ્લૉટ ભરાઈ ગઈ છે"}), 409
    appt = create_appointment(str(user["_id"]), data)
    db["appointments"].insert_one(appt)
    try:
        requests.post(GOOGLE_SCRIPT_URL, json={
            "action": "add_appointment",
            "id": appt["appointment_id"],
            "name": appt["name"],
            "phone": appt["phone"],
            "date": appt["date"],
            "time": appt["time"],
            "service": appt["service"],
            "mode": appt["mode"],
            "status": appt["status"],
            "note": appt["note"],
            "bookedAt": appt["booked_at"],
            "userId": appt["user_id"]
        }, timeout=5)
    except:
        pass
    return jsonify({"message": "એપોઇન્ટમેન્ટ બુક થઈ!", "appointment": serialize(appt)}), 201

@appt_bp.route("/my", methods=["GET"])
def my_appointments():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    db = get_db()
    appts = list(db["appointments"].find({"user_id": str(user["_id"])}, sort=[("date", -1)]))
    for a in appts:
        updated = auto_update_status(a)
        if updated["status"] != a.get("status"):
            db["appointments"].update_one(
                {"appointment_id": a["appointment_id"]},
                {"$set": {"status": updated["status"], "updated_at": updated["updated_at"]}}
            )
            try:
                requests.post(GOOGLE_SCRIPT_URL, json={
                    "action": "update_status",
                    "id": a["appointment_id"],
                    "status": updated["status"]
                }, timeout=5)
            except:
                pass
    appts = list(db["appointments"].find({"user_id": str(user["_id"])}, sort=[("date", -1)]))
    return jsonify({"appointments": [serialize(a) for a in appts]}), 200

@appt_bp.route("/status/<appt_id>", methods=["PUT"])
def update_status(appt_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    new_status = data.get("status")
    if new_status not in ["pending", "confirmed", "done", "cancelled"]:
        return jsonify({"error": "Invalid status"}), 400
    db = get_db()
    db["appointments"].update_one(
        {"appointment_id": appt_id, "user_id": str(user["_id"])},
        {"$set": {"status": new_status, "updated_at": datetime.utcnow().isoformat()}}
    )
    try:
        requests.post(GOOGLE_SCRIPT_URL, json={"action": "update_status", "id": appt_id, "status": new_status}, timeout=5)
    except:
        pass
    return jsonify({"message": "સ્ટેટસ અપડેટ થયો"}), 200

@appt_bp.route("/cancel/<appt_id>", methods=["PUT"])
def cancel(appt_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    db = get_db()
    db["appointments"].update_one(
        {"appointment_id": appt_id, "user_id": str(user["_id"])},
        {"$set": {"status": "cancelled", "updated_at": datetime.utcnow().isoformat()}}
    )
    try:
        requests.post(GOOGLE_SCRIPT_URL, json={"action": "update_status", "id": appt_id, "status": "cancelled"}, timeout=5)
    except:
        pass
    return jsonify({"message": "રદ કરી"}), 200

@appt_bp.route("/available-slots", methods=["GET"])
def available_slots():
    date = request.args.get("date")
    if not date:
        return jsonify({"error": "Date required"}), 400
    db = get_db()
    booked = db["appointments"].find({"date": date, "status": {"$nin": ["cancelled"]}}, {"time": 1})
    return jsonify({"booked_times": [b["time"] for b in booked]}), 200