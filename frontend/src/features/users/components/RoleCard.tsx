import { roleAssets } from "./RoleAssets";

type Props = {
  role: string;
  icon?: string;
  image?: string;
  bgColor?: string;
};

export default function RoleCard({ role }: Props) {
  const asset = roleAssets[role.toLowerCase()] || {
    label: role,
    icon: "/icons/default.svg",
    bg: "bg-gray-100"
  };

  return (
    <div className="p-2">
      <div className={`w-32 h-32 mx-auto flex flex-col items-center justify-center rounded-lg shadow-md ${asset.bg}`}>
        <img src={asset.icon} alt={asset.label} className="w-14 h-14 mb-2 object-contain" />
        <h3 className="text-sm font-semibold uppercase text-center">{asset.label}</h3>
      </div>
    </div>
  );
}
