'use client';

import { LearnerAssessment } from '@/app/admin/types';
import { Badge } from '@/components/ui/badge';
import { getTierByLevel } from '@/types/rubric.types';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface AssessmentCardProps {
  assessment: LearnerAssessment;
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  if (!assessment) return null;

  const COMPETENCIES = [
    { id: 'motivation', label: 'Motivation' },
    { id: 'teamwork', label: 'Teamwork' },
    { id: 'analytical', label: 'Analytical' },
    { id: 'curiosity', label: 'Curiosity' },
    { id: 'leadership', label: 'Leadership' },
  ] as const;

  return (
    <div className="rounded-xl border border-[#004854]/12 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8ED1C1]/20">
          <span className="text-lg font-semibold text-[#004854]">A</span>
        </div>
        <h3 className="font-semibold text-[#004854]">Assessment Details</h3>
      </div>

      {/* Accordion Stack */}
      <Accordion type="single" collapsible className="w-full space-y-3">
        {COMPETENCIES.map((c) => {
          const tier = (assessment as any)[`${c.id}_tier`] as 1 | 2 | 3 | null;
          const evidence = (assessment as any)[`${c.id}_evidence`] as string | null;

          const tierObj = tier ? getTierByLevel(tier) : null;

          return (
            <AccordionItem
              key={c.id}
              value={c.id}
              className="rounded-lg border border-[#004854]/12 bg-white px-4 shadow-sm"
            >
              {/* Trigger Row */}
              <AccordionTrigger className="flex w-full items-center justify-between py-3 text-left hover:no-underline">
                <span className="font-medium text-[#004854]">{c.label}</span>

                <Badge
                  variant="outline"
                  className={`text-[11px] ${
                    tierObj ? tierObj.color : 'border-slate-300 bg-slate-50 text-slate-600'
                  }`}
                >
                  {tierObj ? tierObj.label : '—'}
                </Badge>
              </AccordionTrigger>

              {/* Evidence content */}
              <AccordionContent className="pb-4">
                {evidence?.trim() ? (
                  <p className="px-1 text-sm text-[#32353C]/80">{evidence}</p>
                ) : (
                  <p className="px-1 text-sm text-slate-400 italic">No evidence provided</p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
