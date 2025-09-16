"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../shared/components/Navbar";
import Sidebar from "../shared/components/Sidebar";
import { JournalLinks } from "../features/journals/components/JournalLinks";
import { visualsByJournal } from "@/shared/data/visualsByjournal";

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

visualsByJournal

export default function Home() {
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/journals/names/");
        const data = await res.json();

        const enriched = data.map((journal: any) => {
          const id = journal.id.toString();
          const visual = visualsByJournal[id] || {};
          return {
            id,
            name: journal.name,
            image: visual.image,
            logo: visual.logo,
          };
        });

        setJournals(enriched);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des journaux :", err);
        setError("Impossible de charger les journaux.");
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const handleSelect = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/journals/${id}/`);
      const data = await res.json();

      const visual = visualsByJournal[id] || {};
      const enrichedJournal: Journal = {
        id: data.id.toString(),
        name: data.name,
        description: data.description,
        website_url: data.website_url,
        image: visual.image,
        logo: visual.logo,
        links: data.website_url
          ? [{ name: "Site officiel", url: data.website_url }]
          : [],
      };

      setSelectedJournal(enrichedJournal);
    } catch (err) {
      console.error("Erreur lors du chargement du journal :", err);
      setError("Impossible de charger les détails du journal.");
    }
  };

  return (
    <div className="min-h-screen font-sans flex">
      <Sidebar
        journal={
          selectedJournal
            ? {
                id: selectedJournal.id,
                name: selectedJournal.name,
                roles: [],
                links: selectedJournal.links ?? [],
              }
            : null
        }
        mode="public"
        className="sticky top-0 h-screen overflow-y-auto"
      />
      <div className="flex flex-col flex-1">
        <Navbar journal={selectedJournal} />
        <main className="flex-1 flex flex-col items-center justify-start px-8 sm:px-20 py-10">
          <h1 className="text-3xl font-bold text-gray-800 pb-6 text-center">
            Bienvenue sur Publigate
          </h1>

          <p className="mb-6 max-w-xl text-center">
            L’accès à la soumission d’article nécessite un compte Publigate. Si
            vous n’en avez pas encore, vous pourrez le créer après avoir cliqué
            sur “Entrer dans l’espace du journal”.
          </p>

          <div className="w-full max-w-2xl mb-10">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Choisissez un journal :
            </label>
            <select
              className="w-full h-12 text-lg border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7c0b2b]"
              onChange={(e) => handleSelect(e.target.value)}
              value={selectedJournal?.id ?? ""}
              disabled={loading || error !== null}
            >
              <option value="">— Sélectionnez —</option>
              {loading && <option disabled>Chargement...</option>}
              {error && <option disabled>{error}</option>}
              {journals.map((journal) => (
                <option key={journal.id} value={journal.id}>
                  {journal.name}
                </option>
              ))}
            </select>
          </div>

          {selectedJournal && (
            <div className="text-center mt-2 transition-all duration-300 ease-in-out max-w-xl">
              <p className="text-gray-700 mb-2">
                <strong>{selectedJournal.name}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {selectedJournal.description}
              </p>

              {/* <JournalLinks links={selectedJournal.links ?? []} /> */}

              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "selectedJournal",
                    JSON.stringify(selectedJournal)
                  );
                  router.push(`/login/${selectedJournal.id}`);
                }}
                className="bg-[#7c0b2b] mt-6 inline-block px-6 py-3 text-white rounded hover:bg-[#450920] transition"
              >
                Entrer dans l’espace du journal
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
