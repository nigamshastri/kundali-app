import os
import requests as req
from datetime import datetime

ADMIN_EMAIL    = "nigamshastri304@gmail.com"
ADMIN_WHATSAPP = "917862934994"

def send_admin_email(appt):
    api_key  = os.getenv("BREVO_API_KEY", "")
    mail_user = os.getenv("MAIL_USERNAME", "nigamshastri4@gmail.com")
    if not api_key:
        print("BREVO_API_KEY not set")
        return

    body = f"""
    <div style="font-family:Arial;background:#1a0a00;color:#fff8f0;padding:24px;border-radius:12px;max-width:500px;margin:0 auto;border:1px solid rgba(212,160,23,0.4)">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:36px">🕉️</div>
        <h2 style="color:#d4a017;margin:8px 0">Nigmayu Jyotish</h2>
        <div style="color:rgba(255,248,240,0.5);font-size:12px">New Appointment Booked</div>
      </div>
      <div style="background:rgba(212,160,23,0.08);border:1px solid rgba(212,160,23,0.2);border-radius:10px;padding:16px">
        <h3 style="color:#ff6b1a;margin:0 0 12px">✅ Payment Received — Rs.500</h3>
        <table style="width:100%;font-size:13px">
          <tr><td style="padding:5px 0;color:rgba(255,248,240,0.5);width:40%">Name</td><td style="color:#fff8f0;font-weight:600">{appt.get('name','')}</td></tr>
          <tr><td style="padding:5px 0;color:rgba(255,248,240,0.5)">Phone</td><td style="color:#fff8f0">{appt.get('phone','')}</td></tr>
          <tr><td style="padding:5px 0;color:rgba(255,248,240,0.5)">Service</td><td style="color:#d4a017;font-weight:600">{appt.get('service','')}</td></tr>
          <tr><td style="padding:5px 0;color:rgba(255,248,240,0.5)">Date</td><td style="color:#fff8f0">{appt.get('date','')}</td></tr>
          <tr><td style="padding:5px 0;color:rgba(255,248,240,0.5)">Time</td><td style="color:#fff8f0">{appt.get('time','')}</td></tr>
          <tr><td style="padding:5px 0;color:rgba(255,248,240,0.5)">Mode</td><td style="color:#fff8f0">{appt.get('mode','')}</td></tr>
          <tr><td style="padding:5px 0;color:rgba(255,248,240,0.5)">Payment ID</td><td style="color:#66ff99;font-size:11px">{appt.get('payment_id','')}</td></tr>
        </table>
      </div>
      <div style="text-align:center;margin-top:16px;font-size:11px;color:rgba(255,248,240,0.25)">
        Booked at {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC
      </div>
    </div>
    """

    try:
        r = req.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={"api-key": api_key, "Content-Type": "application/json"},
            json={
                "sender": {"name": "Nigmayu Jyotish", "email": mail_user},
                "to": [{"email": ADMIN_EMAIL, "name": "Nigam Shastri"}],
                "subject": f"New Appointment: {appt.get('name','')} - {appt.get('service','')} on {appt.get('date','')}",
                "htmlContent": body
            },
            timeout=10
        )
        print(f"Admin email: {r.status_code}")
    except Exception as e:
        print(f"Admin email error: {e}")


def notify_admin(appt):
    send_admin_email(appt)
