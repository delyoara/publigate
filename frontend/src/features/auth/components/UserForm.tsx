"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export type FormData = {
    last_name: string;
    first_name: string;
    username: string;
    email: string;
    password?: string;
    discipline: string;
    research_themes: string;
    confirmPassword?: string;
    institution: string;
    affiliation: string;
    address: string;
    city: string;
    zipcode: string;
    country: string;
};

type Props = {
  initialData?: Partial<FormData>;
  mode: "register" | "edit";
  onSubmit: (data: FormData) => void;
  error?: string;
};

export default function UserForm({ initialData = {}, mode, onSubmit, error }: Props) {
  const [formData, setFormData] = useState<FormData>({
    username: initialData.username || "",
    last_name: initialData.last_name || "",
    first_name: initialData.first_name || "",
    email: initialData.email || "",
    password: "",
    confirmPassword: "",
    affiliation: initialData.affiliation || "",
    research_themes: initialData.research_themes || "",
    institution: initialData.institution || "",
    discipline: initialData.discipline || "",
    address: initialData.address || "",
    city: initialData.city || "",
    zipcode: initialData.zipcode || "",
    country: initialData.country || "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="last_name" placeholder="Nom" value={formData.last_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="first_name" placeholder="Prénom" value={formData.first_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="email" name="email" placeholder="Adresse e-mail" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="discipline" placeholder="Discipline (ex: sociologie, anthropologie...)" value={formData.discipline} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="research_themes" placeholder="Thèmes de recherche" value={formData.research_themes} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="institution" placeholder="Institution" value={formData.institution} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="affiliation" placeholder="Affiliation" value={formData.affiliation} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="city" placeholder="Ville" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="zipcode" placeholder="Code postal" value={formData.zipcode} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="country" placeholder="Pays" value={formData.country} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />

      {mode === "register" && (
        <>
          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
        {mode === "register" ? "S'inscrire comme auteur" : "Mettre à jour mes informations"}
      </button>
    </form>
  );
}
