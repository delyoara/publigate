"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react"; 
import { User } from "lucide-react"; 

type UserJournal = {
  journal_id: number;
  journal_name: string;
  role: string;
  source?: "committee" | "userrole";
};

type AuthUser = {
  email: string;
  journals?: UserJournal[];
};
type RoleNavbarProps = {
  role?: string;
  journal?: string | number;
};

export default function RoleNavbar ({ role, journal }: RoleNavbarProps) {
  const router = useRouter();
  const params = useParams();
  const journalId = Number(params.id);

  const { user, logout } = useAuth() as { user?: AuthUser; logout: () => void };

  const [selectedRole, setSelectedRole] = useState<string>("");

  const currentJournal = user?.journals?.find(
    (j) => j.journal_id === journalId
  );

  useEffect(() => {
    if (currentJournal) {
      setSelectedRole(currentJournal.role);
    }
  }, [currentJournal]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    if (currentJournal) {
      router.push(`/dashboard/${currentJournal.journal_id}/${newRole}`);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    });
    logout();
    router.push("/");
  };

  return (
    <nav className="flex justify-between items-center bg-white border-b px-6 py-4 shadow-sm">
      {/* Gauche : logo + nom du journal */}
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl text-blue-600">Publigate</span>
        {currentJournal && (
          <span className="text-lg font-medium text-gray-700">
            {currentJournal.journal_name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {currentJournal && (
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="bg-transparent text-sm focus:outline-none"
          >
            {user?.journals
              ?.filter((j) => j.journal_id === currentJournal.journal_id)
              .map((j, idx) => (
                <option key={`${j.role}-${idx}`} value={j.role}>
                  {j.role === "editor-in-chief"
                    ? "Éditeur en chef"
                    : j.role === "author"
                    ? "Auteur"
                    : j.role}
                </option>
              ))}
          </select>
        )}

        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-1 text-sm text-gray-700 hover:underline"
        >
          <User className="w-4 h-4" />
          Mon profil
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-red-600 hover:underline"
        >
          <LogOut className="w-4 h-4" />
          {/* Déconnexion */}
        </button>
      </div>
    </nav>
  );
}
