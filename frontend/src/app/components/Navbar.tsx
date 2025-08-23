"use client";

const ROLES_PAR_DEFAUT = ["auteur", "rédacteur en chef", "relecteur", "editeur", "admin_revue"] as const;
type RoleStandard = typeof ROLES_PAR_DEFAUT[number]; 
type Role = RoleStandard | string;

type SelectedRevue = {
  id: string;
  nom: string;
  image?: string;
};

type NavbarProps = {
  revue: SelectedRevue | null;
};

export default function Navbar({ revue }: NavbarProps) {
  if (!revue) return <nav className="p-4 bg-white shadow text-center">Sélectionnez une revue</nav>;

  return (
    <nav className=" bg-white shadow flex flex-wrap gap-6 text-gray-700">
      <img 
      src={revue.image}
      alt={'Image de ${revue.nom}'}
      className="w-full h-42 filter brightness-75"
      />
    {/* <nav className="p-2 bg-white shadow text-center border-b border-gray-200"></nav> */}
    </nav>
  );
}
