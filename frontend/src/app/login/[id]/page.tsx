"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { JournalLinks } from "@/app/components/JournalLinks";

type LinkItem = { name: string; url: string };

type Journal = {
  id: string;
  name: string;
  description?: string;
  website_url?: string;
  image?: string;
  logo?: string;
  links?: LinkItem[];
};

export default function LoginPage() {
  const { id } = useParams();
  const router = useRouter();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedJournal");
    if (stored) {
      const parsed: Journal = JSON.parse(stored);
      if (parsed.id === id) {
        setJournal(parsed);
      } else {
        setError("Le journal sélectionné ne correspond pas à l'URL.");
      }
    } else {
      setError("Aucune donnée de journal trouvée.");
    }
  }, [id]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: 'POST',
        credentials: 'include', 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          journal_id: journal?.id
        })
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        sessionStorage.setItem("userToken", data.token);
        router.push(`/dashboard/${journal?.id}`);
      } else {
        setError(data.message || "Identifiants incorrects");
      }
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen font-sans flex">
      <Sidebar
        journal={
          journal
            ? {
                id: journal.id,
                name: journal.name,
                roles: [],
                links: journal.links ?? []
              }
            : null
        }
        mode="public"
      />
      <div className="flex flex-col flex-1">
        <Navbar journal={journal} />
        <main className="flex-1 flex flex-col items-center justify-start px-8 sm:px-20 py-10">
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {journal && (
            <div className="text-center max-w-xl w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {journal.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {journal.description}
              </p>

              <JournalLinks links={journal.links ?? []} />

              <form
                onSubmit={handleLogin}
                className="mt-6 flex flex-col gap-4 w-full max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border px-4 py-2 rounded"
                  required
                />

                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border px-4 py-2 rounded"
                  required
                />

                <button
                  type="submit"
                  className="bg-[#7c0b2b] text-white px-6 py-3 rounded hover:bg-[#450920] transition"
                >
                  Se connecter
                </button>

                <p className="text-sm text-center text-gray-600">
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => router.push(`/register/${journal.id}`)}
                    className="text-[#7c0b2b] hover:underline"
                  >
                    Créer un compte
                  </button>
{/* 
                  <p className="text-sm text-center text-gray-600">
                  Mot de passe perdu ?{" "}
                  <button
                    type="button"
                    onClick={() => router.push(`/register/${journal.id}`)}
                    className="text-[#7c0b2b] hover:underline"
                  >
                    Reinitialiser le mot de passe
                  </button> */}

                </p>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
