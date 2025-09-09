"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserForm, { FormData } from "@/features/auth/components/UserForm";
import Sidebar from "@/shared/components/Sidebar";
import { FetchRegister } from "../../../features/auth/services/FetchRegister";

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

export default function RegisterPage() {
  const params = useParams() as { journalId?: string };
  const journalId = params.journalId;
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [journalName, setJournalName] = useState<string>("");
  const [journal, setJournal] = useState<Journal | null>(null);

  useEffect(() => {
    if (!journalId) {
      setError("Identifiant de journal manquant dans l'URL.");
      return;
    }

    const stored = sessionStorage.getItem("selectedJournal");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.id === journalId) {
        setJournal(parsed);
        setJournalName(parsed.name);
      } else {
        setError("Le journal sélectionné ne correspond pas à l'URL.");
      }
    } else {
      setError("Aucune donnée de journal trouvée.");
    }
  }, [journalId]);

  async function handleFormSubmit(data: FormData) {
    if (data.password !== data.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!journalId) {
      setError("Impossible d'inscrire sans identifiant de journal.");
      return;
    }

    const { success, result } = await FetchRegister(data, journalId);
    console.log("Résultat FetchRegister :", result);

    if (success && result?.user?.id) {
      router.push(`/dashboard/${journalId}`);
    } else {
      setError(result?.message || "Erreur lors de l'inscription.");
    }
  }

  return (
    <div className="min-h-screen font-sans flex">
      <Sidebar
        journal={
          journal
            ? {
                id: journal.id,
                name: journal.name,
                roles: [],
                links: journal.links ?? [],
              }
            : null
        }
        mode="public"
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-1">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Inscription à {journalName || "la revue"}
          </h2>

          <UserForm mode="register" onSubmit={handleFormSubmit} error={error} />
        </div>
      </div>
    </div>
  );
}
