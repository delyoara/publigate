"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const REVUES = [
  {
    id: "revue-SSS",
    nom: "Sciences Sociales et Santé",
    image: "/SSS.webp",
  },
  {
    id: "revue-socio",
    nom: "Revue de Sociologie",
    image: "/socio.webp",
  }
];

export default function LoginPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const revue = useMemo(() => REVUES.find(r => r.id === id), [id]);

  const [modeInscription, setModeInscription] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!revue) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <p className="text-gray-500">Revue introuvable 😕</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-wrap bg-white font-sans">
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6">
          <a href="/" className="block w-32">
            <img src="/logo.png" alt="Logo Publigate" className="w-full h-auto object-contain" />
          </a>
          <span className="font-semibold text-gray-800 text-2xl">{revue.nom}</span>
        </div>

        <div className="flex flex-col justify-center my-auto px-8 md:px-24 lg:px-32 w-full pt-10">
          <p className="text-center text-2xl mb-6 text-gray-700 font-semibold">
            {modeInscription ? "Créez votre compte" : "Connectez-vous à votre compte"}
          </p>

          <form className="flex flex-col space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="text-sm text-gray-600">Email</label>
              <input type="email" id="email" className="border rounded w-full py-2 px-3 mt-1" />
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-gray-600">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="border rounded w-full py-2 px-3 mt-1 pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1 text-sm text-blue-600 hover:underline"
                >
                  {showPassword ? "Cacher" : "Voir"}
                </button>
              </div>
            </div>

            {modeInscription && (
              <div>
                <label htmlFor="confirm-password" className="text-sm text-gray-600">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="confirm-password"
                    className="border rounded w-full py-2 px-3 mt-1 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-1 text-sm text-blue-600 hover:underline"
                  >
                    {showConfirm ? "Cacher" : "Voir"}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-[#7c0b2b] text-white py-2 mt-4 rounded hover:bg-[#530a1f] transition font-semibold"
            >
              {modeInscription ? "Créer le compte" : "Se connecter"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            {modeInscription ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button
              onClick={() => setModeInscription(!modeInscription)}
              className="text-blue-600 hover:underline font-medium"
            >
              {modeInscription ? "Se connecter" : "Créer un compte"}
            </button>
          </p>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-1/2">
        <img
          src="/unite_behind_the_science.jpg"
          alt="Illustration"
          className="object-cover w-full h-screen"
        />
      </div>
    </div>
  );
}
