import { useState } from "react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "",
    gender: user?.profile?.gender || "",
    city: user?.profile?.city || "",
    dob: user?.profile?.dob || ""
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      await authAPI.updateProfile(form);
      await refreshUser();
      setMsg("✅ પ્રોફાઇલ અપડેટ થઈ!");
    } catch (e) {
      setMsg("⚠️ " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <h2 style={styles.heading}>👤 મારી પ્રોફાઇલ</h2>
      <div style={styles.card}>
        <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
        <div style={styles.email}>{user?.email}</div>

        <div style={styles.grid}>
          <Field label="પૂરું નામ" value={form.name} onChange={set("name")} />
          <Field label="ફોન નંબર" value={form.phone} onChange={set("phone")} type="tel" />
          <div>
            <label style={styles.label}>લિંગ</label>
            <select style={styles.input} value={form.gender} onChange={set("gender")}>
              <option value="">પસંદ કરો</option>
              <option value="શ્રી">શ્રી (પુરુષ)</option>
              <option value="શ્રીમતી">શ્રીમતી (સ્ત્રી)</option>
              <option value="કુ.">કુ. (અ-વિવાહિત)</option>
            </select>
          </div>
          <Field label="શહેર" value={form.city} onChange={set("city")} placeholder="અમદાવાદ" />
          <Field label="જન્મ-તારીખ" value={form.dob} onChange={set("dob")} type="date" />
        </div>

        {msg && <div style={{ ...styles.msg, color: msg.startsWith("✅") ? "#7ce88a" : "#e88a7c" }}>{msg}</div>}

        <button style={styles.btn} onClick={save} disabled={saving}>
          {saving ? "⏳..." : "💾 સાચવો"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <input style={styles.input} value={value} onChange={onChange} placeholder={placeholder} type={type} />
    </div>
  );
}

const styles = {
  wrap: { maxWidth: "600px", margin: "0 auto", padding: "2rem 1rem" },
  heading: { color: "#d4a017", fontFamily: "'Yatra One', cursive", fontSize: "1.4rem", marginBottom: "1.5rem" },
  card: { background: "linear-gradient(135deg, rgba(45,21,5,0.9), rgba(26,10,0,0.95))", border: "1px solid rgba(212,160,23,0.3)", borderRadius: "16px", padding: "2rem", textAlign: "center" },
  avatar: { width: "70px", height: "70px", borderRadius: "50%", background: "linear-gradient(135deg, #8b1a1a, #ff6b1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 700, color: "white", margin: "0 auto 0.5rem", border: "2px solid rgba(212,160,23,0.4)" },
  email: { color: "rgba(255,248,240,0.4)", fontSize: "0.85rem", marginBottom: "1.5rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", textAlign: "left", marginBottom: "1rem" },
  label: { display: "block", color: "#d4a017", fontSize: "0.82rem", marginBottom: "0.35rem" },
  input: { width: "100%", background: "rgba(255,248,240,0.05)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: "8px", padding: "0.65rem 0.9rem", color: "#fff8f0", fontFamily: "'Noto Sans Gujarati', sans-serif", fontSize: "0.92rem", outline: "none", boxSizing: "border-box" },
  msg: { margin: "0.8rem 0", fontSize: "0.88rem" },
  btn: { padding: "0.7rem 2.5rem", background: "linear-gradient(135deg, #8b1a1a, #ff6b1a)", border: "none", borderRadius: "10px", color: "white", fontFamily: "'Yatra One', cursive", fontSize: "1rem", cursor: "pointer", marginTop: "0.5rem" }
};
