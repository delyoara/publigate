"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Journal = {
  id: string;
  name: string;
};

type User = {
  email: string;
  role: string;
  roles?: string[];
  journals?: Journal[];
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, journalId: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Chargement initial du token + utilisateur
  useEffect(() => {
    const storedToken = sessionStorage.getItem("userToken");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/me/", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Erreur chargement utilisateur :", error);
    }
  };

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
        setUser(data.user); // ou fetchUser(data.token) si tu préfères
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur login :", error);
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
