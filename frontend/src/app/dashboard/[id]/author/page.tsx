"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

type AuthorUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  affiliation?: string;
  discipline?: string;
  journals?: {
    journal_id: number;
    journal_name: string;
    role: string;
  }[];
};

export default function AuthorDashboardPage() {
  const { user, logout } = useAuth() as {
    user: AuthorUser | null;
    logout: () => void;
  };

  const params = useParams();
  const router = useRouter();
  const journalId = Number(params.id);

  const currentJournal = user?.journals?.find(
    (j) => j.journal_id === journalId
  );

  const [title, setTitle] = useState("");
  const [abstractFr, setAbstractFr] = useState("");
  const [abstractEn, setAbstractEn] = useState("");
  const [keywords, setKeywords] = useState("");
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [affiliation, setAffiliation] = useState(user?.affiliation ?? "");
  const [discipline, setDiscipline] = useState(user?.discipline ?? "");

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
      
console.log("user:", user);

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
      <nav className="flex justify-between items-center bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl text-red-800">Publigate</span>
          {currentJournal && (
            <button
              onClick={() =>
                router.push(`/dashboard/${currentJournal.journal_id}`)
              }
              className="text-lg font-semibold text-gray-800 transition-transform hover:scale-105"
            >
              {currentJournal.journal_name}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-1 text-ml text-gray-800 transition-transform hover:scale-105"
          >
            <User className="w-4 h-4" />
            Mon profil
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-ml text-red-700 transition-transform hover:scale-105"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Soumettre un article</h1>

        {user && (
          <div className="bg-gray-100 p-6 rounded border mb-6 space-y-6">
            <h2 className="text-lg font-semibold mb-4">
              Informations personnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Prénom</label>
                <input
                  type="text"
                  value={user.first_name}
                  className="w-full border rounded px-3 py-2"
                  disabled
                />
              </div>

              <div>
                <label className="block font-medium">Nom</label>
                <input
                  type="text"
                  value={user.last_name}
                  className="w-full border rounded px-3 py-2"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                value={user.email}
                className="w-full border rounded px-3 py-2"
                disabled
              />
            </div>

            <div>
              <label className="block font-medium">Affiliation</label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Discipline</label>
              <input
                type="text"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        )}

        <div className="bg-gray-100 p-6 rounded border mb-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">
            Informations sur l’article
          </h2>

          <div>
            <label className="block font-medium">Titre</label>
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
        </div>

     
        {error && <p className="mb-4 text-red-600">{error}</p>}

        {/* Encadré 3 : Fichiers et soumission */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 rounded border space-y-6"
        >
          <div className="space-y-4">
            {/* Fichier PDF de l’article */}
            <div>
              <label className="block font-medium">
                Fichier PDF de l’article
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setArticleFile(e.target.files?.[0] || null)}
                  className={`w-full border rounded px-3 py-2 ${
                    articleFile ? "text-gray-800" : ""
                  }`}
                />
                {articleFile && (
                  <button
                    type="button"
                    onClick={() => setArticleFile(null)}
                    className="text-sm text-red-600 underline"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>

            {/* Lettre de non-soumission */}
            <div>
              <label className="block font-medium">
                Lettre de non-soumission auprès d’une autre revue (PDF)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setLetterFile(e.target.files?.[0] || null)}
                  className={`w-full border rounded px-3 py-2 ${
                    letterFile ? "text-gray-800" : ""
                  }`}
                />
                {letterFile && (
                  <button
                    type="button"
                    onClick={() => setLetterFile(null)}
                    className="text-sm text-red-600 underline"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-800 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Soumettre"}
          </button>

          {success && (
            <p className="mt-4 text-green-600 font-medium">
              Article soumis avec succès !
            </p>
          )}
          {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
        </form>
      </main>
    </div>
  );
}
