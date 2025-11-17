'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { AdminPanelSection } from './AdminPanelSection';
import { useAdminData } from '../../../../providers/AdminDataProvider';
import { useState } from 'react';

export function CoachesPanel() {
  const { coaches, selectedCoach, selectCoach, deleteCoach, setModal } = useAdminData();

  // Local search state (ONLY inside this panel)
  const [search, setSearch] = useState('');

  const filtered = coaches.filter((c) => {
    const s = search.toLowerCase();
    return c.coach_name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s);
  });

  return (
    <AdminPanelSection
      title="Coaches"
      subtitle="Manage all active coaches"
      helpText="Select a coach to view their fellows"
      onAction={() => setModal({ type: 'add-coach' })}
      actionLabel="Add Coach"
    >
      {/* Search */}
      <input
        type="text"
        placeholder="Search coaches..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
      />

      {/* Empty State */}
      {filtered.length === 0 ? (
        <p className="py-4 text-center text-slate-500">No matching coaches</p>
      ) : (
        filtered.map((coach) => (
          <div
            key={coach.id}
            onClick={() => selectCoach(coach)}
            className={`flex cursor-pointer justify-between rounded-lg border p-3 transition ${
              selectedCoach?.id === coach.id
                ? 'border-[#005a6a] bg-[#e8f5f7]'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            {/* Left Side */}
            <div>
              <p className="text-sm font-semibold">{coach.coach_name}</p>
              <p className="text-xs text-slate-500">{coach.email}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              {/* EDIT */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModal({ type: 'edit-coach', coach });
                }}
                className="rounded p-1.5 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4 text-blue-600" />
              </button>

              {/* DELETE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCoach(coach.id);
                }}
                className="rounded p-1.5 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        ))
      )}
    </AdminPanelSection>
  );
}
