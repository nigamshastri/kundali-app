from flask_mail import Mail, Message
import os

mail = Mail()

def init_mail(app):
    app.config['MAIL_SERVER']   = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT']     = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS']  = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', '')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', '')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME', '')
    mail.init_app(app)

def send_otp_email(to_email, name, otp):
    subject = "Shastri Jyotish - Email Verification OTP"
    body = f"""
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
body{{font-family:Arial,sans-serif;background:#1a0a00;color:#fff8f0;margin:0;padding:20px}}
.c{{max-width:480px;margin:0 auto;background:linear-gradient(135deg,#2d1505,#1a0a00);border:1px solid rgba(212,160,23,0.4);border-radius:16px;padding:32px}}
.h{{text-align:center;margin-bottom:24px}}
.t{{color:#d4a017;font-size:22px;font-weight:bold;margin:8px 0 4px}}
.s{{color:rgba(255,248,240,0.5);font-size:13px}}
.ob{{background:linear-gradient(135deg,rgba(139,26,26,0.4),rgba(255,107,26,0.2));border:2px solid #ff6b1a;border-radius:12px;padding:20px;text-align:center;margin:20px 0}}
.ol{{font-size:12px;color:rgba(255,248,240,0.5);letter-spacing:2px;margin-bottom:8px}}
.o{{font-size:42px;font-weight:bold;color:#d4a017;letter-spacing:12px}}
.e{{font-size:12px;color:rgba(255,248,240,0.4);margin-top:8px}}
.n{{font-size:12px;color:rgba(255,248,240,0.4);margin-top:20px;line-height:1.6}}
.f{{text-align:center;margin-top:24px;font-size:11px;color:rgba(255,248,240,0.3)}}
</style></head>
<body><div class="c">
<div class="h"><div style="font-size:48px">🕉️</div>
<div class="t">Shastri Jyotish</div>
<div class="s">Kundali & Appointment System</div></div>
<p style="color:rgba(255,248,240,0.7);font-size:14px">Hello {name},<br>Your email verification OTP:</p>
<div class="ob">
<div class="ol">ONE TIME PASSWORD</div>
<div class="o">{otp}</div>
<div class="e">Valid for 10 minutes</div>
</div>
<div class="n">🔒 Do not share this OTP with anyone.<br>If you did not request this, ignore this email.</div>
<div class="f">🙏 Shastri Jyotish</div>
</div></body></html>
"""
    msg = Message(subject=subject, recipients=[to_email], html=body)
    mail.send(msg)
