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
import RubricDisplay from "@/components/RubricDisplay";
import {
  AlertCircle,
  CheckCircle2,
  User,
  School,
  Smartphone,
} from "lucide-react";

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
  grade?: string;
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
   Desktop Table
--------------------------------------------------------------------------- */
const PhaseTable: React.FC<{
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
      {/* Phase Header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-1 h-6 bg-slate-800 rounded-full" />
        <h2 className="text-lg font-bold text-slate-900">{phase} Phase</h2>
        <Badge variant="secondary" className="ml-2">
          {learners.length} {learners.length === 1 ? "learner" : "learners"}
        </Badge>
      </div>

      {/* Rubric ABOVE table */}
      {expandedCompetency && (
        <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-4 animate-fadeIn">
          <RubricDisplay
            phase={phase}
            competencyId={expandedCompetency}
            compact={true}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <Table className="min-w-[960px]">
          <TableHeader className="bg-gradient-to-r from-slate-800 to-slate-900">
            <TableRow>
              <TableHead className="w-[280px] px-5 py-4 text-left border-r border-slate-700 text-white text-sm font-bold">
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
                    "px-3 py-4 text-center border-r border-slate-700 last:border-r-0 text-white text-xs cursor-pointer transition-colors select-none",
                    expandedCompetency === comp.id
                      ? "bg-slate-700"
                      : "hover:bg-slate-700/50"
                  )}
                >
                  <div className="flex items-center justify-center gap-1">
                    {comp.icon && <comp.icon className="w-4 h-4" />}
                    <span className="whitespace-nowrap">{comp.name}</span>
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
                  idx % 2 === 1 ? "bg-slate-50/60" : "bg-white",
                  "hover:bg-slate-100/80 transition-colors"
                )}
              >
                <TableCell className="px-5 py-4 border-r border-slate-100 align-top">
                  <div className="font-semibold text-slate-900 text-sm">
                    {learner.name}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                    <School className="w-3 h-3" />
                    {learner.grade ?? "—"} • {learner.subject ?? "—"}
                  </div>
                </TableCell>

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
                      className="border-l border-slate-100 text-center p-3 align-top"
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
                              "w-32 h-9 text-xs transition-all",
                              hasTier ? badge?.color : "bg-white",
                              "hover:scale-105"
                            )}
                          >
                            <SelectValue placeholder="Select Tier" />
                          </SelectTrigger>
                          <SelectContent>
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
                              "h-7 px-3 text-xs rounded-md transition-all hover:scale-105 whitespace-nowrap",
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

/* ---------------------------------------------------------------------------
   Wrapper
--------------------------------------------------------------------------- */
const AssessmentTable: React.FC<AssessmentTableProps> = ({
  learnersByPhase,
  competencies,
  tiers,
  assessments,
  evidences,
  onTierChange,
  onOpenEvidence,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const phases = Object.keys(learnersByPhase);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (phases.length === 0)
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        No learners to display.
      </div>
    );

  if (isMobile)
    return (
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            Mobile view – tap a competency to assess
          </span>
        </div>
        {phases.map((phase) => (
          <div key={phase}>
            {learnersByPhase[phase].map((learner) => (
              <div key={learner.id} className="mb-4">
                {/* You could reuse MobileLearnerCard if desired */}
                <div>{learner.name}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );

  return (
    <div className="px-4 py-2">
      {phases.map((phase) => (
        <PhaseTable
          key={phase}
          phase={phase}
          learners={learnersByPhase[phase]}
          competencies={competencies}
          tiers={tiers}
          assessments={assessments}
          evidences={evidences}
          onTierChange={onTierChange}
          onOpenEvidence={onOpenEvidence}
        />
      ))}
    </div>
  );
};

export default AssessmentTable;
