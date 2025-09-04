"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/AuthProvider";
import { useState, useEffect } from "react";

type Props = {
  role?: string;
  journal?: string;
};

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

export default function RoleNavbar({ role, journal }: Props) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [journals, setJournals] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<string>(journal || "");
  const [selectedRole, setSelectedRole] = useState<string>(role || "");

  useEffect(() => {
    if (user) {
      const userJournals = user.journals?.map((j) => j.name) || [];
      const userRoles = user.roles || (user.role ? [user.role] : []);

      setJournals(userJournals);
      setRoles(userRoles);

      if (!selectedJournal && userJournals.length > 0) {
        setSelectedJournal(userJournals[0]);
      }

      if (!selectedRole && userRoles.length > 0) {
        setSelectedRole(userRoles[0]);
      }
    }
  }, [user]);

  const currentJournal = user?.journals?.find((j) => j.name === selectedJournal);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    if (selectedJournal) {
      router.push(`/dashboard/${selectedJournal}/${newRole}`);
    }
  };

  const handleJournalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newJournal = e.target.value;
    setSelectedJournal(newJournal);
    if (selectedRole) {
      router.push(`/dashboard/${newJournal}/${selectedRole}`);
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
      {/* Gauche : logo + sélecteurs */}
      <div className="flex items-center gap-6">
        <span className="font-bold text-xl text-blue-600">
          Publigate – {currentJournal?.name || selectedJournal}
        </span>

        {/* Sélecteur de journal */}
        {journals.length > 0 && (
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Journal actif</label>
            <select
              value={selectedJournal}
              onChange={handleJournalChange}
              className="border rounded px-2 py-1 text-sm"
            >
              {journals.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sélecteur de rôle */}
        {roles.length > 0 && (
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Rôle</label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="border rounded px-2 py-1 text-sm"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r === "editor-in-chief"
                    ? "Éditeur en chef"
                    : r === "author"
                    ? "Auteur"
                    : "Relecteur"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Droite : navigation + déconnexion */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-600 hover:underline"
        >
          Accueil
        </button>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
