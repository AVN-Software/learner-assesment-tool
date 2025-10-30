'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import RubricDisplay from '@/components/rubric/RubricDisplay';
import { User, School } from 'lucide-react';
import { useAssessment } from '@/providers/AssessmentProvider';
import { useData } from '@/providers/DataProvider';
import { CompetencyId } from '@/types';
import { COMPETENCIES, getTierColor, TIERS } from '@/types/rubric.types';
import { GRADE_LABELS } from '@/types/core.types';

/* ---------------------------------------------------------------------------
   Constants
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
   Props
--------------------------------------------------------------------------- */
export interface PhaseTableProps {
  onOpenEvidence: (args: {
    learnerId: string;
    competencyId: CompetencyId;
    learnerName: string;
    tierScore: 1 | 2 | 3;
  }) => void;
}

/* ---------------------------------------------------------------------------
   Component
--------------------------------------------------------------------------- */
export const PhaseTable: React.FC<PhaseTableProps> = ({ onOpenEvidence }) => {
  const { fellowData } = useData();
  const { selectedLearners, getCompetency, updateCompetency, assessmentDrafts } = useAssessment();

  const [expandedCompetency, setExpandedCompetency] = React.useState<CompetencyId | null>(null);

  if (selectedLearners.length === 0) return null;

  const phase = fellowData?.phase || 'Foundation';
  const grade = fellowData?.grade || 'Grade 1';

  return (
    <div className="mb-10 last:mb-0">
      {/* Phase Header */}
      <div className="mb-4 flex items-center gap-2 px-1">
        <div className="h-6 w-1 rounded-full bg-[#004854]" />
        <h2 className="text-lg font-bold text-[#004854]">{phase} Phase</h2>
        <Badge variant="secondary" className="ml-2">
          {selectedLearners.length} {selectedLearners.length === 1 ? 'learner' : 'learners'}
        </Badge>
      </div>

      {/* Rubric Display */}
      {expandedCompetency && (
        <div className="animate-fadeIn mb-4 rounded-lg border border-[#004854]/12 bg-[#8ED1C1]/10 p-4">
          <RubricDisplay phase={phase} competencyId={expandedCompetency} compact />
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-[#004854]/12 bg-white shadow-sm">
        <Table className="w-full table-fixed">
          <TableHeader className="bg-gradient-to-r from-[#004854] to-[#0a5e6c]">
            <TableRow>
              <TableHead className="border-r border-white/10 px-4 py-4 text-left text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Learner
                </div>
              </TableHead>

              {COMPETENCIES.map((comp) => (
                <TableHead
                  key={comp.id}
                  onClick={() =>
                    setExpandedCompetency((prev) => (prev === comp.id ? null : comp.id))
                  }
                  className={cn(
                    'cursor-pointer border-r border-white/10 px-3 py-4 text-center text-xs text-white transition-colors select-none last:border-r-0',
                    expandedCompetency === comp.id ? 'bg-white/10' : 'hover:bg-white/5',
                  )}
                  title={`Show rubric for ${comp.name}`}
                >
                  <div className="flex min-h-[56px] flex-col items-center justify-center gap-1">
                    <span className="text-center text-[11px] leading-tight whitespace-normal">
                      {comp.name}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {selectedLearners.map((learnerId, idx) => {
              const draft = assessmentDrafts.find((d) => d.learnerId === learnerId);
              if (!draft) return null;

              return (
                <TableRow
                  key={learnerId}
                  className={cn(
                    idx % 2 === 1 ? 'bg-[#8ED1C1]/5' : 'bg-white',
                    'transition-colors hover:bg-[#8ED1C1]/10',
                  )}
                >
                  {/* Learner Column */}
                  <TableCell className="border-[#004854]/08 border-r px-4 py-4 align-top">
                    <div className="text-sm font-semibold text-[#32353C]">{draft.learnerName}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#32353C]/75">
                      <School className="h-3 w-3" />
                      {grade}
                    </div>
                  </TableCell>

                  {/* Competency Columns */}
                  {COMPETENCIES.map((comp) => {
                    const competency = getCompetency(learnerId, comp.id);
                    const tierScore = competency?.tierScore;
                    const hasEvidence =
                      competency?.evidence && competency.evidence.trim().length > 0;

                    return (
                      <TableCell
                        key={comp.id}
                        className="border-[#004854]/08 border-l p-3 text-center align-top"
                      >
                        <div className="flex flex-col items-center gap-2">
                          {/* Tier Select */}
                          <Select
                            value={tierScore?.toString() || undefined}
                            onValueChange={(value) => {
                              const score = parseInt(value) as 1 | 2 | 3;
                              updateCompetency(learnerId, comp.id, {
                                tierScore: score,
                              });
                            }}
                          >
                            <SelectTrigger
                              className={cn(
                                'h-9 w-full max-w-[150px] rounded-md text-xs transition-all',
                                'focus:ring-2 focus:ring-[#8ED1C1]/40 focus:ring-offset-0',
                                tierScore
                                  ? getTierColor(tierScore)
                                  : 'border border-[#004854]/20 bg-white',
                                'hover:scale-[1.02]',
                              )}
                              aria-label={`Select tier for ${draft.learnerName} — ${comp.name}`}
                            >
                              <SelectValue placeholder="Select Tier" />
                            </SelectTrigger>
                            <SelectContent className="max-h-64">
                              {TIERS.map((t) => (
                                <SelectItem key={t.value} value={t.value.toString()}>
                                  {t.fullLabel}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Evidence Button */}
                          {tierScore && (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenEvidence({
                                  learnerId,
                                  competencyId: comp.id,
                                  learnerName: draft.learnerName,
                                  tierScore,
                                })
                              }
                              className={cn(
                                'h-7 w-full max-w-[150px] rounded-md px-3 text-xs transition-colors',
                                'focus:ring-2 focus:ring-[#8ED1C1]/40 focus:outline-none',
                                hasEvidence
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
                              )}
                            >
                              {hasEvidence ? 'View evidence' : 'Add evidence'}
                            </button>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
