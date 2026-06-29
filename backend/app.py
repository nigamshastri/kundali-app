from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.kundali import kundali_bp
from routes.appointment import appt_bp

app = Flask(__name__)
CORS(app, origins=["https://kundali-shastri.netlify.app", "http://localhost:3000"])

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(kundali_bp, url_prefix="/api/kundali")
app.register_blueprint(appt_bp, url_prefix="/api/appointments")

@app.route("/api/health")
def health():
    return {"status": "ok", "message": "🕉️ Kundali API running"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)
