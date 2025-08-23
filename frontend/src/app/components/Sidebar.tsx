"use client";

const ROLES_PAR_DEFAUT = [
  "auteur",
  "rédacteur en chef",
  "relecteur",
  "editeur",
  "admin_revue",
] as const;
type RoleStandard = (typeof ROLES_PAR_DEFAUT)[number];
type Role = RoleStandard | string;
type LinkItem = { name: string; url: string };

type SelectedRevue = {
  id: string;
  nom: string;
  roles: Role[];
  link?: LinkItem[];
};

type SidebarProps = {
  revue: SelectedRevue | null;
  mode?: "public" | "private";
};

export default function Sidebar({ revue, mode = "private" }: SidebarProps) {
  if (!revue) {
    return (
      <nav className="p-4 bg-white shadow text-center">
        Sélectionnez une revue
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-t from-[#450920] via-[#540b0e] to-[#8f2d56] h-screen w-48 text-white p-4 flex flex-col gap-4">
      {/* LOGO PUBLIGATE */}
      <a href="/" className="block">
        <img
          src="/logo.png"
          alt="Logo Publigate"
          className="w-56 h-38 object-contain mb-2"
        />
      </a>

      {/* NOM DE LA REVUE */}
      <div className="text-xl font-bold text-center py-8">{revue.nom}</div>

      {/* LIENS PUBLICS OU PRIVÉS */}
      {mode === "public" && revue.link?.length ? (
        <ul className="space-y-2">
          {revue.link.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                className="inline-block font-bold hover:scale-105 transition-transform duration-200 ease-in-out"
              >
                🔗 {item.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {revue.roles.includes("auteur") && (
            <a
              className="inline-block hover:scale-105 transition-transform duration-200 ease-in-out"
              href={`/revues/${revue.id}/link`}
            >
              ✍️ Espace auteur
            </a>
          )}
          {revue.roles.includes("relecteur") && (
            <a
              className="inline-block hover:scale-105 transition-transform duration-200 ease-in-out"
              href={`/revues/${revue.id}/relecteur`}
            >
              📄 Relecteur
            </a>
          )}
          {revue.roles.includes("editeur") && (
            <a
              className="inline-block hover:scale-105 transition-transform duration-200 ease-in-out"
              href={`/revues/${revue.id}/editeur`}
            >
              📚 Comité éditorial
            </a>
          )}
          {revue.roles.includes("admin_revue") && (
            <a
              className="inline-block hover:scale-105 transition-transform duration-200 ease-in-out"
              href={`/revues/${revue.id}/admin`}
            >
              ⚙️ Administration
            </a>
          )}
        </>
      )}
      <div className="mt-auto text-xs text-center text-white opacity-60 px-2 pt-8">
        © {new Date().getFullYear()} {`Publigate`}.<br />
        Tous droits réservés.
      </div>
    </nav>
  );
}
