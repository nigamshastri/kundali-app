import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: "my-kundalis", label: "🔯 મારી કુંડળીઓ" },
    { id: "book", label: "📅 બુકિંગ" },
    { id: "appointments", label: "🗓️ એપોઇન્ટ." },
    { id: "profile", label: "👤 પ્રોફાઇલ" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.om}>🕉️</span>
        <span style={styles.brandText}>શાસ્ત્રી જ્યોતિષ</span>
      </div>

      {/* Desktop tabs */}
      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button key={t.id} style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* User + logout */}
      <div style={styles.userArea}>
        <span style={styles.userName}>🙏 {user?.name?.split(" ")[0]}</span>
        <button style={styles.logoutBtn} onClick={logout}>બહાર નીકળો</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "linear-gradient(135deg, rgba(26,10,0,0.98), rgba(45,21,5,0.98))",
    borderBottom: "1px solid rgba(212,160,23,0.3)",
    padding: "0.75rem 1.5rem",
    display: "flex", alignItems: "center", gap: "1rem",
    flexWrap: "wrap", position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
  },
  brand: { display: "flex", alignItems: "center", gap: "0.5rem" },
  om: { fontSize: "1.5rem" },
  brandText: { color: "#d4a017", fontFamily: "'Yatra One', cursive", fontSize: "1.1rem", whiteSpace: "nowrap" },
  tabs: { display: "flex", gap: "0.3rem", flex: 1, flexWrap: "wrap" },
  tab: {
    padding: "0.45rem 0.9rem", background: "transparent",
    border: "1px solid rgba(212,160,23,0.2)", borderRadius: "20px",
    color: "rgba(255,248,240,0.6)", cursor: "pointer",
    fontFamily: "'Noto Sans Gujarati', sans-serif", fontSize: "0.82rem",
    transition: "all 0.2s", whiteSpace: "nowrap"
  },
  tabActive: {
    background: "linear-gradient(135deg, rgba(139,26,26,0.5), rgba(255,107,26,0.2))",
    borderColor: "#ff6b1a", color: "#d4a017", fontWeight: 600
  },
  userArea: { display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto" },
  userName: { color: "rgba(255,248,240,0.7)", fontSize: "0.85rem" },
  logoutBtn: {
    padding: "0.35rem 0.9rem", background: "rgba(180,50,50,0.2)",
    border: "1px solid rgba(180,50,50,0.4)", borderRadius: "20px",
    color: "#e88a7c", cursor: "pointer",
    fontFamily: "'Noto Sans Gujarati', sans-serif", fontSize: "0.8rem"
  }
};
