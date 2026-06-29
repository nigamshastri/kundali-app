from datetime import datetime
import uuid

def create_appointment(user_id, data):
    return {
        "appointment_id": "A" + str(uuid.uuid4())[:6].upper(),
        "user_id": user_id,
        "name": data.get("name", ""),
        "phone": data.get("phone", ""),
        "gender": data.get("gender", ""),
        "age": data.get("age", ""),
        "date": data.get("date", ""),
        "time": data.get("time", ""),
        "service": data.get("service", ""),
        "mode": data.get("mode", ""),
        "note": data.get("note", ""),
        "status": "pending",
        "booked_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

def auto_update_status(appointment):
    """Auto-mark as done if date has passed"""
    if appointment["status"] in ("pending", "confirmed"):
        appt_date = datetime.strptime(appointment["date"], "%Y-%m-%d").date()
        if appt_date < datetime.utcnow().date():
            appointment["status"] = "done"
            appointment["updated_at"] = datetime.utcnow().isoformat()
    return appointment
