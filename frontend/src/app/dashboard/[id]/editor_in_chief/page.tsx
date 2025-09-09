"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RoleNavbar from "@/features/users/components/RoleNavbar";

type Article = {
  id: number;
  title: string;
  author: string;
  status: string;
};

export default function EditorInChiefPage() {

  const params = useParams() as { id?: string };
  console.log("Params:", params);
  const journalId = params.id;
  console.log(journalId)

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!journalId) return;

    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/journals/${journalId}/editor_in_chief/`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        setArticles(data);
      } catch (error) {
        console.error("Erreur chargement articles :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [journalId]);

  const groupByStatus = (status: string) =>
    articles.filter((article) => article.status === status);

  if (!journalId) {
    return <p className="p-8 text-red-800">Journal introuvable dans l’URL.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleNavbar role="editor-in-chief" journal={journalId} />

      <main className="p-8">
        <h1 className="text-3xl font-bold text-sky-800 mb-6">
          Tableau de bord — Rédacteur en chef
        </h1>

        {loading ? (
          <p>Chargement des articles...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Articles reçus" items={groupByStatus("reçu")} />
            <Section title="En lecture..." items={groupByStatus("lecture")} />
            <Section title="En correction" items={groupByStatus("correction")} />
            <Section title="Acceptés" items={groupByStatus("accepté")} />
            <Section title="En production" items={groupByStatus("production")} />
            <Section title="Publiés" items={groupByStatus("publié")} />
            <Section title="En attente" items={groupByStatus("attente")} />
            <Section title="Refusés" items={groupByStatus("refusé")} />
          </div>
        )}
      </main>
    </div>
  );
}

function Section({ title, items }: { title: string; items: Article[] }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun article.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((article) => (
            <li key={article.id} className="border-b pb-2">
              <strong>{article.title}</strong> — {article.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
