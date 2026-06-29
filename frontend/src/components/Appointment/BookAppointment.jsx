import { useState, useEffect } from "react";
import { apptAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SERVICES = [
  { icon: "🔯", name: "કુંડળી વિચાર" }, { icon: "🪐", name: "ગ્રહ-શાંતિ" },
  { icon: "⏳", name: "મુહૂર્ત" }, { icon: "🏠", name: "વાસ્તુ" },
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

export default function BookAppointment({ onBooked }) {
  const { user } = useAuth();
  const [service, setService] = useState("કુંડળી વિચાર");
  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "",
    gender: user?.profile?.gender || "", age: "",
    date: "", time: "", mode: "રૂ-બ-રૂ", note: ""
  });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (form.date) {
      apptAPI.availableSlots(form.date)
        .then((d) => setBookedSlots(d.booked_times))
        .catch(() => setBookedSlots([]));
    }
  }, [form.date]);

  const submit = async () => {
    setError("");
    if (!form.name || !form.phone || !form.date || !form.time) {
      setError("નામ, ફોન, તારીખ અને સમય ભરવા જરૂરી છે"); return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("10-અંકનો ફોન નંબર ભરો"); return;
    }
    setLoading(true);
    try {
      await apptAPI.book({ ...form, service });
      setSuccess(true);
      setForm({ name: user?.name || "", phone: user?.phone || "", gender: "", age: "", date: "", time: "", mode: "રૂ-બ-રૂ", note: "" });
      setService("કુંડળી વિચાર");
      setTimeout(() => { setSuccess(false); onBooked?.(); }, 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={styles.wrap}>
      <h2 style={styles.heading}>📅 નવી એપોઇન્ટમેન્ટ બુક કરો</h2>

      {success && (
        <div style={styles.successBanner}>✅ એપોઇન્ટમેન્ટ સફળ રીતે બુક થઈ! WhatsApp / ફોન દ્વારા પુષ્ટિ આપવામાં આવશે.</div>
      )}

      <div style={styles.card}>
        {/* Service selector */}
        <div style={styles.sectionLabel}>🙏 સેવા પસંદ કરો</div>
        <div style={styles.serviceGrid}>
          {SERVICES.map((s) => (
            <div key={s.name} style={{ ...styles.serviceCard, ...(service === s.name ? styles.serviceActive : {}) }}
              onClick={() => setService(s.name)}>
              <div style={{ fontSize: "1.5rem" }}>{s.icon}</div>
              <div style={styles.serviceName}>{s.name}</div>
            </div>
          ))}
        </div>

        {/* Personal info */}
        <div style={styles.sectionLabel}>👤 વ્યક્તિગત માહિતી</div>
        <div style={styles.grid2}>
          <Field label="નામ *" value={form.name} onChange={set("name")} placeholder="પૂરું નામ" />
          <Field label="ફોન *" value={form.phone} onChange={set("phone")} placeholder="10 અંક" type="tel" />
          <div>
            <label style={styles.label}>શ્રી / શ્રીમતી</label>
            <select style={styles.input} value={form.gender} onChange={set("gender")}>
              <option value="">પસંદ કરો</option>
              <option value="શ્રી">શ્રી (પુરુષ)</option>
              <option value="શ્રીમતી">શ્રીમતી (સ્ત્રી)</option>
              <option value="કુ.">કુ. (અ-વિવાહિત)</option>
            </select>
          </div>
          <Field label="ઉંમર" value={form.age} onChange={set("age")} placeholder="ઉંમર" type="number" />
        </div>

        {/* Date & Time */}
        <div style={styles.sectionLabel}>📅 તારીખ અને સ્લૉટ</div>
        <div style={styles.grid2}>
          <Field label="તારીખ *" value={form.date} onChange={set("date")} type="date" min={today} />
          <div>
            <label style={styles.label}>માધ્યમ</label>
            <select style={styles.input} value={form.mode} onChange={set("mode")}>
              <option value="રૂ-બ-રૂ">🏠 રૂ-બ-રૂ</option>
              <option value="ફોન">📞 ફોન</option>
              <option value="WhatsApp">💬 WhatsApp</option>
              <option value="Video Call">📹 Video Call</option>
            </select>
          </div>
        </div>

        {/* Time slots */}
        {form.date && (
          <>
            <div style={styles.sectionLabel}>🕐 સ્લૉટ પસંદ કરો</div>
            <div style={styles.slotGrid}>
              {ALL_SLOTS.map((s) => {
                const taken = bookedSlots.includes(s.val);
                const selected = form.time === s.val;
                return (
                  <div key={s.val}
                    style={{ ...styles.slot, ...(taken ? styles.slotTaken : {}), ...(selected ? styles.slotSelected : {}) }}
                    onClick={() => !taken && setForm((f) => ({ ...f, time: s.val }))}>
                    {s.label}
                    {taken && <div style={{ fontSize: "0.65rem", color: "rgba(255,120,120,0.7)" }}>ભરાઈ ગઈ</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Note */}
        <div style={styles.sectionLabel}>📝 નોંધ</div>
        <textarea style={{ ...styles.input, minHeight: "80px", resize: "vertical", width: "100%", boxSizing: "border-box" }}
          value={form.note} onChange={set("note")}
          placeholder="કોઈ ખાસ પ્રશ્ન અથવા માહિતી..." />

        {error && <div style={styles.error}>⚠️ {error}</div>}

        <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
          {loading ? "⏳ રાહ જુઓ..." : "🕉️ એપોઇન્ટમેન્ટ બુક કરો"}
        </button>

        <div style={styles.note}>
          📌 બુકિંગ પછી WhatsApp / ફોન દ્વારા પુષ્ટિ આપવામાં આવશે.<br />
          ⏰ રવિવાર / તહેવારો ઉપર ઉપલબ્ધ ન હોઈ શકે.
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", min }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <input style={styles.input} value={value} onChange={onChange}
        placeholder={placeholder} type={type} min={min} />
    </div>
  );
}

const C = { gold: "#d4a017", saffron: "#ff6b1a", cream: "#fff8f0" };
const styles = {
  wrap: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" },
  heading: { color: C.gold, fontFamily: "'Yatra One', cursive", fontSize: "1.4rem", marginBottom: "1.5rem" },
  card: {
    background: "linear-gradient(135deg, rgba(45,21,5,0.9), rgba(26,10,0,0.95))",
    border: "1px solid rgba(212,160,23,0.3)", borderRadius: "16px", padding: "1.8rem"
  },
  sectionLabel: {
    fontSize: "0.8rem", color: C.gold, letterSpacing: "0.07em",
    margin: "1.2rem 0 0.7rem", display: "flex", alignItems: "center", gap: "0.5rem"
  },
  serviceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.6rem", marginBottom: "0.5rem" },
  serviceCard: {
    border: "1px solid rgba(212,160,23,0.2)", borderRadius: "10px",
    padding: "0.7rem 0.5rem", cursor: "pointer", textAlign: "center",
    background: "rgba(45,21,5,0.5)", transition: "all 0.2s"
  },
  serviceActive: {
    border: "1px solid #ff6b1a",
    background: "linear-gradient(135deg, rgba(139,26,26,0.4), rgba(255,107,26,0.15))"
  },
  serviceName: { fontSize: "0.75rem", color: "rgba(255,248,240,0.75)", marginTop: "0.3rem" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "0.5rem" },
  label: { display: "block", color: C.gold, fontSize: "0.82rem", marginBottom: "0.35rem" },
  input: {
    width: "100%", background: "rgba(255,248,240,0.05)",
    border: "1px solid rgba(212,160,23,0.3)", borderRadius: "8px",
    padding: "0.65rem 0.9rem", color: C.cream,
    fontFamily: "'Noto Sans Gujarati', sans-serif", fontSize: "0.92rem",
    outline: "none", boxSizing: "border-box"
  },
  slotGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "0.5rem" },
  slot: {
    padding: "0.5rem 0.3rem", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "7px",
    textAlign: "center", fontSize: "0.78rem", cursor: "pointer",
    color: "rgba(255,248,240,0.65)", background: "rgba(45,21,5,0.5)", transition: "all 0.2s"
  },
  slotSelected: { border: "1px solid #ff6b1a", background: "rgba(255,107,26,0.15)", color: C.gold, fontWeight: 600 },
  slotTaken: { opacity: 0.35, cursor: "not-allowed", textDecoration: "line-through" },
  error: { background: "rgba(180,50,50,0.15)", border: "1px solid rgba(180,50,50,0.35)", borderRadius: "8px", padding: "0.6rem", color: "#e88a7c", fontSize: "0.85rem", margin: "1rem 0" },
  successBanner: { background: "rgba(50,160,80,0.15)", border: "1px solid rgba(50,160,80,0.35)", borderRadius: "10px", padding: "1rem", color: "#7ce88a", marginBottom: "1rem", textAlign: "center" },
  submitBtn: {
    width: "100%", padding: "0.9rem",
    background: "linear-gradient(135deg, #8b1a1a, #ff6b1a, #d4a017)",
    border: "none", borderRadius: "10px", color: "white",
    fontFamily: "'Yatra One', cursive", fontSize: "1.1rem", cursor: "pointer",
    marginTop: "1.2rem", boxShadow: "0 4px 20px rgba(255,107,26,0.25)"
  },
  note: { marginTop: "1rem", padding: "0.75rem", background: "rgba(212,160,23,0.05)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "8px", fontSize: "0.78rem", color: "rgba(255,248,240,0.45)", lineHeight: 1.7 }
};
