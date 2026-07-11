import { useAuth } from "../../context/AuthContext";

export default function HomeTab({ onBook, onKundali }) {
  const { user } = useAuth();

  const features = [
    { icon: "🔯", title: "Kundali Vishleshan", desc: "Complete birth chart with planetary positions, houses, dashas and yogas." },
    { icon: "💍", title: "Vivah Muhurta",      desc: "Auspicious wedding timing with full kundali milan and compatibility." },
    { icon: "🏠", title: "Vastu Shastra",      desc: "Property direction aligned with cosmic energies for prosperity." },
    { icon: "⏳", title: "Muhurta Chayan",     desc: "Electional astrology for new ventures, travel and ceremonies." },
    { icon: "🪐", title: "Graha Shanti",       desc: "Planetary remedies, mantras and gemstone recommendations." },
    { icon: "👶", title: "Naam Karan",         desc: "Auspicious name selection based on nakshatra and rashi." },
  ];

  const planets = [
    { sym:"☀️", en:"Sun",     gu:"સૂર્ય", col:"#ffcc00" },
    { sym:"🌙", en:"Moon",    gu:"ચંદ્ર", col:"#aaaaff" },
    { sym:"♂",  en:"Mars",    gu:"મંગળ",  col:"#ff5555" },
    { sym:"☿",  en:"Mercury", gu:"બુધ",   col:"#88ff88" },
    { sym:"♃",  en:"Jupiter", gu:"ગુરુ",  col:"#ffaa44" },
    { sym:"♀",  en:"Venus",   gu:"શુક્ર", col:"#ffaaff" },
    { sym:"♄",  en:"Saturn",  gu:"શનિ",   col:"#aaaaaa" },
    { sym:"☊",  en:"Rahu",    gu:"રાહુ",  col:"#9966ff" },
    { sym:"☋",  en:"Ketu",    gu:"કેતુ",  col:"#ff66aa" },
  ];

  const doshas = [
    { icon:"⚔️", name:"Mangal Dosha",    col:"#ff7777", bg:"rgba(80,8,8,0.25)",   bc:"rgba(180,35,35,0.25)", desc:"Mars in houses 1,4,7,8,10,12 — impacts marriage and partnerships." },
    { icon:"🐍", name:"Kaal Sarp Dosha", col:"#66ee88", bg:"rgba(4,35,18,0.25)",  bc:"rgba(25,140,65,0.25)",  desc:"All planets between Rahu-Ketu — repeated obstacles and delays." },
    { icon:"🌘", name:"Pitru Dosha",     col:"#ffcc44", bg:"rgba(50,33,0,0.25)", bc:"rgba(160,115,8,0.25)",  desc:"Ancestral karma affecting health, children and family harmony." },
  ];

  return (
    <div style={S.root}>
      {/* Welcome Banner */}
      <div style={S.welcome}>
        <div style={S.welcomeInner}>
          <div style={S.om}>🕉️</div>
          <div>
            <h1 style={S.welcomeTitle}>નમસ્તે, {user?.name?.split(" ")[0]}!</h1>
            <p style={S.welcomeSub}>"Life guided by sacred wisdom — let the stars illuminate your path."</p>
          </div>
        </div>
        <div style={S.quickBtns}>
          <button style={S.btnP} onClick={onKundali}>🔯 કુંડળી બનાવો</button>
          <button style={S.btnS} onClick={onBook}>📅 Appointment Book</button>
        </div>
      </div>

      {/* Stats */}
      <div style={S.statsGrid}>
        {[["5000+","Kundalis Made"],["40+","Years Experience"],["12+","States Served"],["99%","Satisfied"]].map(([n,l]) => (
          <div key={l} style={S.statCard}>
            <span style={S.statNum}>{n}</span>
            <span style={S.statLabel}>{l}</span>
          </div>
        ))}
      </div>

      {/* Navagraha */}
      <div style={S.sec}>
        <h2 style={S.secTitle}>नवग्रह · Navagraha</h2>
        <p style={S.secSub}>NINE PLANETS · NINE DESTINIES</p>
        <div style={S.planetGrid}>
          {planets.map(p => (
            <div key={p.en} style={S.planetCard}>
              <span style={S.pcSym}>{p.sym}</span>
              <div style={{ ...S.pcEn, color: p.col }}>{p.en}</div>
              <div style={S.pcGu}>{p.gu}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.divider} />

      {/* Services */}
      <div style={S.sec}>
        <h2 style={S.secTitle}>Our Services</h2>
        <p style={S.secSub}>COMPLETE VEDIC GUIDANCE</p>
        <div style={S.featGrid}>
          {features.map(f => (
            <div key={f.title} style={S.featCard}>
              <span style={S.featIcon}>{f.icon}</span>
              <h3 style={S.featTitle}>{f.title}</h3>
              <p style={S.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={S.divider} />

      {/* Doshas */}
      <div style={S.sec}>
        <h2 style={S.secTitle}>Dosha Analysis</h2>
        <p style={S.secSub}>DETECTED · REMEDIED · RESOLVED</p>
        <div style={S.doshaGrid}>
          {doshas.map(d => (
            <div key={d.name} style={{ ...S.doshaCard, background: d.bg, borderColor: d.bc }}>
              <span style={S.doshaIcon}>{d.icon}</span>
              <h3 style={{ ...S.doshaName, color: d.col }}>{d.name}</h3>
              <p style={S.doshaDesc}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={S.divider} />

      {/* Testimonials */}
      <div style={S.sec}>
        <h2 style={S.secTitle}>Testimonials</h2>
        <p style={S.secSub}>THOUSANDS OF FAMILIES GUIDED</p>
        <div style={S.testGrid}>
          {[
            { text:"Shastri ji's kundali reading was remarkably accurate. His guidance proved exactly right within months.", name:"Rajesh Patel", city:"Ahmedabad" },
            { text:"We consulted for our daughter's vivah muhurta. His traditional knowledge is unmatched in Gujarat.", name:"Meena Shah", city:"Surat" },
            { text:"The Kaal Sarp remedy he suggested transformed our business completely. A true Jyotishi.", name:"Dhruv Mehta", city:"Vadodara" },
          ].map(t => (
            <div key={t.name} style={S.testCard}>
              <div style={S.testStars}>★★★★★</div>
              <p style={S.testText}>"{t.text}"</p>
              <div style={S.testName}>{t.name}</div>
              <div style={S.testCity}>{t.city}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={S.footer}>
        <div style={{ fontSize:"1.5rem", opacity:0.2, marginBottom:"0.3rem" }}>🕉️</div>
        <div>© 2026 Nigmayu Jyotish · Ahmedabad, Gujarat</div>
        <div style={{ marginTop:"0.2rem" }}>Lalbhai Shastri · Vedic Astrologer Since 1984</div>
      </div>
    </div>
  );
}

const S = {
  root: { maxWidth:"1000px", margin:"0 auto", padding:"1.5rem 1.2rem", color:"#fff8f0" },
  welcome: { background:"linear-gradient(135deg,rgba(45,21,5,0.9),rgba(20,5,0,0.95))", border:"1px solid rgba(212,160,23,0.25)", borderRadius:"20px", padding:"2rem", marginBottom:"1.5rem" },
  welcomeInner: { display:"flex", alignItems:"center", gap:"1.2rem", marginBottom:"1.5rem", flexWrap:"wrap" },
  om: { fontSize:"3rem", lineHeight:1 },
  welcomeTitle: { fontSize:"clamp(1.3rem,3vw,1.8rem)", color:"#d4a017", fontFamily:"'Georgia',serif", marginBottom:"0.3rem" },
  welcomeSub: { fontSize:"clamp(0.8rem,2vw,0.92rem)", color:"rgba(255,248,240,0.5)", fontStyle:"italic", fontFamily:"'Georgia',serif" },
  quickBtns: { display:"flex", gap:"0.85rem", flexWrap:"wrap" },
  btnP: { padding:"0.7rem 1.5rem", borderRadius:"50px", background:"linear-gradient(135deg,#7a1515,#c84000,#c49010)", border:"none", color:"#fff", fontSize:"0.9rem", cursor:"pointer", fontFamily:"'Georgia',serif" },
  btnS: { padding:"0.7rem 1.5rem", borderRadius:"50px", background:"transparent", border:"1px solid rgba(212,160,23,0.4)", color:"#d4a017", fontSize:"0.9rem", cursor:"pointer", fontFamily:"'Georgia',serif" },
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))", gap:"0.85rem", marginBottom:"2rem" },
  statCard: { textAlign:"center", padding:"1.2rem 0.7rem", background:"rgba(8,4,18,0.85)", border:"1px solid rgba(212,160,23,0.12)", borderRadius:"14px", display:"flex", flexDirection:"column", gap:"0.25rem" },
  statNum: { fontSize:"clamp(1.4rem,3vw,1.9rem)", fontWeight:700, color:"#d4a017", lineHeight:1 },
  statLabel: { fontSize:"0.65rem", color:"rgba(255,248,240,0.32)", fontFamily:"sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" },
  sec: { padding:"1.5rem 0" },
  secTitle: { textAlign:"center", fontSize:"clamp(1.2rem,3vw,1.7rem)", color:"#d4a017", marginBottom:"0.3rem", fontFamily:"'Georgia',serif" },
  secSub: { textAlign:"center", fontSize:"0.65rem", color:"rgba(255,248,240,0.28)", marginBottom:"2rem", fontFamily:"sans-serif", letterSpacing:"0.12em", textTransform:"uppercase" },
  divider: { height:"1px", background:"linear-gradient(90deg,transparent,rgba(212,160,23,0.18),transparent)", margin:"1rem 0" },
  planetGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(85px,1fr))", gap:"0.75rem" },
  planetCard: { background:"rgba(8,4,18,0.85)", border:"1px solid rgba(212,160,23,0.12)", borderRadius:"13px", padding:"0.9rem 0.5rem", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.2rem" },
  pcSym: { fontSize:"1.5rem" },
  pcEn: { fontSize:"0.7rem", fontWeight:700, fontFamily:"sans-serif" },
  pcGu: { fontSize:"0.62rem", color:"rgba(255,248,240,0.32)", fontFamily:"sans-serif" },
  featGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem" },
  featCard: { background:"rgba(8,4,18,0.9)", border:"1px solid rgba(212,160,23,0.1)", borderRadius:"16px", padding:"1.4rem", transition:"all 0.3s" },
  featIcon: { fontSize:"2rem", display:"block", marginBottom:"0.7rem" },
  featTitle: { fontSize:"0.92rem", color:"#d4a017", marginBottom:"0.35rem", fontFamily:"'Georgia',serif" },
  featDesc: { fontSize:"0.76rem", color:"rgba(255,248,240,0.42)", lineHeight:1.7, fontFamily:"sans-serif" },
  doshaGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"0.95rem" },
  doshaCard: { borderRadius:"15px", padding:"1.4rem", textAlign:"center", border:"1px solid", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.4rem" },
  doshaIcon: { fontSize:"2.2rem" },
  doshaName: { fontSize:"0.9rem", fontWeight:700, fontFamily:"'Georgia',serif" },
  doshaDesc: { fontSize:"0.73rem", color:"rgba(255,248,240,0.42)", lineHeight:1.65, fontFamily:"sans-serif" },
  testGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1rem" },
  testCard: { background:"rgba(8,4,18,0.88)", border:"1px solid rgba(212,160,23,0.1)", borderRadius:"15px", padding:"1.3rem", display:"flex", flexDirection:"column", gap:"0.4rem" },
  testStars: { color:"#d4a017", fontSize:"0.78rem" },
  testText: { fontSize:"0.8rem", color:"rgba(255,248,240,0.58)", lineHeight:1.75, fontStyle:"italic", flex:1 },
  testName: { fontSize:"0.8rem", fontWeight:700, color:"#d4a017" },
  testCity: { fontSize:"0.68rem", color:"rgba(255,248,240,0.28)", fontFamily:"sans-serif" },
  footer: { textAlign:"center", padding:"2rem 0", color:"rgba(255,248,240,0.18)", fontSize:"0.75rem", fontFamily:"sans-serif" },
};
