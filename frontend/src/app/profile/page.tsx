"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Section = "editPersonal" | "editProfessional" | "editPassword";

type UserProfile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  discipline?: string;
  institution?: string;
  affiliation?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  research_themes?: string;
};

const defaultProfile: UserProfile = {
  id: 0,
  email: "",
  first_name: "",
  last_name: "",
  username: "",
  discipline: "",
  institution: "",
  affiliation: "",
  address: "",
  city: "",
  zipcode: "",
  country: "",
  research_themes: "",
};


export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>(defaultProfile);
  const [activeSection, setActiveSection] = useState<Section>("editPersonal");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/me/", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erreur chargement profil");
        const data: UserProfile = await res.json();
        
        setUser(data);
        setFormData({ ...defaultProfile, ...data });
      } catch (error) {
        console.error("Erreur profil :", error);
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/me/", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur mise à jour");
      const updated = await res.json();
      setUser(updated);
      setFormData(updated);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
      alert("Échec de la mise à jour.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const oldPassword = (form.elements.namedItem("oldPassword") as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem("newPassword") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/change-password/", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      if (!res.ok) throw new Error("Erreur lors du changement de mot de passe");
      alert("Mot de passe mis à jour avec succès !");
      setActiveSection("editPersonal");
    } catch (error) {
      console.error("Erreur mot de passe :", error);
      alert("Échec du changement de mot de passe.");
    }
  };

  const handleLogout = async () => {
  try {
    await fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    });
    router.push("http://localhost:3000");
  } catch (error) {
    console.error("Erreur déconnexion :", error);
    alert("Échec de la déconnexion.");
  }
};

  if (!user || !formData) return <p className="p-8">Chargement du profil...</p>;

  return (
    <div className="min-h-screen flex font-sans">
      {/* Sidebar bleue */}
      <aside className="w-64 bg-blue-100 p-6 shadow-md">
        <h2 className="text-xl font-bold mb-6">Bonjour, {user.first_name}</h2>
        <nav className="flex flex-col gap-4">
          <button onClick={() => setActiveSection("editPersonal")} className="text-left hover:underline">
            Modifier infos personnelles
          </button>

          <button onClick={() => setActiveSection("editProfessional")} className="text-left hover:underline">
            Modifier infos professionnelles
          </button>

          <button onClick={() => setActiveSection("editPassword")} className="text-left hover:underline">
            Modifier mot de passe
          </button>

           <button onClick={handleLogout}
              className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
            >
              Déconnexion
            </button>

        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8 bg-gray-50">
        {activeSection === "editPersonal" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Modifier mes infos personnelles</h1>
            <div className="grid grid-cols-2 gap-4 max-w-3xl">
              <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Prénom" className="border p-2 rounded" />
              <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Nom" className="border p-2 rounded" />
              <input name="username" value={formData.username ?? ""} onChange={handleChange} placeholder="Nom d’utilisateur" className="border p-2 rounded" />
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
              <div className="col-span-2 flex gap-4 mt-4">
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"> Enregistrer</button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "editProfessional" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Modifier mes infos professionnelles</h1>
            <div className="grid grid-cols-2 gap-4 max-w-3xl">
              <input name="discipline" value={formData.discipline || ""} onChange={handleChange} placeholder="Discipline" className="border p-2 rounded" />
              <input name="institution" value={formData.institution || ""} onChange={handleChange} placeholder="Institution" className="border p-2 rounded" />
              <input name="affiliation" value={formData.affiliation || ""} onChange={handleChange} placeholder="Affiliation" className="border p-2 rounded" />
              <input name="address" value={formData.address || ""} onChange={handleChange} placeholder="Adresse" className="border p-2 rounded" />
              <input name="city" value={formData.city || ""} onChange={handleChange} placeholder="Ville" className="border p-2 rounded" />
              <input name="zipcode" value={formData.zipcode || ""} onChange={handleChange} placeholder="Code postal" className="border p-2 rounded" />
              <input name="country" value={formData.country || ""} onChange={handleChange} placeholder="Pays" className="border p-2 rounded" />
              <textarea name="research_themes" value={formData.research_themes || ""} onChange={handleChange} placeholder="Thèmes de recherche" className="border p-2 rounded col-span-2" />
              <div className="col-span-2 flex gap-4 mt-4">
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"> Enregistrer</button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "editPassword" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Modifier mon mot de passe</h1>
            <form onSubmit={handlePasswordChange} className="grid grid-cols-1 gap-4 max-w-md">
              <input name="oldPassword" type="password" placeholder="Ancien mot de passe" className="border p-2 rounded" required />
              <input name="newPassword" type="password" placeholder="Nouveau mot de passe" className="border p-2 rounded" required />
              <input name="confirmPassword" type="password" placeholder="Confirmer le nouveau mot de passe" className="border p-2 rounded" required />
              <div className="flex gap-4 mt-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"> Enregistrer</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
