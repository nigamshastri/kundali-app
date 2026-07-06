from flask import Blueprint, request, jsonify
from routes.auth import get_current_user
from database import get_db
import razorpay
import os
import uuid
from datetime import datetime

payment_bp = Blueprint("payment", __name__)

RAZORPAY_KEY_ID     = os.getenv("RAZORPAY_KEY_ID", "rzp_test_TA5Gl5cWI9iIFG")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "XLN9pmTuZ8FRbk6gniHhbhg6")
APPOINTMENT_FEE     = 50000

def get_client():
    return razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@payment_bp.route("/create-order", methods=["POST"])
def create_order():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json or {}
    appt_data = data.get("appointment", {})
    if not appt_data:
        return jsonify({"error": "Appointment data required"}), 400
    db = get_db()
    conflict = db["appointments"].find_one({"date": appt_data.get("date"), "time": appt_data.get("time"), "status": {"$nin": ["cancelled"]}})
    if conflict:
        return jsonify({"error": "આ સ્લૉટ ભરાઈ ગઈ છે."}), 409
    client = get_client()
    receipt_id = "appt_" + str(uuid.uuid4())[:8]
    order = client.order.create({"amount": APPOINTMENT_FEE, "currency": "INR", "receipt": receipt_id, "notes": {"user_id": str(user["_id"]), "service": appt_data.get("service", ""), "date": appt_data.get("date", ""), "time": appt_data.get("time", "")}})
    db["pending_payments"].insert_one({"order_id": order["id"], "user_id": str(user["_id"]), "appointment_data": appt_data, "amount": APPOINTMENT_FEE, "status": "pending", "created_at": datetime.utcnow().isoformat()})
    return jsonify({"order_id": order["id"], "amount": APPOINTMENT_FEE, "currency": "INR", "key_id": RAZORPAY_KEY_ID}), 200

@payment_bp.route("/verify", methods=["POST"])
def verify_payment():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json or {}
    order_id   = data.get("razorpay_order_id")
    payment_id = data.get("razorpay_payment_id")
    signature  = data.get("razorpay_signature")
    if not all([order_id, payment_id, signature]):
        return jsonify({"error": "Payment details missing"}), 400
    client = get_client()
    try:
        client.utility.verify_payment_signature({"razorpay_order_id": order_id, "razorpay_payment_id": payment_id, "razorpay_signature": signature})
    except Exception:
        return jsonify({"error": "Payment verification failed"}), 400
    db = get_db()
    pending = db["pending_payments"].find_one({"order_id": order_id})
    if not pending:
        return jsonify({"error": "Order not found"}), 404
    appt_data = pending["appointment_data"]
    appt = {"appointment_id": "A" + str(uuid.uuid4())[:6].upper(), "user_id": str(user["_id"]), "name": appt_data.get("name", ""), "phone": appt_data.get("phone", ""), "gender": appt_data.get("gender", ""), "age": appt_data.get("age", ""), "date": appt_data.get("date", ""), "time": appt_data.get("time", ""), "service": appt_data.get("service", ""), "mode": appt_data.get("mode", ""), "note": appt_data.get("note", ""), "status": "confirmed", "payment_id": payment_id, "order_id": order_id, "amount_paid": APPOINTMENT_FEE, "booked_at": datetime.utcnow().isoformat(), "updated_at": datetime.utcnow().isoformat()}
    db["appointments"].insert_one(appt)
    db["pending_payments"].update_one({"order_id": order_id}, {"$set": {"status": "paid", "payment_id": payment_id}})
    try:
        import requests as req
        from config import GOOGLE_SCRIPT_URL
        req.post(GOOGLE_SCRIPT_URL, json={"action": "add_appointment", "id": appt["appointment_id"], "name": appt["name"], "phone": appt["phone"], "date": appt["date"], "time": appt["time"], "service": appt["service"], "mode": appt["mode"], "status": appt["status"], "note": appt["note"], "bookedAt": appt["booked_at"], "userId": appt["user_id"]}, timeout=5)
    except:
        pass
    appt["_id"] = str(appt.get("_id", ""))
    return jsonify({"message": "✅ ચૂકવણી સફળ! એપોઇન્ટમેન્ટ પક્કી!", "appointment": appt}), 201
