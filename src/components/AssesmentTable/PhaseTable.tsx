"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import RubricDisplay from "@/components/rubric/RubricDisplay";
import { User, School } from "lucide-react";
import { GRADE_LABELS, type Grade } from "@/context/AssessmentProvider"

/* ---------------------------------------------------------------------------
   Types
--------------------------------------------------------------------------- */
export type TierValue = "" | "tier1" | "tier2" | "tier3";
export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

export interface TierOption {
  value: TierValue;
  label: string;
  fullLabel: string;
  color: string;
}

export interface Competency {
  id: CompetencyId;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface LearnerRow {
  id: string;
  name: string;
  grade?: Grade; // Now typed as Grade
  subject?: string;
  phase?: string;
}

export interface AssessmentTableProps {
  learnersByPhase: Record<string, LearnerRow[]>;
  competencies: Competency[];
  tiers: Readonly<TierOption[]>;
  assessments: Record<string, TierValue>;
  evidences: Record<string, string>;
  onTierChange: (
    learnerId: string,
    competencyId: CompetencyId,
    newTier: TierValue
  ) => void;
  onOpenEvidence?: (args: {
    learnerId: string;
    competencyId: CompetencyId;
    learnerName: string;
    phase: string;
    tier: TierValue;
  }) => void;
}

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */
const keyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}`;
const eKeyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}_evidence`;
const getTierBadge = (tiers: Readonly<TierOption[]>, tier: TierValue | "") =>
  tiers.find((t) => t.value === tier);

/* ---------------------------------------------------------------------------
   PhaseTable (brand-consistent, dark header)
--------------------------------------------------------------------------- */
export const PhaseTable: React.FC<{
  phase: string;
  learners: LearnerRow[];
  competencies: Competency[];
  tiers: Readonly<TierOption[]>;
  assessments: Record<string, TierValue>;
  evidences: Record<string, string>;
  onTierChange: (
    learnerId: string,
    competencyId: CompetencyId,
    newTier: TierValue
  ) => void;
  onOpenEvidence?: AssessmentTableProps["onOpenEvidence"];
}> = ({
  phase,
  learners,
  competencies,
  tiers,
  assessments,
  evidences,
  onTierChange,
  onOpenEvidence,
}) => {
  const [expandedCompetency, setExpandedCompetency] =
    React.useState<CompetencyId | null>(null);

  if (learners.length === 0) return null;

  return (
    <div className="mb-10 last:mb-0">
      {/* Phase Header (brand accent) */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-1 h-6 rounded-full bg-[#004854]" />
        <h2 className="text-lg font-bold text-[#004854]">{phase} Phase</h2>
        <Badge variant="secondary" className="ml-2">
          {learners.length} {learners.length === 1 ? "learner" : "learners"}
        </Badge>
      </div>

      {/* Rubric ABOVE table (collapsible per-competency) */}
      {expandedCompetency && (
        <div className="mb-4 rounded-lg border border-[#004854]/12 bg-[#8ED1C1]/10 p-4 animate-fadeIn">
          <RubricDisplay phase={phase} competencyId={expandedCompetency} compact />
        </div>
      )}

      {/* Table shell */}
      <div className="rounded-lg border border-[#004854]/12 shadow-sm bg-white">
        <Table className="w-full table-fixed">
          {/* Brand dark header */}
          <TableHeader className="bg-gradient-to-r from-[#004854] to-[#0a5e6c]">
            <TableRow>
              <TableHead className="px-4 py-4 text-left border-r border-white/10 text-white text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Learner
                </div>
              </TableHead>

              {competencies.map((comp) => (
                <TableHead
                  key={comp.id}
                  onClick={() =>
                    setExpandedCompetency((prev) =>
                      prev === comp.id ? null : comp.id
                    )
                  }
                  className={cn(
                    "px-3 py-4 text-center border-r last:border-r-0 border-white/10 text-white text-xs cursor-pointer select-none transition-colors",
                    expandedCompetency === comp.id
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  )}
                  title={`Show rubric for ${comp.name}`}
                >
                  <div className="flex flex-col items-center justify-center gap-1 min-h-[56px]">
                    {comp.icon && <comp.icon className="w-4 h-4" />}
                    <span className="text-[11px] leading-tight text-center whitespace-normal">
                      {comp.name}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {learners.map((learner, idx) => (
              <TableRow
                key={learner.id}
                className={cn(
                  idx % 2 === 1 ? "bg-[#8ED1C1]/5" : "bg-white",
                  "hover:bg-[#8ED1C1]/10 transition-colors"
                )}
              >
                {/* Learner column */}
                <TableCell className="px-4 py-4 border-r border-[#004854]/08 align-top">
                  <div className="font-semibold text-[#32353C] text-sm">
                    {learner.name}
                  </div>
                  <div className="text-xs text-[#32353C]/75 flex items-center gap-1 mt-1">
                    <School className="w-3 h-3" />
                    {learner.grade ? GRADE_LABELS[learner.grade] : "—"}
                    {learner.subject && ` • ${learner.subject}`}
                  </div>
                </TableCell>

                {/* Competency columns */}
                {competencies.map((comp) => {
                  const k = keyFor(learner.id, comp.id);
                  const ek = eKeyFor(learner.id, comp.id);
                  const val = (assessments[k] ?? "") as TierValue | "";
                  const note = evidences[ek] ?? "";
                  const badge = getTierBadge(tiers, val);
                  const hasTier = val !== "";
                  const hasEvidence = note.length > 0;

                  return (
                    <TableCell
                      key={comp.id}
                      className="border-l border-[#004854]/08 text-center p-3 align-top"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Select
                          value={val || undefined}
                          onValueChange={(newValue) =>
                            onTierChange(
                              learner.id,
                              comp.id,
                              newValue as TierValue
                            )
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full max-w-[150px] h-9 text-xs transition-all rounded-md",
                              "focus:ring-2 focus:ring-[#8ED1C1]/40 focus:ring-offset-0",
                              hasTier ? badge?.color : "bg-white border border-[#004854]/20",
                              "hover:scale-[1.02]"
                            )}
                            aria-label={`Select tier for ${learner.name} — ${comp.name}`}
                          >
                            <SelectValue placeholder="Select Tier" />
                          </SelectTrigger>
                          <SelectContent className="max-h-64">
                            {tiers.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.fullLabel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {hasTier && (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenEvidence?.({
                                learnerId: learner.id,
                                competencyId: comp.id,
                                learnerName: learner.name,
                                phase,
                                tier: val as TierValue,
                              })
                            }
                            className={cn(
                              "w-full max-w-[150px] h-7 px-3 text-xs rounded-md transition-colors",
                              "focus:outline-none focus:ring-2 focus:ring-[#8ED1C1]/40",
                              hasEvidence
                                ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                                : "text-amber-700 bg-amber-50 hover:bg-amber-100"
                            )}
                          >
                            {hasEvidence ? "View note" : "Add note"}
                          </button>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};