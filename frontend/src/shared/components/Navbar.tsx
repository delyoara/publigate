"use client";

type NavbarProps = {
  journal: {
    id: string;
    name: string;
    image?: string;
  } | null;
};

export default function Navbar({ journal }: NavbarProps) {
  if (!journal) {
    return (
      <nav className="p-4 bg-white shadow text-center">
        Sélectionnez un journal
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow">
      {journal.image && (
        <img
          src={journal.image}
          alt={`Image de ${journal.name}`}
          className="w-full h-40 object-cover filter brightness-75"
        />
      )}
    </nav>
  );
}
