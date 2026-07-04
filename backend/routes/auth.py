from flask import Blueprint, request, jsonify
from bson import ObjectId
import jwt
import re
import random
import string
from datetime import datetime, timedelta
from models.user import create_user, check_password, public_user
from config import JWT_SECRET, JWT_EXPIRY_HOURS, GOOGLE_SCRIPT_URL
from database import get_db
from mailer import send_otp_email
import requests

auth_bp = Blueprint("auth", __name__)
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def make_token(user_id):
    payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS)}
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
    try:
        db = get_db()
        return db["users"].find_one({"_id": ObjectId(uid)})
    except:
        return None

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    phone = data.get("phone", "").strip()
    password = data.get("password", "")
    if not all([name, email, phone, password]):
        return jsonify({"error": "બધાં ક્ષેત્રો ભરો"}), 400
    if not EMAIL_RE.match(email):
        return jsonify({"error": "માન્ય ઇ-મેઇલ ભરો"}), 400
    if not phone.isdigit() or len(phone) != 10:
        return jsonify({"error": "માન્ય 10-અંકનો ફોન નંબર ભરો"}), 400
    if len(password) < 6:
        return jsonify({"error": "પાસવર્ડ ઓછામાં ઓછો 6 અક્ષર"}), 400
    db = get_db()
    if db["users"].find_one({"email": email}):
        return jsonify({"error": "આ ઇ-મેઇલ પહેલાંથી નોંધાયેલ છે"}), 409
    if db["users"].find_one({"phone": phone}):
        return jsonify({"error": "આ ફોન નંબર પહેલાંથી નોંધાયેલ છે"}), 409
    otp = generate_otp()
    otp_expiry = (datetime.utcnow() + timedelta(minutes=10)).isoformat()
    db["pending_users"].delete_many({"email": email})
    user_doc = create_user(name, email, phone, password)
    user_doc["otp"] = otp
    user_doc["otp_expiry"] = otp_expiry
    db["pending_users"].insert_one(user_doc)
    try:
        send_otp_email(email, name, otp)
    except Exception as e:
        db["pending_users"].delete_many({"email": email})
        return jsonify({"error": f"ઇ-મેઇલ મોકલવામાં ભૂલ: {str(e)}"}), 500
    return jsonify({"message": "OTP ઇ-મેઇલ પર મોકલ્યો!", "email": email}), 200

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    otp = data.get("otp", "").strip()
    if not email or not otp:
        return jsonify({"error": "ઇ-મેઇલ અને OTP જરૂરી છે"}), 400
    db = get_db()
    pending = db["pending_users"].find_one({"email": email})
    if not pending:
        return jsonify({"error": "કોઈ pending નોંધણી મળી નથી. ફરીથી નોંધણી કરો."}), 404
    try:
        expiry = datetime.fromisoformat(pending["otp_expiry"])
    except:
        return jsonify({"error": "OTP ખોટો છે."}), 400
    if datetime.utcnow() > expiry:
        db["pending_users"].delete_many({"email": email})
        return jsonify({"error": "OTP ની સમય-મર્યાદા પૂરી થઈ. ફરીથી નોંધણી કરો."}), 400
    if pending["otp"] != otp:
        return jsonify({"error": "OTP ખોટો છે. ફરીથી ચકાસો."}), 400
    user_doc = {
        "name": pending["name"], "email": pending["email"],
        "phone": pending["phone"], "password": pending["password"],
        "created_at": pending["created_at"],
        "profile": pending.get("profile", {"gender": "", "city": "", "dob": ""}),
        "email_verified": True
    }
    result = db["users"].insert_one(user_doc)
    user_id = str(result.inserted_id)
    db["pending_users"].delete_many({"email": email})
    try:
        requests.post(GOOGLE_SCRIPT_URL, json={"action": "add_user", "userId": user_id, "name": user_doc["name"], "email": email, "phone": user_doc["phone"], "registeredAt": user_doc["created_at"]}, timeout=5)
    except:
        pass
    user_doc["_id"] = result.inserted_id
    token = make_token(user_id)
    return jsonify({"message": "ઇ-મેઇલ ચકાસણી સફળ!", "token": token, "user": public_user(user_doc)}), 201

@auth_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    if not email:
        return jsonify({"error": "ઇ-મેઇલ જરૂરી છે"}), 400
    db = get_db()
    pending = db["pending_users"].find_one({"email": email})
    if not pending:
        return jsonify({"error": "કોઈ pending નોંધણી મળી નથી."}), 404
    otp = generate_otp()
    otp_expiry = (datetime.utcnow() + timedelta(minutes=10)).isoformat()
    db["pending_users"].update_one({"email": email}, {"$set": {"otp": otp, "otp_expiry": otp_expiry}})
    try:
        send_otp_email(email, pending["name"], otp)
    except Exception as e:
        return jsonify({"error": f"ઇ-મેઇલ મોકલવામાં ભૂલ: {str(e)}"}), 500
    return jsonify({"message": "નવો OTP મોકલ્યો!"}), 200

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "ઇ-મેઇલ અને પાસવર્ડ ભરો"}), 400
    db = get_db()
    user = db["users"].find_one({"email": email})
    if not user or not check_password(password, user["password"]):
        return jsonify({"error": "ઇ-મેઇલ અથવા પાસવર્ડ ખોટો છે"}), 401
    if not user.get("email_verified", False):
        return jsonify({"error": "ઇ-મેઇલ ચકાસણી બાકી છે.", "needs_verification": True, "email": email}), 403
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
    data = request.json or {}
    new_name = data.get("name", user["name"]).strip()
    new_phone = data.get("phone", user["phone"]).strip()
    if not new_name:
        return jsonify({"error": "નામ ખાલી ન હોઈ શકે"}), 400
    if not new_phone.isdigit() or len(new_phone) != 10:
        return jsonify({"error": "માન્ય 10-અંકનો ફોન નંબર ભરો"}), 400
    db = get_db()
    db["users"].update_one({"_id": user["_id"]}, {"$set": {"name": new_name, "phone": new_phone, "profile.gender": data.get("gender", ""), "profile.city": data.get("city", ""), "profile.dob": data.get("dob", "")}})
    updated = db["users"].find_one({"_id": user["_id"]})
    return jsonify({"user": public_user(updated)}), 200
