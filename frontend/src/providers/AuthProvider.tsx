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
  login: (email: string, password: string, journalId: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Chargement initial du profil utilisateur via cookie
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/me/", {
        method: "GET",
        credentials: "include", // ← envoie les cookies HTTP-only
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
        setUser(data.user); 
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur login :", error);
      return false;
    }
  };

  const logout = async () => {
  try {
    await fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include", 
    });
  } catch (error) {
    console.error("Erreur lors du logout :", error);
  } finally {
    setUser(null);
  }
};


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
