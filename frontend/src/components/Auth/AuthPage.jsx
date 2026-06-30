import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

export default function AuthPage({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        onSuccess?.();
      } else {
        if (!form.name || !form.email || !form.phone || !form.password)
          throw new Error("બધાં ક્ષેત્રો ભરો");
        if (form.password !== form.confirm)
          throw new Error("પાસવર્ડ મેળ ખાતા નથી");
        if (!/^\d{10}$/.test(form.phone))
          throw new Error("10-અંકનો ફોન નંબર ભરો");

        await authAPI.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });

        setSuccess("✅ નોંધણી સફળ! હવે લૉગ ઇન કરો.");
        setMode("login");
        setForm((f) => ({ name: "", email: f.email, phone: "", password: "", confirm: "" }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🕉️</div>
          <h2 style={styles.title}>શાસ્ત્રી જ્યોતિષ</h2>
          <p style={styles.subtitle}>Kundali & Appointment System</p>
        </div>
        <div style={styles.tabs}>
          {["login", "register"].map((t) => (
            <button key={t} style={{ ...styles.tab, ...(mode === t ? styles.tabActive : {}) }}
              onClick={() => { setMode(t); setError(""); setSuccess(""); }}>
              {t === "login" ? "🔑 લૉગ ઇન" : "📝 નોંધણી"}
            </button>
          ))}
        </div>
        <div style={styles.form}>
          {mode === "register" && (
            <>
              <Field label="પૂરું નામ *" value={form.name} onChange={set("name")} placeholder="નામ લખો" />
              <Field label="ફોન નંબર *" value={form.phone} onChange={set("phone")} placeholder="10-અંક નો નંબર" type="tel" />
            </>
          )}
          <Field label="ઇ-મેઇલ *" value={form.email} onChange={set("email")} placeholder="email@example.com" type="email" />
          <Field label="પાસવર્ડ *" value={form.password} onChange={set("password")} placeholder="ઓછામાં ઓછો 6 અક્ષર" type="password" />
          {mode === "register" && (
            <Field label="પાસવર્ડ ફરી *" value={form.confirm} onChange={set("confirm")} placeholder="પાસવર્ડ ફરીથી લખો" type="password" />
          )}
          {success && <div style={styles.success}>{success}</div>}
          {error && <div style={styles.error}>⚠️ {error}</div>}
          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
            {loading ? "⏳ રાહ જુઓ..." : mode === "login" ? "🔑 લૉગ ઇન કરો" : "✅ નોંધણી કરો"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={styles.label}>{label}</label>
      <input style={styles.input} value={value} onChange={onChange} placeholder={placeholder} type={type} />
    </div>
  );
}

const styles = {
  overlay: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "linear-gradient(135deg, #1a0a00, #2d1505, #1a0a00)" },
  card: { width: "100%", maxWidth: "420px", background: "linear-gradient(135deg, rgba(45,21,5,0.95), rgba(26,10,0,0.98))", border: "1px solid rgba(212,160,23,0.35)", borderRadius: "20px", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,160,23,0.2)" },
  header: { textAlign: "center", marginBottom: "1.5rem" },
  logo: { fontSize: "3rem", marginBottom: "0.5rem" },
  title: { color: "#d4a017", fontFamily: "'Yatra One', cursive", fontSize: "1.5rem", margin: "0 0 0.25rem" },
  subtitle: { color: "rgba(255,248,240,0.5)", fontSize: "0.85rem", margin: 0 },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
  tab: { flex: 1, padding: "0.6rem", background: "rgba(45,21,5,0.6)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", color: "rgba(255,248,240,0.55)", cursor: "pointer", fontSize: "0.9rem", fontFamily: "'Noto Sans Gujarati', sans-serif", transition: "all 0.2s" },
  tabActive: { background: "linear-gradient(135deg, rgba(139,26,26,0.5), rgba(255,107,26,0.2))", borderColor: "#ff6b1a", color: "#d4a017", fontWeight: 600 },
  form: {},
  label: { display: "block", color: "#d4a017", fontSize: "0.82rem", marginBottom: "0.35rem" },
  input: { width: "100%", background: "rgba(255,248,240,0.05)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: "8px", padding: "0.65rem 0.9rem", color: "#fff8f0", fontFamily: "'Noto Sans Gujarati', sans-serif", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" },
  error: { background: "rgba(180,50,50,0.15)", border: "1px solid rgba(180,50,50,0.4)", borderRadius: "8px", padding: "0.6rem 0.9rem", color: "#e88a7c", fontSize: "0.85rem", marginBottom: "1rem" },
  success: { background: "rgba(50,160,80,0.15)", border: "1px solid rgba(50,160,80,0.4)", borderRadius: "8px", padding: "0.6rem 0.9rem", color: "#7ce88a", fontSize: "0.85rem", marginBottom: "1rem" },
  btn: { width: "100%", padding: "0.85rem", background: "linear-gradient(135deg, #8b1a1a, #ff6b1a, #d4a017)", border: "none", borderRadius: "10px", color: "white", fontFamily: "'Yatra One', cursive", fontSize: "1.1rem", cursor: "pointer", marginTop: "0.5rem", boxShadow: "0 4px 20px rgba(255,107,26,0.3)" }
};
