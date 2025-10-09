"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { User, Smartphone } from "lucide-react";
import { PhaseTable } from "./PhaseTable";
import { GRADE_LABELS, type Grade } from "@/context/AssessmentProvider";

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
  grade?: Grade; // Updated to use Grade type
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
const keyFor = (learnerId: string, compId: CompetencyId) => `${learnerId}_${compId}`;
const eKeyFor = (learnerId: string, compId: CompetencyId) => `${learnerId}_${compId}_evidence`;
const getTierBadge = (tiers: Readonly<TierOption[]>, tier: TierValue | "") =>
  tiers.find((t) => t.value === tier);

/* ---------------------------------------------------------------------------
   Wrapper (polished, brand-consistent, parent-size–aware)
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

  // Robust mobile detection with matchMedia (and SSR safety)
  React.useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  if (phases.length === 0) {
    return (
      <div
        className="text-center rounded-lg border border-[#004854]/12 bg-white p-8 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-[#32353C]/80">No learners to display.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="p-3">
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#004854]/15 bg-[#8ED1C1]/10 p-3">
          <Smartphone className="h-4 w-4 text-[#004854]" aria-hidden />
          <span className="text-sm text-[#004854]">
            Mobile view — tap into a learner to assess competencies.
          </span>
        </div>

        {phases.map((phase) => (
          <div key={phase} className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-[#004854]" />
              <div className="text-sm font-bold text-[#004854]">{phase} Phase</div>
              <Badge variant="secondary" className="ml-1 text-xs">
                {learnersByPhase[phase].length}
              </Badge>
            </div>
            
            {learnersByPhase[phase].map((learner) => (
              <div
                key={learner.id}
                className="rounded-lg border border-[#004854]/12 bg-white p-3 shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-[#004854]/80 mt-0.5" aria-hidden />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#32353C]">{learner.name}</div>
                    <div className="text-xs text-[#32353C]/75 mt-0.5">
                      {learner.grade ? GRADE_LABELS[learner.grade] : "—"}
                      {learner.subject && ` • ${learner.subject}`}
                    </div>
                  </div>
                </div>
                {/* You could render a compact, tappable list of competencies here
                    or navigate to a per-learner mobile sheet if you have it */}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Desktop: keep padding minimal so it doesn't fight parent's overflow container
  return (
    <div className="p-3">
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