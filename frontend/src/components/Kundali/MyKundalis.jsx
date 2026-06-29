import { useEffect, useState } from "react";
import { kundaliAPI } from "../../services/api";

export default function MyKundalis({ onLoad }) {
  const [kundalis, setKundalis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    kundaliAPI.myKundalis()
      .then((d) => setKundalis(d.kundalis))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    if (!confirm("આ કુંડળી કાઢી નાખવી?")) return;
    await kundaliAPI.delete(id);
    setKundalis((prev) => prev.filter((k) => k.kundali_id !== id));
  };

  if (loading) return <div style={styles.center}>⏳ લોડ થઈ રહ્યું છે...</div>;

  return (
    <div style={styles.wrap}>
      <h2 style={styles.heading}>📚 મારી સાચવેલ કુંડળીઓ</h2>
      {kundalis.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔯</div>
          <p>કોઈ કુંડળી સાચવી નથી.<br />ઉપર "કુંડળી" ટૅબ માં જઈ ગ્રહ-સ્થિતિ જોઈ સાચવો.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {kundalis.map((k) => (
            <div key={k.kundali_id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.kId}>#{k.kundali_id}</div>
                <div style={styles.kDate}>{k.saved_at?.slice(0, 10)}</div>
              </div>
              <div style={styles.kName}>{k.name || "—"}</div>
              <div style={styles.kMeta}>
                <span>📅 {k.dob}</span>
                <span>🕐 {k.tob}</span>
              </div>
              <div style={styles.kMeta}>
                <span>📍 {k.pob}</span>
              </div>
              {k.lagna && <div style={styles.kLagna}>લગ્ન: {k.lagna}</div>}
              {k.label && <div style={styles.kLabel}>🏷️ {k.label}</div>}
              <div style={styles.cardActions}>
                <button style={styles.loadBtn} onClick={() => onLoad?.(k)}>
                  🔯 ફરી જોવો
                </button>
                <button style={styles.delBtn} onClick={() => remove(k.kundali_id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const C = { gold: "#d4a017", saffron: "#ff6b1a", cream: "#fff8f0", dark: "rgba(45,21,5,0.9)" };

const styles = {
  wrap: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" },
  heading: { color: C.gold, fontFamily: "'Yatra One', cursive", fontSize: "1.4rem", marginBottom: "1.5rem" },
  center: { textAlign: "center", padding: "3rem", color: C.gold },
  empty: { textAlign: "center", padding: "3rem", color: "rgba(255,248,240,0.4)", fontSize: "0.95rem", lineHeight: 1.7 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" },
  card: {
    background: "linear-gradient(135deg, rgba(45,21,5,0.9), rgba(26,10,0,0.95))",
    border: "1px solid rgba(212,160,23,0.25)", borderRadius: "12px",
    padding: "1.2rem", transition: "border-color 0.2s"
  },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" },
  kId: { fontSize: "0.72rem", color: C.saffron, fontWeight: 700, letterSpacing: "0.05em" },
  kDate: { fontSize: "0.7rem", color: "rgba(255,248,240,0.4)" },
  kName: { fontSize: "1.1rem", fontWeight: 600, color: C.cream, marginBottom: "0.5rem" },
  kMeta: { display: "flex", gap: "0.75rem", flexWrap: "wrap", fontSize: "0.78rem", color: "rgba(255,248,240,0.5)", marginBottom: "0.25rem" },
  kLagna: { fontSize: "0.8rem", color: C.gold, marginTop: "0.4rem" },
  kLabel: { fontSize: "0.75rem", color: "rgba(255,248,240,0.4)", marginTop: "0.25rem" },
  cardActions: { display: "flex", gap: "0.5rem", marginTop: "1rem" },
  loadBtn: {
    flex: 1, padding: "0.45rem 0.75rem",
    background: "linear-gradient(135deg, rgba(139,26,26,0.4), rgba(255,107,26,0.2))",
    border: "1px solid rgba(255,107,26,0.4)", borderRadius: "7px",
    color: C.gold, cursor: "pointer", fontSize: "0.82rem",
    fontFamily: "'Noto Sans Gujarati', sans-serif"
  },
  delBtn: {
    padding: "0.45rem 0.6rem", background: "rgba(180,50,50,0.15)",
    border: "1px solid rgba(180,50,50,0.35)", borderRadius: "7px",
    color: "#e88a7c", cursor: "pointer", fontSize: "0.82rem"
  }
};
