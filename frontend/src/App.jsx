import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./components/Auth/AuthPage";
import Navbar from "./components/Layout/Navbar";
import KundaliTab from "./components/Kundali/KundaliTab";
import MyKundalis from "./components/Kundali/MyKundalis";
import BookAppointment from "./components/Appointment/BookAppointment";
import MyAppointments from "./components/Appointment/MyAppointments";
import Profile from "./components/Auth/Profile";

function AppInner() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("kundali");
  const [apptKey, setApptKey] = useState(0);
  const [myKundaliKey, setMyKundaliKey] = useState(0);

  if (loading) return (
    <div style={loadingStyle}>🕉️ લોડ થઈ રહ્યું છે...</div>
  );

  if (!user) return <AuthPage />;

  return (
    <div style={{ minHeight: "100vh", background: "#1a0a00" }}>
      <Navbar activeTab={tab} setActiveTab={setTab} />

      {tab === "kundali" && (
        <KundaliTab onSaved={() => setMyKundaliKey(k => k + 1)} />
      )}
      {tab === "my-kundalis" && (
        <MyKundalis key={myKundaliKey} onLoad={(k) => setTab("kundali")} />
      )}
      {tab === "book" && (
        <BookAppointment onBooked={() => {
          setApptKey(k => k + 1);
          setTab("appointments");
        }} />
      )}
      {tab === "appointments" && (
        <MyAppointments key={apptKey} />
      )}
      {tab === "profile" && <Profile />}
    </div>
  );
}

const loadingStyle = {
  minHeight: "100vh", display: "flex", alignItems: "center",
  justifyContent: "center", background: "#1a0a00",
  color: "#d4a017", fontSize: "1.2rem"
};

export default function App() {
  return (
    <AuthProvider><AppInner /></AuthProvider>
  );
}
