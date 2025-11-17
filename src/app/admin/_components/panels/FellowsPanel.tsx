'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { AdminPanelSection } from './AdminPanelSection';
import { useAdminData } from '../../../../providers/AdminDataProvider';

export function FellowsPanel() {
  const { selectedCoach, fellows, selectedFellow, selectFellow, deleteFellow, setModal } =
    useAdminData();

  return (
    <AdminPanelSection
      title="Fellows"
      subtitle={
        selectedCoach
          ? `Fellows under ${selectedCoach.coach_name}`
          : 'Select a coach to view fellows'
      }
      helpText="Select a fellow to view their learners"
      onAction={
        selectedCoach
          ? () => setModal({ type: 'add-fellow', coachId: selectedCoach.id })
          : undefined
      }
      actionLabel="Add Fellow"
    >
      {!selectedCoach ? (
        <p className="py-4 text-center text-slate-500">Select a coach first</p>
      ) : fellows.length === 0 ? (
        <p className="py-4 text-center text-slate-500">No fellows for this coach</p>
      ) : (
        fellows.map((fellow) => {
          const isSelected = selectedFellow?.id === fellow.id;

          return (
            <div
              key={fellow.id}
              onClick={() => selectFellow(fellow)}
              className={`flex cursor-pointer justify-between rounded-lg border p-3 transition-colors ${
                isSelected ? 'border-[#005a6a] bg-[#e8f5f7]' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{fellow.fellow_name}</p>
                <p className="text-xs text-slate-500">
                  {fellow.email} • {fellow.grade || 'No grade'}
                </p>
              </div>

              <div className="flex gap-1">
                {/* EDIT */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent selecting fellow
                    setModal({ type: 'edit-fellow', fellow });
                  }}
                  className="rounded p-1.5 hover:bg-blue-50"
                >
                  <Edit2 className="h-4 w-4 text-blue-600" />
                </button>

                {/* DELETE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent selecting fellow
                    deleteFellow(fellow.id);
                  }}
                  className="rounded p-1.5 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          );
        })
      )}
    </AdminPanelSection>
  );
}
