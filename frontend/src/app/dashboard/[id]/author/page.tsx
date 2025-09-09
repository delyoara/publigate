"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function AuthorDashboardPage() {
  const { user, logout } = useAuth();
  const params = useParams();
  const router = useRouter();
  const journalId = Number(params.id);

  const currentJournal = user?.journals?.find(
    (j) => j.journal_id === journalId
  );

  // Champs du formulaire
  const [title, setTitle] = useState("");
  const [abstractFr, setAbstractFr] = useState("");
  const [abstractEn, setAbstractEn] = useState("");
  const [keywords, setKeywords] = useState("");
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    });
    logout();
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("abstract_fr", abstractFr);
      formData.append("abstract_en", abstractEn);
      formData.append("keywords", keywords);
      if (articleFile) formData.append("article_pdf", articleFile);
      if (letterFile) formData.append("letter_pdf", letterFile);

      const res = await fetch(
        `http://localhost:8000/api/journals/${journalId}/submissions/`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }

      setSuccess(true);
      setTitle("");
      setAbstractFr("");
      setAbstractEn("");
      setKeywords("");
      setArticleFile(null);
      setLetterFile(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre du haut */}
      <nav className="flex justify-between items-center bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl text-red-800">Publigate</span>
          {currentJournal && (
            <span className="text-lg font-medium text-gray-700">
              {currentJournal.journal_name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-1 text-sm text-gray-700 hover:underline"
          >
            <User className="w-4 h-4" />
            Mon profil
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-red-700 hover:underline"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Soumettre un article</h1>

        {success && (
          <p className="mb-4 text-green-600">
            Article soumis avec succès !
          </p>
        )}
        {error && (
          <p className="mb-4 text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block font-medium">Titre de l’article</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Résumé (français)</label>
            <textarea
              value={abstractFr}
              onChange={(e) => setAbstractFr(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Résumé (anglais)</label>
            <textarea
              value={abstractEn}
              onChange={(e) => setAbstractEn(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Mots-clés</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="séparés par des virgules"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Fichier PDF de l’article</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setArticleFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">
              Lettre de non-soumission (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setLetterFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-800 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Soumettre"}
          </button>
        </form>
      </main>
    </div>
  );
}
