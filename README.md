# 🕉️ Kundali App — Full Stack

**Flask + React + MongoDB Atlas + Google Sheets**

---

## 📁 Project Structure

```
kundali-app/
├── backend/         ← Flask API
│   ├── app.py
│   ├── config.py
│   ├── .env
│   ├── requirements.txt
│   ├── models/
│   │   ├── user.py
│   │   ├── kundali.py
│   │   └── appointment.py
│   └── routes/
│       ├── auth.py
│       ├── kundali.py
│       └── appointment.py
└── frontend/        ← React (Vite)
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── context/AuthContext.jsx
        ├── services/api.js
        └── components/
            ├── Auth/AuthPage.jsx
            ├── Auth/Profile.jsx
            ├── Layout/Navbar.jsx
            ├── Kundali/MyKundalis.jsx
            ├── Appointment/BookAppointment.jsx
            └── Appointment/MyAppointments.jsx
```

---

## 🚀 Setup & Run

### Step 1 — Backend

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
Backend runs on: http://localhost:5000

---

### Step 2 — Copy Kundali HTML

Copy your `kundali2_o.html` (or updated version) into:
```
frontend/public/kundali.html
```
This lets React load it inside an iframe.

---

### Step 3 — Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 🔗 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | નવો account બનાવો |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Current user info |
| PUT  | /api/auth/profile | Profile update |

### Kundali
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/kundali/save | કુંડળી સાચવો |
| GET  | /api/kundali/my | My kundalis |
| GET  | /api/kundali/:id | Get one |
| DELETE | /api/kundali/:id | Delete |

### Appointments
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/appointments/book | Book appointment |
| GET  | /api/appointments/my | My appointments |
| PUT  | /api/appointments/status/:id | Update status manually |
| PUT  | /api/appointments/cancel/:id | Cancel |
| GET  | /api/appointments/available-slots?date=YYYY-MM-DD | Booked slots for date |

---

## ⚡ Status Logic

| Trigger | How |
|---------|-----|
| Auto: past date | When `/my` is fetched, pending/confirmed → done if date passed |
| Manual: client | Confirm ✅ / Done ✔ / Cancel ❌ buttons in UI |
| Manual: Google Sheet | Update status column directly in "Appointments" sheet |

---

## 🔐 Auth Flow

1. User registers → saved in MongoDB → JWT token issued (24h)
2. Token stored in `localStorage`
3. Every API call sends `Authorization: Bearer <token>`
4. Backend verifies token on protected routes

---

## 📊 Google Sheets Sync

Every time these happen → data is sent to your Google Sheet:
- New user registers → "Users" tab
- Kundali saved → "Kundali Records" tab  
- Appointment booked → "Appointments" tab
- Status updated → "Appointments" tab (status column updated)

