import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_otp_email(to_email, name, otp):
    mail_user = os.getenv('MAIL_USERNAME', '')
    mail_pass = os.getenv('MAIL_PASSWORD', '')

    if not mail_user or not mail_pass:
        raise Exception("MAIL_USERNAME or MAIL_PASSWORD not set")

    subject = "Shastri Jyotish - Email Verification OTP"
    body = f"""
<html><body style="background:#1a0a00;color:#fff8f0;font-family:Arial,sans-serif;padding:20px">
<div style="max-width:480px;margin:0 auto;background:linear-gradient(135deg,#2d1505,#1a0a00);
     border:1px solid rgba(212,160,23,0.4);border-radius:16px;padding:32px">
  <div style="text-align:center;margin-bottom:24px">
    <div style="font-size:48px">🕉️</div>
    <div style="color:#d4a017;font-size:22px;font-weight:bold">Shastri Jyotish</div>
    <div style="color:rgba(255,248,240,0.5);font-size:13px">Kundali & Appointment System</div>
  </div>
  <p style="color:rgba(255,248,240,0.8)">Hello {name},</p>
  <p style="color:rgba(255,248,240,0.7)">Your email verification OTP:</p>
  <div style="background:linear-gradient(135deg,rgba(139,26,26,0.4),rgba(255,107,26,0.2));
       border:2px solid #ff6b1a;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
    <div style="font-size:12px;color:rgba(255,248,240,0.5);letter-spacing:2px">ONE TIME PASSWORD</div>
    <div style="font-size:42px;font-weight:bold;color:#d4a017;letter-spacing:12px">{otp}</div>
    <div style="font-size:12px;color:rgba(255,248,240,0.4);margin-top:8px">Valid for 10 minutes</div>
  </div>
  <div style="font-size:12px;color:rgba(255,248,240,0.4);margin-top:20px">
    🔒 Do not share this OTP with anyone.<br>
    If you did not request this, ignore this email.
  </div>
</div>
</body></html>
"""

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = mail_user
    msg['To'] = to_email
    msg.attach(MIMEText(body, 'html'))

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.ehlo()
        server.starttls()
        server.login(mail_user, mail_pass)
        server.sendmail(mail_user, to_email, msg.as_string())

def init_mail(app):
    pass  # No longer needed - using smtplib directly
