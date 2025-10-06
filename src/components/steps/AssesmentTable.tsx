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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  CheckCircle2,
  User,
  School,
  ChevronDown,
  Smartphone,
} from "lucide-react";

/* ---------------------------------------------------------------------------
   Types
--------------------------------------------------------------------------- */
export type TierValue = "" | "tier1" | "tier2" | "tier3";
export type CompetencyId = "motivation" | "teamwork" | "analytical" | "curiosity" | "leadership";

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

export interface ShadcnAssessmentTableProps {
  learnersByPhase: Record<string, LearnerRow[]>;
  competencies: Competency[];
  tiers: Readonly<TierOption[]>;
  assessments: Record<string, TierValue>;
  evidences: Record<string, string>;
  onTierChange: (learnerId: string, competencyId: CompetencyId, newTier: TierValue) => void;
  onHeaderClick: (phase: string, competencyId: CompetencyId) => void;
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
const keyFor = (learnerId: string, compId: CompetencyId) => `${learnerId}_${compId}`;
const eKeyFor = (learnerId: string, compId: CompetencyId) => `${learnerId}_${compId}_evidence`;

const getTierBadge = (tiers: Readonly<TierOption[]>, tier: TierValue | "") =>
  tiers.find((t) => t.value === tier);

/* ---------------------------------------------------------------------------
   Mobile Components
--------------------------------------------------------------------------- */
interface MobileLearnerCardProps {
  learner: LearnerRow;
  phase: string;
  competencies: Competency[];
  tiers: Readonly<TierOption[]>;
  assessments: Record<string, TierValue>;
  evidences: Record<string, string>;
  onTierChange: (learnerId: string, competencyId: CompetencyId, newTier: TierValue) => void;
  onOpenEvidence?: ShadcnAssessmentTableProps["onOpenEvidence"];
}

const MobileLearnerCard: React.FC<MobileLearnerCardProps> = ({
  learner,
  phase,
  competencies,
  tiers,
  assessments,
  evidences,
  onTierChange,
  onOpenEvidence,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
      {/* Learner Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-slate-900 text-base">{learner.name}</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <School className="w-3 h-3" />
              <span>{learner.grade ?? "—"}</span>
            </div>
            <span>•</span>
            <span>{learner.subject ?? "—"}</span>
            <span>•</span>
            <Badge variant="outline" className="text-xs">
              {phase}
            </Badge>
          </div>
        </div>
      </div>

      {/* Competencies */}
      <Accordion type="single" collapsible className="space-y-3">
        {competencies.map((comp) => {
          const k = keyFor(learner.id, comp.id);
          const ek = eKeyFor(learner.id, comp.id);
          const val = (assessments[k] ?? "") as TierValue | "";
          const note = evidences[ek] ?? "";
          const badge = getTierBadge(tiers, val);
          const hasTier = val !== "";
          const hasEvidence = note.length > 0;

          return (
            <AccordionItem
              key={comp.id}
              value={comp.id}
              className="border border-slate-200 rounded-lg px-3"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center gap-2 flex-1 text-left">
                  {comp.icon && <comp.icon className="w-4 h-4 text-slate-600" />}
                  <span className="font-medium text-sm text-slate-900">{comp.name}</span>
                  {hasTier && badge && (
                    <Badge className={cn("ml-2 text-xs", badge.color)}>
                      {badge.label}
                    </Badge>
                  )}
                  {hasTier && (
                    <span
                      className={cn(
                        "ml-2 w-2 h-2 rounded-full",
                        hasEvidence ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                {/* Tier Select */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Assessment Tier
                  </label>
                  <Select
                    value={val}
                    onValueChange={(newValue) =>
                      onTierChange(learner.id, comp.id, newValue as TierValue)
                    }
                  >
                    <SelectTrigger className={cn("w-full", hasTier ? badge?.color : "")}>
                      <SelectValue placeholder="Select Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Clear selection</SelectItem>
                      {tiers.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.fullLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Evidence Action */}
                {hasTier && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenEvidence?.({
                        learnerId: learner.id,
                        competencyId: comp.id,
                        learnerName: learner.name,
                        phase: phase,
                        tier: val as TierValue,
                      })
                    }
                    className={cn(
                      "w-full flex items-center justify-center gap-2 h-9 px-3 text-sm rounded-md transition-colors",
                      hasEvidence
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800"
                        : "text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800"
                    )}
                  >
                    {hasEvidence ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        View Evidence Note
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Add Evidence Note
                      </>
                    )}
                  </button>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Main Component
--------------------------------------------------------------------------- */
const ShadcnAssessmentTable: React.FC<ShadcnAssessmentTableProps> = ({
  learnersByPhase,
  competencies,
  tiers,
  assessments,
  evidences,
  onTierChange,
  onHeaderClick,
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

  if (phases.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        No learners to display.
      </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return (
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            Mobile view - Tap on competencies to assess
          </span>
        </div>

        {phases.map((phase) => {
          const rows = learnersByPhase[phase] ?? [];
          if (rows.length === 0) return null;

          return (
            <div key={phase} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-slate-800 rounded-full" />
                <h2 className="text-lg font-bold text-slate-900">{phase} Phase</h2>
                <Badge variant="secondary" className="ml-2">
                  {rows.length} {rows.length === 1 ? "learner" : "learners"}
                </Badge>
              </div>

              {rows.map((learner) => (
                <MobileLearnerCard
                  key={learner.id}
                  learner={learner}
                  phase={phase}
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
        })}
      </div>
    );
  }

  // Desktop View (Improved)
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
      <Table className="min-w-[960px] lg:min-w-full">
        <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-slate-800 to-slate-900">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[280px] min-w-[200px] px-4 py-4 text-left border-r border-slate-700 text-white text-sm font-bold">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Competency Area / Learner
              </div>
            </TableHead>
            {competencies.map((comp) => (
              <TableHead
                key={comp.id}
                className="px-3 py-4 text-center border-r border-slate-700 last:border-r-0 cursor-pointer text-white text-xs hover:bg-slate-700/60 transition-colors"
                onClick={() => {
                  const firstPhase = phases[0] ?? "Unknown";
                  onHeaderClick(firstPhase, comp.id);
                }}
                title="Click to view rubric"
              >
                <div className="flex items-center justify-center gap-1">
                  {comp.icon ? <comp.icon className="w-4 h-4" /> : null}
                  <span className="whitespace-nowrap">{comp.name}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {phases.map((phase) => {
            const rows = learnersByPhase[phase] ?? [];
            if (rows.length === 0) return null;

            return (
              <React.Fragment key={phase}>
                {/* Phase separator row */}
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableCell
                    colSpan={1 + competencies.length}
                    className="text-left text-sm font-semibold text-slate-700 px-5 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-slate-800 rounded-full" />
                      {phase} Phase
                      <Badge variant="secondary" className="ml-2">
                        {rows.length}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>

                {rows.map((learner, idx) => (
                  <TableRow 
                    key={learner.id} 
                    className={cn(
                      idx % 2 === 1 ? "bg-slate-50/60" : "bg-white",
                      "hover:bg-slate-100/80 transition-colors"
                    )}
                  >
                    {/* Learner column */}
                    <TableCell className="px-5 py-4 border-r border-slate-100 align-top">
                      <div className="font-semibold text-slate-900 text-sm">
                        {learner.name}
                      </div>
                      <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                        <School className="w-3 h-3" />
                        {learner.grade ?? "—"} • {learner.subject ?? "—"}
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
                          className="border-l border-slate-100 text-center p-3 align-top"
                        >
                          <div className="flex flex-col items-center gap-2">
                            {/* Tier Select */}
                            <div className="relative">
                              <Select
                                value={val}
                                onValueChange={(newValue) =>
                                  onTierChange(learner.id, comp.id, newValue as TierValue)
                                }
                              >
                                <SelectTrigger
                                  className={cn(
                                    "w-32 h-9 text-xs transition-all",
                                    hasTier ? badge?.color : "bg-white",
                                    "hover:scale-105"
                                  )}
                                  aria-label="Tier"
                                >
                                  <SelectValue placeholder="Select Tier" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">Clear selection</SelectItem>
                                  {tiers.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                      {t.fullLabel}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {/* Evidence dot */}
                              {hasTier && (
                                <span
                                  className={cn(
                                    "absolute -top-1 -right-1 inline-block w-2.5 h-2.5 rounded-full ring-2 ring-white",
                                    hasEvidence ? "bg-emerald-500" : "bg-amber-500"
                                  )}
                                  title={hasEvidence ? "Evidence note present" : "Missing evidence note"}
                                />
                              )}
                            </div>

                            {/* Evidence action */}
                            {hasTier && (
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenEvidence?.({
                                    learnerId: learner.id,
                                    competencyId: comp.id,
                                    learnerName: learner.name,
                                    phase: phase,
                                    tier: val as TierValue,
                                  })
                                }
                                className={cn(
                                  "h-7 px-3 text-xs rounded-md transition-all hover:scale-105",
                                  hasEvidence
                                    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800"
                                    : "text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800"
                                )}
                              >
                                {hasEvidence ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
                                    View note
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3.5 h-3.5 mr-1 inline" />
                                    Add note
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShadcnAssessmentTable;