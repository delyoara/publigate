export const roleAssets: Record<string, {
  label: string;
  icon: string;
  bg: string;
}> = {
  "editor": {
    label: "Éditeur",
    icon: "/icons/editor.svg",
    bg: "bg-blue-50"
  },
  "auteur": {
    label: "Auteur",
    icon: "/icons/writer.svg",
    bg: "bg-yellow-50"
  },
  "reviewer": {
    label: "Relecteur",
    icon: "/icons/reviewer.svg",
    bg: "bg-green-50"
  },
  "reader": {
    label: "Lecteur",
    icon: "/icons/reader.svg",
    bg: "bg-gray-100"
  }
};
