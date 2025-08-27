"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type JournalRole = {
  journal_id: number;
  journal_name: string;
  role: string;
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
  const { id } = useParams(); // ID du journal actif

  const journalId = parseInt(id as string);

  useEffect(() => {
  const fetchUserProfile = async () => {
  try {
    // Rafraîchir le token
    await fetch("http://localhost:8000/api/refresh-token/", {
      method: "POST",
      credentials: "include",
    });

    //  Récupérer le profil utilisateur
    const profileRes = await fetch("http://localhost:8000/api/me/", {
      method: "GET",
      credentials: "include",
    });

    if (!profileRes.ok) throw new Error("Échec du chargement du profil");

    const data: UserProfile = await profileRes.json();
    // console.log("Utilisateur chargé :", data);
    setUser(data);
  } catch (error) {
    console.error("Erreur profil :", error);
    router.push(`/login/${id}`);
  }
};

    fetchUserProfile();
  }, [router, id]);

useEffect(() => {
  if (user && Array.isArray(user.journals)) {
    const journal = user.journals.find(j => j.journal_id === journalId);
    if (!journal) {
      router.push("/unauthorized");
    } else {
      console.log("Accès autorisé au journal :", journal.journal_name);
      console.log("🎓 Rôle :", journal.role);
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

  return (
    <div className="p-8 font-sans">
      <header className="flex justify-between items-center">
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

      <main className="mt-6">
        <h3 className="text-lg font-medium mb-2">Accès à vos autres revues</h3>
        {user.journals && user.journals.length > 1 ? (
          <ul className="list-disc pl-6">
            {user.journals
              .filter(j => j.journal_id !== journalId)
              .map(j => (
                <li key={j.journal_id}>
                  <button
                    onClick={() => router.push(`/dashboard/${j.journal_id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    {j.journal_name} ({j.role})
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p>Vous n'avez accès qu'à cette revue pour le moment.</p>
        )}
      </main>
    </div>
  );
}
