"use client";
import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  user: { email: string; role: string } | null;
  token: string | null;
  login: (email: string, password: string, journalId: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("userToken");
    if (stored) setToken(stored);
    // Tu peux aussi charger l'utilisateur ici si tu as un endpoint /me
  }, []);

  const login = async (email: string, password: string, journalId: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, journal_id: journalId }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("userToken", data.token);
        setToken(data.token);
        setUser(data.user); // si ton backend renvoie l'utilisateur
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("userToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
