"use client";
import SidebarJournalList from "@/app/components/SidebarJournalList";
import JournalRoles from "@/app/components/JournalRoles";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type JournalRole = {
  journal_id: number;
  journal_name: string;
  role: string;
  hasUrgentTask?: boolean;
};

type UserProfile = {
  id: number;
  email: string;
  username: string;
  journals?: JournalRole[];
  roles?: string[];
};

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const journalId = parseInt(id as string);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        await fetch("http://localhost:8000/api/refresh-token/", {
          method: "POST",
          credentials: "include",
        });

        const profileRes = await fetch("http://localhost:8000/api/me/", {
          method: "GET",
          credentials: "include",
        });

        if (!profileRes.ok) throw new Error("Échec du chargement du profil");

        const data: UserProfile = await profileRes.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur profil :", error);
        router.push(`/login/${id}`);
      }
    };

    fetchUserProfile();
  }, [router, id]);

  useEffect(() => {
    if (user?.journals) {
      const journal = user.journals.find(j => j.journal_id === journalId);
      if (!journal) {
        router.push("/unauthorized");
      }
    }
  }, [user, journalId, router]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
      router.push(`/login/${id}`);
    } catch (error) {
      console.error("Erreur déconnexion :", error);
    }
  };

  if (!user) return <p className="p-8">Chargement du profil...</p>;

  const currentJournal = user.journals?.find(j => j.journal_id === journalId);
  const otherJournals = user.journals?.filter(j => j.journal_id !== journalId) || [];
const roles = user.journals
  ?.filter(j => j.journal_id === journalId)
  .map(j => j.role) || [];


  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <SidebarJournalList journals={user.journals || []} currentJournalId={journalId} />

      {/* Main content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Espace de la revue</h2>
            <p className="text-sm text-gray-600">
              <strong>{currentJournal?.journal_name}</strong> — Rôle : <strong>{currentJournal?.role}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-bold text-blue-700">{user.username}</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Roles section */}
        <JournalRoles
          journalName={currentJournal?.journal_name || "Revue inconnue"}
          roles={roles}
        />
      </div>
    </div>
  );
}
