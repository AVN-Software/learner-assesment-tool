"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Info, Users } from "lucide-react";
import { useAssessment } from "@/context/AssessmentProvider";
import { Phase } from "@/types/core";
import { CompetencyId, TierLevel } from "@/types/rubric";

import EvidenceModal from "@/components/modals/EvidenceModal";
import AssessmentTable, {
  type TierValue,
  type TierOption,
  type LearnerRow,
  type Competency,
} from "../AssesmentTable";


/* ----------------------------------------------------------------------------
   Competencies & Tier Options
---------------------------------------------------------------------------- */
const COMPETENCIES: Competency[] = [
  { id: "motivation", name: "Motivation & Self-Awareness" },
  { id: "teamwork", name: "Teamwork" },
  { id: "analytical", name: "Analytical Thinking" },
  { id: "curiosity", name: "Curiosity & Creativity" },
  { id: "leadership", name: "Leadership & Social Influence" },
];

export const TIERS: Readonly<TierOption[]> = [
  {
    value: "tier1",
    label: "Tier 1",
    fullLabel: "Tier 1: Emerging",
    color: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    value: "tier2",
    label: "Tier 2",
    fullLabel: "Tier 2: Developing",
    color: "bg-blue-100 text-blue-900 border-blue-300",
  },
  {
    value: "tier3",
    label: "Tier 3",
    fullLabel: "Tier 3: Advanced",
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
] as const;

/* ----------------------------------------------------------------------------
   Utilities
---------------------------------------------------------------------------- */
const competencyNameFor = (id: CompetencyId) =>
  COMPETENCIES.find((c) => c.id === id)?.name ?? "";

const toTierLevel = (tier: TierValue): TierLevel => {
  if (tier === "tier2") return 2;
  if (tier === "tier3") return 3;
  return 1;
};

/* ----------------------------------------------------------------------------
   Main Component
---------------------------------------------------------------------------- */
const AssessmentStep: React.FC = () => {
  const {
    selectedFellow,
    selectedLearners,
    assessments,
    evidences,
    updateAssessment,
    updateEvidence,
    getEvidence,
    completion,
    stepInfo,
    navigation,
    nextStep,
    previousStep,
    goToStep,
  } = useAssessment();

  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [evidenceModal, setEvidenceModal] = useState<{
    open: boolean;
    learnerId: string;
    learnerName: string;
    competencyId: CompetencyId;
    phase: Phase;
    tier: TierValue;
  }>({
    open: false,
    learnerId: "",
    learnerName: "",
    competencyId: "motivation",
    phase: "Foundation",
    tier: "",
  });

  /* ---------------------------- Group learners by phase ---------------------------- */
  const learnersByPhase = useMemo<Record<string, LearnerRow[]>>(() => {
    const map: Record<string, LearnerRow[]> = {};
    for (const learner of selectedLearners) {
      const phase = learner.phase ?? "Unknown";
      if (!map[phase]) map[phase] = [];
      map[phase].push({
        id: learner.id,
        name: learner.name,
        grade: learner.grade,
        subject: learner.subject,
        phase: learner.phase,
      });
    }
    return map;
  }, [selectedLearners]);

  const phases = Object.keys(learnersByPhase);

  useEffect(() => {
    if (phases.length > 0 && !activePhase) setActivePhase(phases[0]);
  }, [phases, activePhase]);

  /* ---------------------------- Evidence Modal Logic ---------------------------- */
  const currentEvidence = evidenceModal.open
    ? getEvidence(evidenceModal.learnerId, evidenceModal.competencyId)
    : "";

  const handleTierChange = (
    learnerId: string,
    competencyId: CompetencyId,
    newTier: TierValue
  ) => updateAssessment(learnerId, competencyId, newTier);

  const handleOpenEvidence = (args: {
    learnerId: string;
    competencyId: CompetencyId;
    learnerName: string;
    phase: string;
    tier: TierValue;
  }) => {
    setEvidenceModal({
      open: true,
      learnerId: args.learnerId,
      learnerName: args.learnerName,
      competencyId: args.competencyId,
      phase: (args.phase || "Foundation") as Phase,
      tier: args.tier,
    });
  };

  const saveEvidence = (text: string) => {
    if (!evidenceModal.learnerId) return;
    updateEvidence(evidenceModal.learnerId, evidenceModal.competencyId, text);
    setEvidenceModal((prev) => ({ ...prev, open: false }));
  };

  const closeEvidence = () =>
    setEvidenceModal((prev) => ({ ...prev, open: false }));

  const getStatusMessage = () => {
    const { totalCells, completedCells, missingEvidence } = completion;
    if (totalCells === 0) return "No learners selected";
    const pct = completion.completionPercentage;
    let msg = `${completedCells}/${totalCells} assessed (${pct}%)`;
    if (missingEvidence > 0) msg += ` • ${missingEvidence} missing evidence`;
    return msg;
  };

  /* ---------------------------- Empty State ---------------------------- */
  if (selectedLearners.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center pb-16">
          <Users className="mx-auto w-16 h-16 text-slate-400 mb-4" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            No learners selected
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Go back to the previous step and select learners to begin your
            assessment.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------- Main Render ---------------------------- */
  const phase = activePhase || phases[0];
  const totalLearners = selectedLearners.length;

  return (
     <>
    {/* Instruction Banner */}
    <div className="px-4 py-4 bg-slate-50 border-b border-slate-200 -mx-6 -mt-6">
      <div className="flex items-start gap-3 text-slate-700">
        <Info className="w-5 h-5 mt-0.5 text-slate-500" />
        <div>
          <p className="text-sm font-medium">
            You have selected <strong>{totalLearners}</strong>{" "}
            {totalLearners > 1 ? "learners" : "learner"} in the{" "}
            <strong>{phase} Phase</strong>.
          </p>
          <p className="text-sm mt-1 text-slate-600">
            Complete the assessment for each learner below. Click any column
            header to view the rubric for that competency.
          </p>
        </div>
      </div>
    </div>

    <div className="-mx-6">
      <AssessmentTable
        learnersByPhase={{ [phase]: learnersByPhase[phase] }}
        competencies={COMPETENCIES}
        tiers={TIERS}
        assessments={assessments}
        evidences={evidences}
        onTierChange={handleTierChange}
        onOpenEvidence={handleOpenEvidence}
      />
    </div>

    {/* Modal */}
    <EvidenceModal
      isOpen={evidenceModal.open}
      onClose={closeEvidence}
      onSave={saveEvidence}
      currentEvidence={currentEvidence}
      learnerId={evidenceModal.learnerId}
      learnerName={evidenceModal.learnerName}
      phase={evidenceModal.phase}
      tierLevel={toTierLevel(evidenceModal.tier)}
      competencyId={evidenceModal.competencyId}
      competencyName={competencyNameFor(evidenceModal.competencyId)}
    />
  </>
  );
};

export default AssessmentStep;
