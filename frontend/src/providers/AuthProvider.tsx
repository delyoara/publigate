"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type JournalRole = {
  journal_id: number;
  journal_name: string;
  role: string;
  hasUrgentTask?: boolean;
};

type UserProfile = {
  id: number;
  email: string;
  first_name: string;
  username: string;
  journals?: JournalRole[];
  roles?: string[];
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string, journalId: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      await fetch("http://localhost:8000/api/refresh-token/", {
        method: "POST",
        credentials: "include",
      });

      const res = await fetch("http://localhost:8000/api/me/", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Échec du chargement du profil");

      const data: UserProfile = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Erreur profil :", error);
      setUser(null);
    } finally {
      setLoading(false);
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

      if (!res.ok) return false;

      await refreshUser();
      return true;
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
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Erreur déconnexion :", error);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
