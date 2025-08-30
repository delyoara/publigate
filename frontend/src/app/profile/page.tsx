
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  discipline?: string;
  institution?: string;
  affiliation?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  research_themes?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // récupérer les infos 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/me/", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erreur chargement profil");
        const data: UserProfile = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur profil :", error);
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Erreur déconnexion :", error);
    }
  };

  if (!user) return <p className="p-8">Chargement du profil...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* menu déroulant */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mon profil</h1>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {user.first_name}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => router.push("/profile")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Modifier mon profil
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Infos perso*/}
      <section className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Prénom :</strong> {user.first_name}</p>
          <p><strong>Nom :</strong> {user.last_name}</p>
          <p><strong>Nom d’utilisateur :</strong> {user.username}</p>
          <p><strong>Email :</strong> {user.email}</p>
        </div>
      </section>

      {/* Infos pro */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Informations professionnelles</h2>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Discipline :</strong> {user.discipline || "—"}</p>
          <p><strong>Institution :</strong> {user.institution || "—"}</p>
          <p><strong>Affiliation :</strong> {user.affiliation || "—"}</p>
          <p><strong>Adresse :</strong> {user.address || "—"}</p>
          <p><strong>Ville :</strong> {user.city || "—"}</p>
          <p><strong>Code postal :</strong> {user.zipcode || "—"}</p>
          <p><strong>Pays :</strong> {user.country || "—"}</p>
          <p><strong>Thèmes de recherche :</strong> {user.research_themes || "—"}</p>
        </div>
      </section>
    </div>
  );
}
