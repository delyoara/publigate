"use client";

import React from "react";
import RoleCard from "@/features/users/components/RoleCard";

type Props = {
  journalName: string;
  roles: string[];
  onSelectRole?: (role: string) => void;
};

export default function JournalRoles({ journalName, roles, onSelectRole }: Props) {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold uppercase text-center mb-6">{journalName}</h2>
      <h3 className="text-xl text-center font-semibold mb-4">Rôles</h3>
      <div className="border-t border-dashed border-gray-400 pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <RoleCard key={index} role={role} onClick={() => onSelectRole?.(role)} />
        ))}
      </div>
    </section>
  );
}
