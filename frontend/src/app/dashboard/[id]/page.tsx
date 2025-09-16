"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

import SidebarJournalList from "@/features/journals/components/SidebarJournalList";
import JournalRoles from "@/features/journals/components/JournalRoles";

export default function Dashboard() {
  const router = useRouter();
  const { id } = useParams();
  const journalId = parseInt(id as string);

  const { user, loading, logout } = useAuth();

  // Redirection si pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login/${id}`);
    }
  }, [loading, user, id, router]);

  // Redirection si pas d'accès à ce journal
  useEffect(() => {
    if (!loading && user?.journals) {
      const journal = user.journals.find((j) => j.journal_id === journalId);
      if (!journal) {
        router.push("/unauthorized");
      }
    }
  }, [loading, user, journalId, router]);

  const goToProfile = () => router.push("/profile");
  const goToRole = (role: string) =>
    router.push(`/dashboard/${journalId}/${role}`);

  if (loading) return <p className="p-8">Chargement du profil...</p>;
  if (!user) return null;

  const currentJournal = user.journals?.find((j) => j.journal_id === journalId);
  const roles =
    user.journals
      ?.filter((j) => j.journal_id === journalId)
      .map((j) => j.role) || [];

  return (
    <div className="flex min-h-screen font-sans">
      <SidebarJournalList
        journals={user.journals || []}
        currentJournalId={journalId}
      />

      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <div></div>
          <div className="flex items-center gap-4">
            <p className="font-bold text-blue-700">{user.first_name}</p>
            <button
              onClick={goToProfile}
                          className="flex items-center gap-1 text-ml text-gray-800 transition-transform hover:scale-105"
            >
              Mon profil
            </button>
            <button
              onClick={logout}
                          className="flex items-center gap-1 text-ml text-gray-800 transition-transform hover:scale-105"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <JournalRoles
          journalName={currentJournal?.journal_name || "Revue inconnue"}
          roles={roles}
          onSelectRole={goToRole}
        />
      </div>
    </div>
  );
}
