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
import { useAssessment } from "@/providers/AssessmentProvider";
import { CompetencyId } from "@/types";

/* ---------------------------------------------------------------------------
   Local Constants
--------------------------------------------------------------------------- */
const COMPETENCIES = [
  { id: "motivation" as const, name: "Motivation & Self-Awareness" },
  { id: "teamwork" as const, name: "Teamwork" },
  { id: "analytical" as const, name: "Analytical Thinking" },
  { id: "curiosity" as const, name: "Curiosity & Creativity" },
  { id: "leadership" as const, name: "Leadership & Social Influence" },
];

const TIERS = [
  {
    value: 1,
    label: "Tier 1",
    fullLabel: "Tier 1: Emerging",
    color: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    value: 2,
    label: "Tier 2",
    fullLabel: "Tier 2: Progressing",
    color: "bg-blue-100 text-blue-900 border-blue-300",
  },
  {
    value: 3,
    label: "Tier 3",
    fullLabel: "Tier 3: Advanced",
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
] as const;

const GRADE_LABELS: Record<string, string> = {
  "Grade R": "Grade R",
  "Grade 1": "Grade 1",
  "Grade 2": "Grade 2",
  "Grade 3": "Grade 3",
  "Grade 4": "Grade 4",
  "Grade 5": "Grade 5",
  "Grade 6": "Grade 6",
  "Grade 7": "Grade 7",
  "Grade 8": "Grade 8",
  "Grade 9": "Grade 9",
  "Grade 10": "Grade 10",
  "Grade 11": "Grade 11",
  "Grade 12": "Grade 12",
};

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */
const getTierColor = (tierScore: 1 | 2 | 3) => {
  return TIERS.find((t) => t.value === tierScore)?.color || "";
};

/* ---------------------------------------------------------------------------
   PhaseTable Props
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
   PhaseTable Component - Gets everything from context!
--------------------------------------------------------------------------- */
export const PhaseTable: React.FC<PhaseTableProps> = ({ onOpenEvidence }) => {
  const { selectedLearners, assessments, getCompetency, updateCompetency } =
    useAssessment();
  const [expandedCompetency, setExpandedCompetency] =
    React.useState<CompetencyId | null>(null);

  if (selectedLearners.length === 0) return null;

  // Get phase and grade from first learner (all same in session)
  const firstAssessment = assessments[selectedLearners[0].id];
  const phase = firstAssessment?.phase || "Foundation";
  const grade = firstAssessment?.grade || "Grade 1";

  return (
    <div className="mb-10 last:mb-0">
      {/* Phase Header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-1 h-6 rounded-full bg-[#004854]" />
        <h2 className="text-lg font-bold text-[#004854]">{phase} Phase</h2>
        <Badge variant="secondary" className="ml-2">
          {selectedLearners.length}{" "}
          {selectedLearners.length === 1 ? "learner" : "learners"}
        </Badge>
      </div>

      {/* Rubric Display (collapsible per-competency) */}
      {expandedCompetency && (
        <div className="mb-4 rounded-lg border border-[#004854]/12 bg-[#8ED1C1]/10 p-4 animate-fadeIn">
          <RubricDisplay
            phase={phase}
            competencyId={expandedCompetency}
            compact
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-[#004854]/12 shadow-sm bg-white">
        <Table className="w-full table-fixed">
          {/* Header */}
          <TableHeader className="bg-gradient-to-r from-[#004854] to-[#0a5e6c]">
            <TableRow>
              <TableHead className="px-4 py-4 text-left border-r border-white/10 text-white text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Learner
                </div>
              </TableHead>

              {COMPETENCIES.map((comp) => (
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
                    <span className="text-[11px] leading-tight text-center whitespace-normal">
                      {comp.name}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {selectedLearners.map((learner, idx) => (
              <TableRow
                key={learner.id}
                className={cn(
                  idx % 2 === 1 ? "bg-[#8ED1C1]/5" : "bg-white",
                  "hover:bg-[#8ED1C1]/10 transition-colors"
                )}
              >
                {/* Learner Column */}
                <TableCell className="px-4 py-4 border-r border-[#004854]/08 align-top">
                  <div className="font-semibold text-[#32353C] text-sm">
                    {learner.learner_name}
                  </div>
                  <div className="text-xs text-[#32353C]/75 flex items-center gap-1 mt-1">
                    <School className="w-3 h-3" />
                    {GRADE_LABELS[grade] || grade}
                  </div>
                </TableCell>

                {/* Competency Columns */}
                {COMPETENCIES.map((comp) => {
                  const competency = getCompetency(learner.id, comp.id);
                  const tierScore = competency?.tier_score;
                  const hasEvidence =
                    competency?.evidence &&
                    competency.evidence.trim().length > 0;

                  return (
                    <TableCell
                      key={comp.id}
                      className="border-l border-[#004854]/08 text-center p-3 align-top"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {/* Tier Select */}
                        <Select
                          value={tierScore?.toString() || undefined}
                          onValueChange={(value) => {
                            const score = parseInt(value) as 1 | 2 | 3;
                            updateCompetency(learner.id, comp.id, {
                              tier_score: score,
                            });
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full max-w-[150px] h-9 text-xs transition-all rounded-md",
                              "focus:ring-2 focus:ring-[#8ED1C1]/40 focus:ring-offset-0",
                              tierScore
                                ? getTierColor(tierScore)
                                : "bg-white border border-[#004854]/20",
                              "hover:scale-[1.02]"
                            )}
                            aria-label={`Select tier for ${learner.learner_name} — ${comp.name}`}
                          >
                            <SelectValue placeholder="Select Tier" />
                          </SelectTrigger>
                          <SelectContent className="max-h-64">
                            {TIERS.map((t) => (
                              <SelectItem
                                key={t.value}
                                value={t.value.toString()}
                              >
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
                                learnerId: learner.id,
                                competencyId: comp.id,
                                learnerName: learner.learner_name,
                                tierScore: tierScore,
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
                            {hasEvidence ? "View evidence" : "Add evidence"}
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
