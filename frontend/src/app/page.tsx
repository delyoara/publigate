"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const ROLES_PAR_DEFAUT = [
  "auteur", "rédacteur en chef", "relecteur", "editeur", "admin_revue"
] as const;

type RoleStandard = (typeof ROLES_PAR_DEFAUT)[number];
type Role = RoleStandard | string;

type Revue = {
  id: string;
  nom: string;
  roles: Role[];
  image?: string;
  description?: string;
  link?: { name: string; url: string }[];
  logo?: string;
};

export default function Home() {
  const router = useRouter();

  const revues: Revue[] = [
    {
      id: "revue-SSS",
      nom: "Sciences Sociales et Santé",
      roles: ["auteur", "editeur"],
      image: "/SSS.webp",
      description:
        "Sciences Sociales et Santé est une revue trimestrielle qui établit un dialogue interdisciplinaire à partir de données originales.",
      logo: "/SSS.svg",
      link: [
        {
          name: "Espace auteur",
          url: "https://www.jle.com/fr/revues/sss/espace_auteur"
        },
        {
          name: "Comité de rédaction",
          url: "https://www.jle.com/fr/revues/sss/comite"
        },
        {
          name: "Contact",
          url: "/revues/revue-SSS/contact"
        }
      ]
    },
    {
      id: "revue-socio",
      nom: "Revue de Sociologie",
      roles: ["relecteur"],
      image: "/socio.webp",
      description:
        "La Revue de Sociologie publie des travaux contemporains sur les dynamiques sociales en France et à l'international.",
      logo: "/socio.svg",
      link: [
        {
          name: "Espace auteur",
          url: "https://www.jle.com/fr/revues/socio/espace_auteur"
        },
        {
          name: "Comité de rédaction",
          url: "/revues/revue-socio/articles"
        },
        {
          name: "Contact",
          url: "/revues/revue-socio/contact"
        }
      ]
    }
  ];

  const [selectedRevue, setSelectedRevue] = useState<Revue | null>(revues[0]);

  return (
    <div className="min-h-screen font-sans flex">
      <Sidebar revue={selectedRevue} mode="public" />
      <div className="flex flex-col flex-1">
        <Navbar revue={selectedRevue} />
        <main className="flex-1 flex items-center justify-center px-8 sm:px-20 py-10">
          <div className="max-w-xl w-full">
            <h1 className="text-3xl text-center font-bold text-gray-800 pb-11">
              Bienvenue sur Publigate
            </h1>

            <div className="flex flex-col items-center gap-4 pb-11">
              <label className="text-sm text-gray-600">Choisissez une revue :</label>
              <select
                className="border px-4 py-2 rounded"
                value={selectedRevue?.id ?? ""}
                onChange={(e) =>
                  setSelectedRevue(revues.find(r => r.id === e.target.value) ?? null)
                }
              >
                {revues.map((revue) => (
                  <option key={revue.id} value={revue.id}>
                    {revue.nom}
                  </option>
                ))}
              </select>
            </div>

            {selectedRevue && (
              <div className="text-center mt-2">
                <p className="text-gray-700 mb-4">
                  Vous êtes connecté·e à la revue :{" "}
                  <strong>{selectedRevue.nom}</strong>.
                </p>
                <p className="text-sm text-gray-600">{selectedRevue.description}</p>

                <button
                  onClick={() => router.push(`/login/${selectedRevue.id}`)}
                  className="bg-[#7c0b2b] mt-6 inline-block px-6 py-3 text-white rounded hover:bg-[#450920] transition"
                >
                  Entrer dans l’espace de la revue
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
