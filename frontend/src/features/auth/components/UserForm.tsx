"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export type UserProfileData = {
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
  initialData?: Partial<UserProfileData>;
  mode: "register" | "edit";
  onSubmit: (data: UserProfileData) => void;
  error?: string;
};

export default function UserForm({ initialData = {}, mode, onSubmit, error }: Props) {
  const [userRegistrationData, setUserRegistrationData] = useState<UserProfileData>({
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
    setUserRegistrationData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (mode === "register" && userRegistrationData.password !== userRegistrationData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    onSubmit(userRegistrationData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="last_name" placeholder="Nom" value={userRegistrationData.last_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="first_name" placeholder="Prénom" value={userRegistrationData.first_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="username" placeholder="Nom d'utilisateur" value={userRegistrationData.username} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="email" name="email" placeholder="Adresse e-mail" value={userRegistrationData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="discipline" placeholder="Discipline (ex: sociologie, anthropologie...)" value={userRegistrationData.discipline} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="research_themes" placeholder="Thèmes de recherche" value={userRegistrationData.research_themes} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="institution" placeholder="Institution" value={userRegistrationData.institution} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="affiliation" placeholder="Affiliation" value={userRegistrationData.affiliation} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="address" placeholder="Adresse" value={userRegistrationData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="city" placeholder="Ville" value={userRegistrationData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="zipcode" placeholder="Code postal" value={userRegistrationData.zipcode} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
      <input type="text" name="country" placeholder="Pays" value={userRegistrationData.country} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />

      {mode === "register" && (
        <>
          <input type="password" name="password" placeholder="Mot de passe" value={userRegistrationData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" value={userRegistrationData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
        {mode === "register" ? "S'inscrire comme auteur" : "Mettre à jour mes informations"}
      </button>
    </form>
  );
}
