"use client";

import React from "react";
import { roleAssets } from "./RoleAssets";

type Props = {
  role: string;
  onClick?: () => void;
};

export default function RoleCard({ role, onClick }: Props) {
  const asset = roleAssets[role.toLowerCase()] || {
    label: role,
    icon: "/icons/default.svg",
    bg: "bg-gray-100"
  };

  return (
    <div className="p-2">
      <div
        onClick={onClick}
        className={`w-32 h-32 mx-auto flex flex-col items-center justify-center rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform ${asset.bg}`}
      >
        <img
          src={asset.icon}
          alt={asset.label}
          className="w-14 h-14 mb-2 object-contain"
        />
        <h3 className="text-sm font-semibold uppercase text-center">{asset.label}</h3>
      </div>
    </div>
  );
}
