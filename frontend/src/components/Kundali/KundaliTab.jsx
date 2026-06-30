import { useState, useEffect, useRef } from "react";
import { kundaliAPI } from "../../services/api";

export default function KundaliTab({ onSaved, prefillData, onPrefillConsumed }) {
  const [kundaliData, setKundaliData] = useState(null);
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const iframeRef = useRef(null);
  const ackedRef = useRef(false);

  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === "KUNDALI_READY") {
        setKundaliData(event.data.data);
        setSavedMsg("");
        setTimeout(() => {
          document.getElementById("save-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 400);
      }
      if (event.data?.type === "KUNDALI_LOADED_ACK") {
        ackedRef.current = true;
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Robustly push prefill data: retry every 300ms until iframe acks, max 4s
  useEffect(() => {
    if (!prefillData) return;
    ackedRef.current = false;
    let attempts = 0;
    const maxAttempts = 14; // ~4.2s

    const interval = setInterval(() => {
      attempts++;
      if (ackedRef.current || attempts > maxAttempts) {
        clearInterval(interval);
        if (!ackedRef.current) {
          console.warn("Kundali prefill: no ack received after retries");
        }
        onPrefillConsumed?.();
        return;
      }
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "LOAD_KUNDALI", data: prefillData },
          "*"
        );
      } catch (e) {
        // iframe not ready yet, will retry
      }
    }, 300);

    return () => clearInterval(interval);
  }, [prefillData]);

  const saveKundali = async () => {
    if (!kundaliData) return;
    setSaving(true);
    try {
      await kundaliAPI.save({ ...kundaliData, label });
      setSavedMsg("✅ કુંડળી સફળ રીતે સાચવી! 'મારી કુંડળીઓ' ટૅબ માં જોઈ શકો.");
      setKundaliData(null);
      setLabel("");
      onSaved?.();
    } catch (e) {
      setSavedMsg("⚠️ " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {kundaliData && (
        <div id="save-panel" style={styles.savePanel}>
          <div style={styles.savePanelInner}>
            <div style={styles.savePanelTitle}>
              🔯 કુંડળી તૈયાર! — <span style={{ color: "#ff6b1a" }}>{kundaliData.name}</span>
            </div>
            <div style={styles.savePanelMeta}>
              <span>📅 {kundaliData.dob}</span>
              <span>🕐 {kundaliData.tob}</span>
              <span>📍 {kundaliData.pob}</span>
              <span>⭐ લગ્ન: {kundaliData.lagna}</span>
              <span>🌙 રાશિ: {kundaliData.rashi}</span>
              <span>✨ નક્ષત્ર: {kundaliData.nakshatra}</span>
            </div>
            <div style={styles.saveRow}>
              <input
                style={styles.labelInput}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="🏷️ ઓળખ-નામ (optional) — દા.ત. 'પત્ની', 'ભાઈ'"
              />
              <button
                style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
                onClick={saveKundali}
                disabled={saving}
              >
                {saving ? "⏳ સાચવી રહ્યા..." : "💾 ખાતામાં સાચવો"}
              </button>
            </div>
          </div>
        </div>
      )}

      {savedMsg && <div style={styles.savedBanner}>{savedMsg}</div>}

      {!kundaliData && !savedMsg && !prefillData && (
        <div style={styles.hintBar}>
          <span>👇</span>
          <span>નીચે જન્મ-વિગત ભરો → <strong style={{ color: "#d4a017" }}>✨ કુંડળી બનાવો</strong> દબાવો → ઉપર <strong style={{ color: "#ff6b1a" }}>💾 સાચવો</strong> બટન આવશે</span>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src="/kundali.html"
        style={styles.iframe}
        title="Kundali Calculator"
      />
    </div>
  );
}

const styles = {
  savePanel: {
    position: "sticky", top: "64px", zIndex: 50,
    background: "linear-gradient(135deg, rgba(26,10,0,0.98), rgba(45,21,5,0.98))",
    borderBottom: "2px solid rgba(255,107,26,0.5)",
    padding: "0.9rem 1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
  },
  savePanelInner: { maxWidth: "1100px", margin: "0 auto" },
  savePanelTitle: { fontSize: "1rem", fontFamily: "'Yatra One', cursive", color: "#d4a017", marginBottom: "0.4rem" },
  savePanelMeta: { display: "flex", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.8rem", color: "rgba(255,248,240,0.6)", marginBottom: "0.7rem" },
  saveRow: { display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" },
  labelInput: { flex: 1, minWidth: "220px", background: "rgba(255,248,240,0.06)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: "8px", padding: "0.55rem 0.9rem", color: "#fff8f0", fontFamily: "'Noto Sans Gujarati', sans-serif", fontSize: "0.88rem", outline: "none" },
  saveBtn: { padding: "0.55rem 1.5rem", background: "linear-gradient(135deg, #8b1a1a, #ff6b1a, #d4a017)", border: "none", borderRadius: "8px", color: "white", fontFamily: "'Yatra One', cursive", fontSize: "1rem", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 15px rgba(255,107,26,0.35)" },
  savedBanner: { background: "rgba(50,160,80,0.12)", border: "1px solid rgba(50,160,80,0.3)", borderRadius: "8px", padding: "0.75rem 1.2rem", color: "#7ce88a", fontSize: "0.9rem", margin: "0.75rem 1.5rem", textAlign: "center" },
  hintBar: { display: "flex", gap: "0.6rem", alignItems: "center", background: "rgba(212,160,23,0.06)", borderBottom: "1px solid rgba(212,160,23,0.15)", padding: "0.6rem 1.5rem", fontSize: "0.83rem", color: "rgba(255,248,240,0.55)" },
  iframe: { width: "100%", height: "calc(100vh - 64px)", border: "none", display: "block" }
};