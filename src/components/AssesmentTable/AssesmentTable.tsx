"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { User, Smartphone } from "lucide-react";
import { useAssessment } from "@/providers/AssessmentProvider";
import { PhaseTable } from "./PhaseTable";
import { CompetencyId, GRADE_LABELS, Learner } from "@/types";

/* ---------------------------------------------------------------------------
   Evidence Modal State Management (Local UI concern)
--------------------------------------------------------------------------- */
export interface EvidenceModalState {
  open: boolean;
  learnerId: string;
  learnerName: string;
  competencyId: CompetencyId;
  tierScore: 1 | 2 | 3;
}

/* ---------------------------------------------------------------------------
   Component - NO PROPS, uses context for everything
--------------------------------------------------------------------------- */
const AssessmentTable: React.FC = () => {
  const { selectedLearners, assessments } = useAssessment();
  const [isMobile, setIsMobile] = React.useState(false);

  // Evidence modal state (UI concern - stays local)
  const [evidenceModal, setEvidenceModal] = React.useState<EvidenceModalState>({
    open: false,
    learnerId: "",
    learnerName: "",
    competencyId: "motivation",
    tierScore: 1,
  });

  // Get phase and grade from first learner (all same in one session)
  const firstAssessment =
    selectedLearners.length > 0 ? assessments[selectedLearners[0].id] : null;
  const phase = firstAssessment?.phase || "Foundation";
  const grade = firstAssessment?.grade || "Grade 1";

  // Mobile detection
  React.useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const handleOpenEvidence = (args: Omit<EvidenceModalState, "open">) => {
    setEvidenceModal({ ...args, open: true });
  };

  if (selectedLearners.length === 0) {
    return (
      <div
        className="text-center rounded-lg border border-slate-200 bg-white p-8 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-slate-600">No learners to display.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="p-3">
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <Smartphone className="h-4 w-4 text-blue-800" aria-hidden />
          <span className="text-sm text-blue-800">
            Mobile view — tap into a learner to assess competencies.
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full bg-blue-600" />
            <div className="text-sm font-bold text-slate-800">
              {phase} Phase
            </div>
            <Badge variant="secondary" className="ml-1 text-xs">
              {selectedLearners.length}
            </Badge>
          </div>

          {selectedLearners.map((learner: Learner) => (
            <div
              key={learner.id}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-slate-600 mt-0.5" aria-hidden />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">
                    {learner.learner_name}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {GRADE_LABELS[grade] || grade}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="p-3">
      <PhaseTable onOpenEvidence={handleOpenEvidence} />

      {/* Evidence modal would be rendered here if needed */}
      {/* Or better yet, lift it to AssessmentStep since it manages the modal */}
    </div>
  );
};

export default AssessmentTable;
