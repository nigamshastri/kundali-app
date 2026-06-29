import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("kundali_token");
    if (token) {
      authAPI.me()
        .then((data) => setUser(data.user))
        .catch(() => localStorage.removeItem("kundali_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem("kundali_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, phone, password) => {
    const data = await authAPI.register({ name, email, phone, password });
    localStorage.setItem("kundali_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("kundali_token");
    setUser(null);
  };

  const refreshUser = async () => {
    const data = await authAPI.me();
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
