'use client';

import { useState } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export function LearnerCard({
  learner,
  assessment,
  onSelect,
  onEdit,
  onDelete,
}: {
  learner: any;
  assessment: any | null;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const competencies = [
    { key: 'motivation', label: 'Motivation' },
    { key: 'teamwork', label: 'Teamwork' },
    { key: 'analytical', label: 'Analytical Thinking' },
    { key: 'curiosity', label: 'Curiosity' },
    { key: 'leadership', label: 'Leadership' },
  ];

  const formatTier = (tier: number | null) => {
    if (!tier) return 'No Tier';
    return `Tier ${tier}`;
  };

  return (
    <div
      className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-[#005a6a]"
      onClick={onSelect}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">{learner.learner_name}</div>

          <div className="text-xs text-slate-500">
            {assessment ? (
              <>Latest assessment: {assessment.date_modified?.split('T')[0]}</>
            ) : (
              <>No assessment yet</>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="rounded p-1.5 hover:bg-blue-50"
          >
            <Edit2 className="h-4 w-4 text-blue-600" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded p-1.5 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Competency list */}
      {assessment && (
        <div className="mt-3 space-y-2">
          {competencies.map(({ key, label }) => {
            const tier = assessment[`${key}_tier`];
            const evidence = assessment[`${key}_evidence`];
            const isOpen = openSection === key;

            return (
              <div key={key} className="rounded-md border bg-slate-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSection(isOpen ? null : key);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2"
                >
                  <div className="text-sm font-medium text-slate-800">
                    {label}: <span className="font-semibold">{formatTier(tier)}</span>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t bg-white px-3 py-2 text-xs text-slate-700">
                    {evidence || 'No evidence provided.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
