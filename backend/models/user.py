from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password: str) -> str:
    return generate_password_hash(password)

def check_password(password: str, hashed: str) -> bool:
    return check_password_hash(hashed, password)

def create_user(name, email, phone, password):
    return {
        "name": name,
        "email": email.lower().strip(),
        "phone": phone,
        "password": hash_password(password),
        "created_at": datetime.utcnow().isoformat(),
        "profile": {"gender": "", "city": "", "dob": ""}
    }

def public_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "created_at": user.get("created_at", ""),
        "profile": user.get("profile", {})
    }