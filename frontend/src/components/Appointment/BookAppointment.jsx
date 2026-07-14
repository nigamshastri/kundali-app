import { useState, useEffect } from "react";
import { apptAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SERVICES = [
  { icon: "🔯", name: "કુંડળી વિચાર" }, { icon: "🪐", name: "ગ્રહ-શાંતિ" },
  { icon: "⏳", name: "મુહૂર્ત" },       { icon: "🏠", name: "વાસ્તુ" },
  { icon: "💍", name: "વિવાહ-મુહૂર્ત" }, { icon: "👶", name: "નામ-કરણ" },
  { icon: "🕉️", name: "અન્ય સેવા" }
];

const ALL_SLOTS = [
  { val: "09:00", label: "સવારે ૯:૦૦" }, { val: "09:30", label: "સવારે ૯:૩૦" },
  { val: "10:00", label: "સવારે ૧૦:૦૦" }, { val: "10:30", label: "સવારે ૧૦:૩૦" },
  { val: "11:00", label: "સવારે ૧૧:૦૦" }, { val: "11:30", label: "સવારે ૧૧:૩૦" },
  { val: "12:00", label: "બપોરે ૧૨:૦૦" }, { val: "14:00", label: "બપોરે ૨:૦૦" },
  { val: "14:30", label: "બપોરે ૨:૩૦" }, { val: "15:00", label: "સાંજ ૩:૦૦" },
  { val: "15:30", label: "સાંજ ૩:૩૦" }, { val: "16:00", label: "સાંજ ૪:૦૦" },
  { val: "17:00", label: "સાંજ ૫:૦૦" }, { val: "18:00", label: "સાંજ ૬:૦૦" },
  { val: "19:00", label: "સાંજ ૭:૦૦" }
];

const BASE = "https://kundali-app.onrender.com/api";
function getToken() { return localStorage.getItem("kundali_token"); }

async function createPaymentOrder(appointmentData) {
  const res = await fetch(`${BASE}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ appointment: appointmentData })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Order creation failed");
  return data;
}

async function verifyPayment(paymentData) {
  const res = await fetch(`${BASE}/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(paymentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Payment verification failed");
  return data;
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BookAppointment({ onBooked }) {
  const { user } = useAuth();
  const [service, setService] = useState("કુંડળી વિચાર");
  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "",
    gender: user?.profile?.gender || "", age: "",
    date: "", time: "", mode: "રૂ-બ-રૂ", note: ""
  });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => {
    let val = e.target.value;
    if (k === "phone") val = val.replace(/\D/g, "").slice(0, 10);
    if (k === "age")   val = val.replace(/\D/g, "").slice(0, 3);
    setForm((f) => ({ ...f, [k]: val }));
  };

  useEffect(() => {
    if (form.date) {
      setSlotsLoading(true);
      apptAPI.availableSlots(form.date)
        .then((d) => setBookedSlots(d.booked_times || []))
        .catch(() => setBookedSlots([]))
        .finally(() => setSlotsLoading(false));
      setForm((f) => ({ ...f, time: "" }));
    }
  }, [form.date]);

  const validate = () => {
    if (!form.name.trim()) return "નામ ભરો";
    if (!form.phone || form.phone.length !== 10) return "10-અંકનો ફોન નંબર ભરો";
    if (!form.date) return "તારીખ પસંદ કરો";
    if (!form.time) return "સ્લૉટ પસંદ કરો";
    if (form.date < new Date().toISOString().slice(0, 10)) return "ભૂતકાળની તારીખ પસંદ ન કરી શકાય";
    return "";
  };

  const handlePayment = async () => {
    setError("");
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay SDK load failed. Check internet connection.");

      const orderData = await createPaymentOrder({ ...form, service });

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nigmayu Jyotish",
        description: `${service} — ${form.date} ${form.time}`,
        order_id: orderData.order_id,
        prefill: { name: form.name, contact: form.phone, email: user?.email || "" },
        theme: { color: "#d4a017" },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature
            });
            setSuccess(true);
            setForm({ name: user?.name || "", phone: user?.phone || "", gender: "", age: "", date: "", time: "", mode: "રૂ-બ-રૂ", note: "" });
            setService("કુંડળી વિચાર");
            setBookedSlots([]);
            setTimeout(() => { setSuccess(false); onBooked?.(); }, 3000);
          } catch (e) {
            setError("⚠️ Payment verification failed: " + e.message);
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => { setError("ચૂકવણી રદ કરી."); setLoading(false); } }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) => { setError("⚠️ ચૂકવણી નિષ્ફળ: " + r.error.description); setLoading(false); });
      rzp.open();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={S.wrap}>
      <h2 style={S.heading}>📅 એપોઇન્ટમેન્ટ બુક કરો</h2>

      {success && <div style={S.successBanner}>✅ ચૂકવણી સફળ! એપોઇન્ટમેન્ટ પક્કી! WhatsApp / ફોન દ્વારા પુષ્ટિ આવશે.</div>}

      <div style={S.card}>
        <div style={S.sectionLabel}>🙏 સેવા પસંદ કરો</div>
        <div style={S.serviceGrid}>
          {SERVICES.map((s) => (
            <div key={s.name} style={{ ...S.serviceCard, ...(service === s.name ? S.serviceActive : {}) }} onClick={() => setService(s.name)}>
              <div style={{ fontSize: "1.5rem" }}>{s.icon}</div>
              <div style={S.serviceName}>{s.name}</div>
            </div>
          ))}
        </div>

        <div style={S.sectionLabel}>👤 વ્યક્તિગત માહિતી</div>
        <div style={S.grid2}>
          <Field label="નામ *" value={form.name} onChange={set("name")} placeholder="પૂરું નામ" />
          <Field label="ફોન *" value={form.phone} onChange={set("phone")} placeholder="10 અંક" type="tel" />
          <div>
            <label style={S.label}>શ્રી / શ્રીમતી</label>
            <select style={S.input} value={form.gender} onChange={set("gender")}>
              <option value="">પસંદ કરો</option>
              <option value="શ્રી">શ્રી (પુરુષ)</option>
              <option value="શ્રીમતી">શ્રીમતી (સ્ત્રી)</option>
              <option value="કુ.">કુ. (અ-વિવાહિત)</option>
            </select>
          </div>
          <Field label="ઉંમર" value={form.age} onChange={set("age")} placeholder="ઉંમર" type="number" />
        </div>

        <div style={S.sectionLabel}>📅 તારીખ અને સ્લૉટ</div>
        <div style={S.grid2}>
          <Field label="તારીખ *" value={form.date} onChange={set("date")} type="date" min={today} />
          <div>
            <label style={S.label}>માધ્યમ</label>
            <select style={S.input} value={form.mode} onChange={set("mode")}>
              <option value="રૂ-બ-રૂ">🏠 રૂ-બ-રૂ</option>
              <option value="ફોન">📞 ફોન</option>
              <option value="WhatsApp">💬 WhatsApp</option>
              <option value="Video Call">📹 Video Call</option>
            </select>
          </div>
        </div>

        {form.date && (
          <>
            <div style={S.sectionLabel}>🕐 સ્લૉટ પસંદ કરો</div>
            {slotsLoading ? (
              <div style={{ color: "rgba(255,248,240,0.4)", fontSize: "0.85rem" }}>⏳ સ્લૉટ ચેક...</div>
            ) : (
              <div style={S.slotGrid}>
                {ALL_SLOTS.map((s) => {
                  const taken = bookedSlots.includes(s.val);
                  const selected = form.time === s.val;
                  return (
                    <div key={s.val} style={{ ...S.slot, ...(taken ? S.slotTaken : {}), ...(selected ? S.slotSelected : {}) }}
                      onClick={() => !taken && setForm((f) => ({ ...f, time: s.val }))}>
                      {s.label}
                      {taken && <div style={{ fontSize: "0.62rem", color: "rgba(255,120,120,0.7)" }}>ભરાઈ ગઈ</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div style={S.sectionLabel}>📝 નોંધ</div>
        <textarea style={{ ...S.input, minHeight: "80px", resize: "vertical", width: "100%", boxSizing: "border-box" }}
          value={form.note} onChange={set("note")} maxLength={500}
          placeholder="કોઈ ખાસ પ્રશ્ન..." />

        <div style={S.feeBanner}>
          <span>💳 પરામર્શ શુલ્ક</span>
          <span style={{ color: "#d4a017", fontWeight: 700, fontSize: "1.2rem" }}>₹500</span>
        </div>

        {error && <div style={S.error}>⚠️ {error}</div>}

        <button style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }} onClick={handlePayment} disabled={loading}>
          {loading ? "⏳ રાહ જુઓ..." : "💳 ₹500 ચૂકવો & બુક કરો"}
        </button>

        <div style={S.note}>
          🔒 Razorpay દ્વારા સુરક્ષિત · UPI · Card · Net Banking · Wallet<br />
          ✅ ચૂકવણી પછી એપોઇન્ટમેન્ટ આપોઆપ પક્કી થશે.
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", min }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      <input style={S.input} value={value} onChange={onChange} placeholder={placeholder} type={type} min={min} />
    </div>
  );
}

const C = { gold: "#d4a017", saffron: "#ff6b1a", cream: "#fff8f0" };
const S = {
  wrap: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" },
  heading: { color: C.gold, fontFamily: "'Yatra One', cursive", fontSize: "1.4rem", marginBottom: "1.5rem" },
  card: { background: "linear-gradient(135deg, rgba(45,21,5,0.9), rgba(26,10,0,0.95))", border: "1px solid rgba(212,160,23,0.3)", borderRadius: "16px", padding: "1.8rem" },
  sectionLabel: { fontSize: "0.8rem", color: C.gold, letterSpacing: "0.07em", margin: "1.2rem 0 0.7rem", display: "flex", alignItems: "center", gap: "0.5rem" },
  serviceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "0.6rem" },
  serviceCard: { border: "1px solid rgba(212,160,23,0.2)", borderRadius: "10px", padding: "0.7rem 0.5rem", cursor: "pointer", textAlign: "center", background: "rgba(45,21,5,0.5)", transition: "all 0.2s" },
  serviceActive: { border: "1px solid #ff6b1a", background: "linear-gradient(135deg, rgba(139,26,26,0.4), rgba(255,107,26,0.15))" },
  serviceName: { fontSize: "0.72rem", color: "rgba(255,248,240,0.75)", marginTop: "0.3rem" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "0.5rem" },
  label: { display: "block", color: C.gold, fontSize: "0.82rem", marginBottom: "0.35rem" },
  input: { width: "100%", background: "rgba(255,248,240,0.05)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: "8px", padding: "0.65rem 0.9rem", color: C.cream, fontFamily: "'Noto Sans Gujarati', sans-serif", fontSize: "0.92rem", outline: "none", boxSizing: "border-box" },
  slotGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))", gap: "0.5rem" },
  slot: { padding: "0.5rem 0.3rem", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "7px", textAlign: "center", fontSize: "0.76rem", cursor: "pointer", color: "rgba(255,248,240,0.65)", background: "rgba(45,21,5,0.5)", transition: "all 0.2s" },
  slotSelected: { border: "1px solid #ff6b1a", background: "rgba(255,107,26,0.15)", color: C.gold, fontWeight: 600 },
  slotTaken: { opacity: 0.35, cursor: "not-allowed", textDecoration: "line-through" },
  feeBanner: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.25)", borderRadius: "10px", padding: "0.9rem 1.2rem", marginTop: "1.2rem", color: "rgba(255,248,240,0.7)", fontSize: "0.95rem" },
  error: { background: "rgba(180,50,50,0.15)", border: "1px solid rgba(180,50,50,0.35)", borderRadius: "8px", padding: "0.6rem", color: "#e88a7c", fontSize: "0.85rem", margin: "1rem 0" },
  successBanner: { background: "rgba(50,160,80,0.15)", border: "1px solid rgba(50,160,80,0.35)", borderRadius: "10px", padding: "1rem", color: "#7ce88a", marginBottom: "1rem", textAlign: "center" },
  submitBtn: { width: "100%", padding: "0.9rem", background: "linear-gradient(135deg, #1a6b1a, #2ecc71)", border: "none", borderRadius: "10px", color: "white", fontFamily: "'Yatra One', cursive", fontSize: "1.1rem", cursor: "pointer", marginTop: "1rem", boxShadow: "0 4px 20px rgba(46,204,113,0.3)" },
  note: { marginTop: "1rem", padding: "0.75rem", background: "rgba(212,160,23,0.05)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "8px", fontSize: "0.75rem", color: "rgba(255,248,240,0.4)", lineHeight: 1.7 }
};
