import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

export default function AuthPage() {
  const [mode, setMode]       = useState("login");
  const [form, setForm]       = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [otp, setOtp]         = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { login } = useAuth();

  const set = (k) => (e) => {
    let val = e.target.value;
    if (k === "phone") val = val.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, [k]: val }));
  };

  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); setOtp(""); };

  const submitRegister = async () => {
    setError(""); setSuccess("");
    if (!form.name || !form.email || !form.phone || !form.password) return setError("બધાં ક્ષેત્રો ભરો");
    if (form.password !== form.confirm) return setError("પાસવર્ડ મેળ ખાતા નથી");
    if (form.phone.length !== 10) return setError("10-અંકનો ફોન નંબર ભરો");
    if (form.password.length < 6) return setError("પાસવર્ડ ઓછામાં ઓછો 6 અક્ષર");
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      setPendingEmail(form.email);
      setMode("verify-otp");
      setSuccess(`✅ OTP ${form.email} પર મોકલ્યો!`);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const submitOtp = async () => {
    setError(""); setSuccess("");
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) return setError("6-અંકનો OTP ભરો");
    setLoading(true);
    try {
      const data = await authAPI.verifyOtp(pendingEmail, otp);
      localStorage.setItem("kundali_token", data.token);
      window.location.reload();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const resendOtp = async () => {
    setError(""); setResending(true);
    try {
      await authAPI.resendOtp(pendingEmail);
      setSuccess("✅ નવો OTP મોકલ્યો!");
    } catch (e) { setError(e.message); }
    finally { setResending(false); }
  };

  const submitLogin = async () => {
    setError(""); setSuccess("");
    if (!form.email || !form.password) return setError("ઇ-મેઇલ અને પાસવર્ડ ભરો");
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (e) {
      if (e.message?.includes("ચકાસણી")) {
        setPendingEmail(form.email);
        setMode("verify-otp");
        setSuccess("OTP ઇ-મેઇલ પર ફરી મોકલ્યો. ચકાસો.");
      } else { setError(e.message); }
    }
    finally { setLoading(false); }
  };

  return (
    <div style={S.overlay}>
      <div style={S.card}>
        <div style={S.header}>
          <div style={S.logo}>🕉️</div>
          <h2 style={S.title}>શાસ્ત્રી જ્યોતિષ</h2>
          <p style={S.subtitle}>Kundali & Appointment System</p>
        </div>

        {mode !== "verify-otp" && (
          <div style={S.tabs}>
            {["login","register"].map((t) => (
              <button key={t} style={{...S.tab,...(mode===t?S.tabActive:{})}} onClick={() => switchMode(t)}>
                {t === "login" ? "🔑 લૉગ ઇન" : "📝 નોંધણી"}
              </button>
            ))}
          </div>
        )}

        {mode === "verify-otp" && (
          <div>
            <div style={S.otpHeader}>
              <div style={{fontSize:"2.5rem"}}>📧</div>
              <div style={S.otpTitle}>ઇ-મેઇલ ચકાસણી</div>
              <div style={S.otpSub}><b style={{color:"#ff6b1a"}}>{pendingEmail}</b><br/>પર 6-અંકનો OTP મોકલ્યો છે</div>
            </div>
            <div style={S.otpBoxWrap}>
              <input style={S.otpInput} type="text" inputMode="numeric" maxLength={6}
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                placeholder="• • • • • •" autoFocus />
            </div>
            {success && <div style={S.success}>{success}</div>}
            {error   && <div style={S.error}>⚠️ {error}</div>}
            <button style={{...S.btn,opacity:loading?0.7:1}} onClick={submitOtp} disabled={loading}>
              {loading ? "⏳ ચકાસી રહ્યા..." : "✅ OTP ચકાસો"}
            </button>
            <div style={S.otpFooter}>
              OTP ન આવ્યો?{" "}
              <button style={S.linkBtn} onClick={resendOtp} disabled={resending}>{resending?"⏳...":"ફરી મોકલો"}</button>
              {" · "}
              <button style={S.linkBtn} onClick={() => switchMode("register")}>નોંધણી બદલો</button>
            </div>
          </div>
        )}

        {mode === "register" && (
          <div>
            <Field label="પૂરું નામ *"   value={form.name}     onChange={set("name")}     placeholder="નામ લખો" />
            <Field label="ફોન નંબર *"    value={form.phone}    onChange={set("phone")}    placeholder="10-અંક" type="tel" />
            <Field label="ઇ-મેઇલ *"      value={form.email}    onChange={set("email")}    placeholder="email@example.com" type="email" />
            <Field label="પાસવર્ડ *"     value={form.password} onChange={set("password")} placeholder="ઓછામાં ઓછો 6 અક્ષર" type="password" />
            <Field label="પાસવર્ડ ફરી *" value={form.confirm}  onChange={set("confirm")}  placeholder="પાસવર્ડ ફરીથી" type="password" />
            {success && <div style={S.success}>{success}</div>}
            {error   && <div style={S.error}>⚠️ {error}</div>}
            <button style={{...S.btn,opacity:loading?0.7:1}} onClick={submitRegister} disabled={loading}>
              {loading ? "⏳ OTP મોકલી રહ્યા..." : "📧 OTP મેળવો"}
            </button>
          </div>
        )}

        {mode === "login" && (
          <div>
            <Field label="ઇ-મેઇલ *"  value={form.email}    onChange={set("email")}    placeholder="email@example.com" type="email" />
            <Field label="પાસવર્ડ *" value={form.password} onChange={set("password")} placeholder="પાસવર્ડ" type="password" />
            {success && <div style={S.success}>{success}</div>}
            {error   && <div style={S.error}>⚠️ {error}</div>}
            <button style={{...S.btn,opacity:loading?0.7:1}} onClick={submitLogin} disabled={loading}>
              {loading ? "⏳ રાહ જુઓ..." : "🔑 લૉગ ઇન કરો"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{marginBottom:"1rem"}}>
      <label style={S.label}>{label}</label>
      <input style={S.input} value={value} onChange={onChange} placeholder={placeholder} type={type} />
    </div>
  );
}

const S = {
  overlay:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",background:"linear-gradient(135deg,#1a0a00,#2d1505,#1a0a00)"},
  card:{width:"100%",maxWidth:"420px",background:"linear-gradient(135deg,rgba(45,21,5,0.95),rgba(26,10,0,0.98))",border:"1px solid rgba(212,160,23,0.35)",borderRadius:"20px",padding:"2rem",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"},
  header:{textAlign:"center",marginBottom:"1.5rem"},
  logo:{fontSize:"3rem",marginBottom:"0.5rem"},
  title:{color:"#d4a017",fontFamily:"'Yatra One',cursive",fontSize:"1.5rem",margin:"0 0 0.25rem"},
  subtitle:{color:"rgba(255,248,240,0.5)",fontSize:"0.85rem",margin:0},
  tabs:{display:"flex",gap:"0.5rem",marginBottom:"1.5rem"},
  tab:{flex:1,padding:"0.6rem",background:"rgba(45,21,5,0.6)",border:"1px solid rgba(212,160,23,0.2)",borderRadius:"8px",color:"rgba(255,248,240,0.55)",cursor:"pointer",fontSize:"0.9rem",fontFamily:"'Noto Sans Gujarati',sans-serif",transition:"all 0.2s"},
  tabActive:{background:"linear-gradient(135deg,rgba(139,26,26,0.5),rgba(255,107,26,0.2))",borderColor:"#ff6b1a",color:"#d4a017",fontWeight:600},
  label:{display:"block",color:"#d4a017",fontSize:"0.82rem",marginBottom:"0.35rem"},
  input:{width:"100%",background:"rgba(255,248,240,0.05)",border:"1px solid rgba(212,160,23,0.3)",borderRadius:"8px",padding:"0.65rem 0.9rem",color:"#fff8f0",fontFamily:"'Noto Sans Gujarati',sans-serif",fontSize:"0.95rem",outline:"none",boxSizing:"border-box"},
  error:{background:"rgba(180,50,50,0.15)",border:"1px solid rgba(180,50,50,0.4)",borderRadius:"8px",padding:"0.6rem 0.9rem",color:"#e88a7c",fontSize:"0.85rem",marginBottom:"1rem"},
  success:{background:"rgba(50,160,80,0.15)",border:"1px solid rgba(50,160,80,0.4)",borderRadius:"8px",padding:"0.6rem 0.9rem",color:"#7ce88a",fontSize:"0.85rem",marginBottom:"1rem"},
  btn:{width:"100%",padding:"0.85rem",background:"linear-gradient(135deg,#8b1a1a,#ff6b1a,#d4a017)",border:"none",borderRadius:"10px",color:"white",fontFamily:"'Yatra One',cursive",fontSize:"1.1rem",cursor:"pointer",marginTop:"0.5rem",boxShadow:"0 4px 20px rgba(255,107,26,0.3)"},
  otpHeader:{textAlign:"center",marginBottom:"1.2rem"},
  otpTitle:{color:"#d4a017",fontFamily:"'Yatra One',cursive",fontSize:"1.2rem",margin:"0.4rem 0 0.3rem"},
  otpSub:{color:"rgba(255,248,240,0.55)",fontSize:"0.85rem",lineHeight:1.6},
  otpBoxWrap:{display:"flex",justifyContent:"center",marginBottom:"1rem"},
  otpInput:{width:"100%",background:"rgba(255,248,240,0.05)",border:"2px solid rgba(212,160,23,0.4)",borderRadius:"12px",padding:"1rem",color:"#d4a017",fontFamily:"monospace",fontSize:"2rem",textAlign:"center",outline:"none",letterSpacing:"0.5rem",boxSizing:"border-box"},
  otpFooter:{textAlign:"center",marginTop:"1rem",fontSize:"0.82rem",color:"rgba(255,248,240,0.4)"},
  linkBtn:{background:"none",border:"none",color:"#ff6b1a",cursor:"pointer",fontSize:"0.82rem",textDecoration:"underline",padding:0,fontFamily:"'Noto Sans Gujarati',sans-serif"}
};    }
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
