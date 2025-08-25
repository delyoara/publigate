"use client";

const DEFAULT_ROLES = [
  "author",
  "editor_in_chief",
  "reviewer",
  "editor",
  "journal_admin",
] as const;

type DefaultRole = (typeof DEFAULT_ROLES)[number];
type Role = DefaultRole | string;

type LinkItem = { name: string; url: string };

type SelectedJournal = {
  id: string;
  name: string;
  roles: Role[];
  links?: LinkItem[];
};

type SidebarProps = {
  journal: SelectedJournal | null;
  mode?: "public" | "private";
};

export default function Sidebar({ journal, mode = "private" }: SidebarProps) {
  return (
    <nav className="bg-gradient-to-t from-[#450920] via-[#540b0e] to-[#8f2d56] h-screen w-48 text-white p-4 flex flex-col justify-between">
      {/* Publigate logo */}
      <div>
        <a href="/" className="block mb-6">
          <img
            src="/logo.png"
            alt="Logo Publigate"
            className="w-48 h-auto object-contain"
          />
        </a>

        {/* Platform view (no journal selected) */}
        {!journal ? (
          <div className="text-sm text-center opacity-80">
            <p className="mb-2">Bienvenue sur Publigate</p>
            <p>Sélectionnez un journal pour accéder aux fonctionnalités</p>
          </div>
        ) : (
          <>
            {/* Journal name */}
            <div className="text-xl font-bold text-center py-6">{journal.name}</div>

            {/* Public links */}
            {mode === "public" && journal.links?.length ? (
              <ul className="space-y-2">
                {journal.links.map((item) => (
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
              // Private links based on roles
              <ul className="space-y-2">
                {journal.roles.map((role) => {
                  switch (role) {
                    case "author":
                      return (
                        <li key={role}>
                          <a
                            href={`/journals/${journal.id}/link`}
                            className="inline-block hover:scale-105 transition-transform duration-200 ease-in-out"
                          >
                            ✍️ Espace auteur
                          </a>
                        </li>
                      );
                    case "reviewer":
                      return (
                        <li key={role}>
                          <a
                            href={`/journals/${journal.id}/reviewer`}
                            className="inline-block hover:scale-105 transition-transform duration-200 ease-in-out"
                          >
                            📄 Relecteur
                          </a>
                        </li>
                      );
                    case "editor":
                      return (
                        <li key={role}>
                          <a
                            href={`/journals/${journal.id}/editor`}
                            className="inline-block hover:scale-105 transition-transform duration-200 ease-in-out"
                          >
                            📚 Comité éditorial
                          </a>
                        </li>
                      );
                    case "journal_admin":
                      return (
                        <li key={role}>
                          <a
                            href={`/journals/${journal.id}/admin`}
                            className="inline-block hover:scale-105 transition-transform duration-200 ease-in-out"
                          >
                            ⚙️ Administration
                          </a>
                        </li>
                      );
                    default:
                      return (
                        <li key={role}>
                          <a
                            href={`/journals/${journal.id}/${role}`}
                            className="inline-block hover:scale-105 transition-transform duration-200 ease-in-out"
                          >
                            🔧 {role}
                          </a>
                        </li>
                      );
                  }
                })}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-center text-white opacity-60 px-2 pt-8 space-y-2">
        {!journal && (
          <>
            <a href="/support" className="hover:underline block">
              ⚠️ Signaler un problème
            </a>
            <a href="/admin" className="hover:underline block">
              🔐 Admin Publigate
            </a>
          </>
        )}
        <p>© {new Date().getFullYear()} Publigate</p>
        <p>Tous droits réservés.</p>
      </div>
    </nav>
  );
}
