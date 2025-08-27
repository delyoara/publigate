import React from "react";
import { useRouter } from "next/navigation";

type Journal = {
  journal_id: number;
  journal_name: string;
  role: string;
  hasUrgentTask?: boolean;
};

type Props = {
  journals: Journal[];
  currentJournalId: number;
};

export default function SidebarJournalList({ journals, currentJournalId }: Props) {
  const router = useRouter();

  return (
    <aside className="bg-gray-100 p-4 w-64 border-l border-gray-300">
      <h3 className="text-lg font-semibold mb-4">Autres revues</h3>
      <ul className="space-y-2">
        {journals
          .filter(j => j.journal_id !== currentJournalId)
          .map(j => (
            <li
              key={j.journal_id}
              className="flex justify-between items-center cursor-pointer hover:text-blue-600"
              onClick={() => router.push(`/dashboard/${j.journal_id}`)}
            >
              <span>
                {j.journal_name} <span className="text-sm text-gray-500">({j.role})</span>
              </span>
              {j.hasUrgentTask && (
                <span className="w-3 h-3 bg-red-500 rounded-full inline-block" />
              )}
            </li>
          ))}
      </ul>
    </aside>
  );
}
