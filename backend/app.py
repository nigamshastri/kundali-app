from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import auth_bp
from routes.kundali import kundali_bp
from routes.appointment import appt_bp
from routes.payment import payment_bp
import traceback

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

app.register_blueprint(auth_bp,    url_prefix="/api/auth")
app.register_blueprint(kundali_bp, url_prefix="/api/kundali")
app.register_blueprint(appt_bp,    url_prefix="/api/appointments")
app.register_blueprint(payment_bp, url_prefix="/api/payment")

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.errorhandler(Exception)
def handle_exception(e):
    traceback.print_exc()
    return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
