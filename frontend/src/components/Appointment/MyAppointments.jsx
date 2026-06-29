import { useEffect, useState } from "react";
import { apptAPI } from "../../services/api";

const STATUS_LABEL = { pending: "⏳ પ્રતીક્ષિત", confirmed: "✅ પક્કી", done: "✔ પૂર્ણ", cancelled: "❌ રદ" };
const STATUS_CLASS = { pending: "#d4a017", confirmed: "#7ce88a", done: "#9999ee", cancelled: "#e88a7c" };
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function MyAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  const fetchAppts = () => {
    apptAPI.myAppointments()
      .then((d) => setAppts(d.appointments))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppts(); }, []);

  const changeStatus = async (id, status) => {
    setUpdating(id);
    try {
      await apptAPI.updateStatus(id, status);
      fetchAppts();
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(null);
    }
  };

  const cancelAppt = async (id) => {
    if (!confirm("આ એપોઇન્ટમેન્ટ રદ કરવી?")) return;
    setUpdating(id);
    try {
      await apptAPI.cancel(id);
      fetchAppts();
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? appts : appts.filter((a) => a.status === filter);

  const stats = [
    { label: "કુલ", val: appts.length },
    { label: "પ્રતીક્ષિત", val: appts.filter((a) => a.status === "pending").length },
    { label: "પક્કી", val: appts.filter((a) => a.status === "confirmed").length },
    { label: "પૂર્ણ", val: appts.filter((a) => a.status === "done").length },
  ];

  if (loading) return <div style={{ textAlign: "center", padding: "3rem", color: "#d4a017" }}>⏳ લોડ...</div>;

  return (
    <div style={styles.wrap}>
      <h2 style={styles.heading}>🗓️ મારી એપોઇન્ટમેન્ટ</h2>

      {/* Stats */}
      <div style={styles.statsRow}>
        {stats.map((s) => (
          <div key={s.label} style={styles.stat}>
            <div style={styles.statNum}>{s.val}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={styles.filterRow}>
        {["all","pending","confirmed","done","cancelled"].map((f) => (
          <button key={f} style={{ ...styles.chip, ...(filter === f ? styles.chipActive : {}) }}
            onClick={() => setFilter(f)}>
            {f === "all" ? "બધી" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📅</div>
          <div>કોઈ એપોઇન્ટમેન્ટ મળી નથી</div>
        </div>
      ) : (
        filtered.map((a) => {
          const d = new Date(a.date + "T00:00:00");
          const waLink = `https://wa.me/91${a.phone}?text=${encodeURIComponent(`નમસ્તે ${a.name},\nઆપની ${a.service} એપોઇન્ટમેન્ટ ${a.date} ${a.time} ના રોજ.\n🙏 - Shastri Jyotish`)}`;
          return (
            <div key={a.appointment_id} style={styles.item}>
              {/* Date badge */}
              <div style={styles.dateBadge}>
                <div style={styles.dayNum}>{d.getDate()}</div>
                <div style={styles.monthName}>{MONTHS[d.getMonth()]}</div>
              </div>

              {/* Body */}
              <div style={{ flex: 1 }}>
                <div style={styles.itemName}>
                  {a.gender ? a.gender + " " : ""}{a.name}
                  <span style={{ ...styles.badge, color: STATUS_CLASS[a.status], borderColor: STATUS_CLASS[a.status] + "66" }}>
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
                <div style={styles.meta}>
                  <span>📞 {a.phone}</span>
                  <span>🕐 {a.time}</span>
                  <span>🙏 {a.service}</span>
                  <span>📍 {a.mode}</span>
                </div>
                {a.note && <div style={styles.noteText}>📝 {a.note}</div>}

                {/* Actions */}
                <div style={styles.actions}>
                  {a.status === "pending" && (
                    <ActionBtn color="#7ce88a" onClick={() => changeStatus(a.appointment_id, "confirmed")} disabled={updating === a.appointment_id}>✅ પક્કી</ActionBtn>
                  )}
                  {["pending","confirmed"].includes(a.status) && (
                    <ActionBtn color="#9999ee" onClick={() => changeStatus(a.appointment_id, "done")} disabled={updating === a.appointment_id}>✔ પૂર્ણ</ActionBtn>
                  )}
                  {a.status !== "cancelled" && (
                    <ActionBtn color="#e88a7c" onClick={() => cancelAppt(a.appointment_id)} disabled={updating === a.appointment_id}>❌ રદ</ActionBtn>
                  )}
                  <a href={waLink} target="_blank" style={styles.waBtn}>💬 WhatsApp</a>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function ActionBtn({ color, onClick, disabled, children }) {
  return (
    <button style={{
      padding: "0.3rem 0.7rem", borderRadius: "6px", border: `1px solid ${color}44`,
      color, background: "transparent", cursor: "pointer", fontSize: "0.78rem",
      fontFamily: "'Noto Sans Gujarati', sans-serif", opacity: disabled ? 0.5 : 1
    }} onClick={onClick} disabled={disabled}>{children}</button>
  );
}

const styles = {
  wrap: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" },
  heading: { color: "#d4a017", fontFamily: "'Yatra One', cursive", fontSize: "1.4rem", marginBottom: "1.2rem" },
  statsRow: { display: "flex", gap: "0.75rem", marginBottom: "1.2rem", flexWrap: "wrap" },
  stat: { background: "rgba(45,21,5,0.7)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "10px", padding: "0.7rem 1.2rem", textAlign: "center", minWidth: "70px" },
  statNum: { fontSize: "1.4rem", fontWeight: 700, color: "#d4a017" },
  statLabel: { fontSize: "0.68rem", color: "rgba(255,248,240,0.5)", marginTop: "2px" },
  filterRow: { display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.2rem" },
  chip: { padding: "0.3rem 0.8rem", borderRadius: "20px", border: "1px solid rgba(212,160,23,0.25)", color: "rgba(255,248,240,0.55)", fontSize: "0.78rem", cursor: "pointer", background: "transparent", fontFamily: "'Noto Sans Gujarati', sans-serif" },
  chipActive: { borderColor: "#ff6b1a", color: "#d4a017", background: "rgba(255,107,26,0.1)" },
  empty: { textAlign: "center", padding: "3rem", color: "rgba(255,248,240,0.35)", fontSize: "0.95rem" },
  item: { background: "rgba(45,21,5,0.7)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "10px", padding: "1rem 1.2rem", marginBottom: "0.8rem", display: "flex", gap: "1rem", alignItems: "flex-start" },
  dateBadge: { minWidth: "50px", textAlign: "center", background: "linear-gradient(135deg, rgba(139,26,26,0.5), rgba(255,107,26,0.2))", border: "1px solid rgba(255,107,26,0.3)", borderRadius: "8px", padding: "0.4rem 0.2rem" },
  dayNum: { fontSize: "1.3rem", fontWeight: 700, color: "#d4a017", lineHeight: 1 },
  monthName: { fontSize: "0.6rem", color: "#ff6b1a", letterSpacing: "0.04em" },
  itemName: { fontSize: "0.98rem", fontWeight: 600, color: "#fff8f0", marginBottom: "0.25rem", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" },
  badge: { fontSize: "0.68rem", padding: "0.15rem 0.5rem", borderRadius: "12px", border: "1px solid", fontWeight: 600 },
  meta: { display: "flex", gap: "0.7rem", flexWrap: "wrap", fontSize: "0.78rem", color: "rgba(255,248,240,0.5)", marginBottom: "0.3rem" },
  noteText: { fontSize: "0.76rem", color: "rgba(255,248,240,0.4)", marginTop: "0.25rem" },
  actions: { display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.6rem", alignItems: "center" },
  waBtn: { padding: "0.3rem 0.75rem", borderRadius: "6px", border: "1px solid rgba(37,211,102,0.4)", color: "#25d366", background: "rgba(37,211,102,0.1)", fontSize: "0.78rem", textDecoration: "none" }
};
