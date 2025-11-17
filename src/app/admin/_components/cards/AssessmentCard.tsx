'use client';

import { LearnerAssessment } from '@/app/admin/types';
import { getTierColor } from '@/utils/ui_helpers';

interface AssessmentCardProps {
  assessment: LearnerAssessment;
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  if (!assessment) return null;

  // Config-driven competency definitions
  const competencies = [
    { key: 'motivation', label: 'Motivation' },
    { key: 'teamwork', label: 'Teamwork' },
    { key: 'analytical', label: 'Analytical' },
    { key: 'curiosity', label: 'Curiosity' },
    { key: 'leadership', label: 'Leadership' },
  ] as const;

  return (
    <div className="mt-3 rounded border bg-slate-50 p-4">
      <h4 className="mb-2 font-semibold">Competency Breakdown</h4>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {competencies.map(({ key, label }) => {
          const tier = (assessment as any)[`${key}_tier`] as 1 | 2 | 3 | null;
          const evidence = (assessment as any)[`${key}_evidence`] as string | null;

          const color = tier ? getTierColor(tier) : '#6b7280'; // fallback grey

          return (
            <div key={key} className="rounded p-2">
              {/* Label */}
              <p className="flex items-center gap-1 font-medium">
                {/* Colored dot */}
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                ></span>

                {label}
              </p>

              {/* Tier */}
              <p>
                Tier:{' '}
                <span className="font-semibold" style={{ color }}>
                  {tier ?? '—'}
                </span>
              </p>

              {/* Evidence */}
              <p className="text-slate-500">{evidence || 'No evidence'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
