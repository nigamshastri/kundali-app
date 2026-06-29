from datetime import datetime
import uuid

def create_kundali(user_id, data):
    return {
        "kundali_id": str(uuid.uuid4())[:8].upper(),
        "user_id": user_id,
        "name": data.get("name", ""),
        "dob": data.get("dob", ""),
        "tob": data.get("tob", ""),
        "pob": data.get("pob", ""),
        "lat": data.get("lat", ""),
        "lon": data.get("lon", ""),
        "lagna": data.get("lagna", ""),
        "rashi": data.get("rashi", ""),
        "nakshatra": data.get("nakshatra", ""),
        "chart_data": data.get("chart_data", {}),
        "dasha_data": data.get("dasha_data", {}),
        "saved_at": datetime.utcnow().isoformat(),
        "label": data.get("label", "")   # optional custom label
    }
