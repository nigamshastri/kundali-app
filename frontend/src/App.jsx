import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./components/Auth/AuthPage";
import Navbar from "./components/Layout/Navbar";
import KundaliTab from "./components/Kundali/KundaliTab";
import MyKundalis from "./components/Kundali/MyKundalis";
import BookAppointment from "./components/Appointment/BookAppointment";
import MyAppointments from "./components/Appointment/MyAppointments";
import Profile from "./components/Auth/Profile";
import LandingPage from "./components/Landing/LandingPage";

function AppInner() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("kundali");
  const [apptKey, setApptKey] = useState(0);
  const [myKundaliKey, setMyKundaliKey] = useState(0);
  const [prefillData, setPrefillData] = useState(null);
  const [kundaliTabKey, setKundaliTabKey] = useState(0);
  // "landing" | "login" | "register" | "app"
  const [screen, setScreen] = useState("landing");

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#04020e", color:"#d4a017", fontSize:"1.2rem", fontFamily:"Georgia,serif" }}>
      🕉️ લોડ થઈ રહ્યું છે...
    </div>
  );

  // Logged in → main app
  if (user) {
    const handleLoadKundali = (k) => {
      setPrefillData({ name:k.name, dob:k.dob, tob:k.tob, pob:k.pob, lat:k.lat, lon:k.lon });
      setKundaliTabKey(n => n+1);
      setTab("kundali");
    };
    return (
      <div style={{ minHeight:"100vh", background:"#04020e" }}>
        <Navbar activeTab={tab} setActiveTab={setTab} />
        {tab === "kundali"       && <KundaliTab key={kundaliTabKey} onSaved={() => setMyKundaliKey(k=>k+1)} prefillData={prefillData} onPrefillConsumed={() => setPrefillData(null)} />}
        {tab === "my-kundalis"   && <MyKundalis key={myKundaliKey} onLoad={handleLoadKundali} />}
        {tab === "book"          && <BookAppointment onBooked={() => { setApptKey(k=>k+1); setTab("appointments"); }} />}
        {tab === "appointments"  && <MyAppointments key={apptKey} />}
        {tab === "profile"       && <Profile />}
      </div>
    );
  }

  // Not logged in screens
  if (screen === "landing") {
    return <LandingPage onLogin={() => setScreen("login")} onRegister={() => setScreen("register")} />;
  }

  return <AuthPage initialMode={screen === "register" ? "register" : "login"} onBack={() => setScreen("landing")} />;
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
