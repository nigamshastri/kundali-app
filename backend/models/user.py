from datetime import datetime
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_user(name, email, phone, password):
    return {
        "name": name,
        "email": email.lower().strip(),
        "phone": phone,
        "password": hash_password(password),
        "created_at": datetime.utcnow().isoformat(),
        "profile": {
            "gender": "",
            "city": "",
            "dob": ""
        }
    }

def public_user(user):
    """Return user dict without password"""
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "created_at": user.get("created_at", ""),
        "profile": user.get("profile", {})
    }
