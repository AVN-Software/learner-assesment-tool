"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Target, Users, Lightbulb, Search, Star } from "lucide-react";

import { useAssessment } from "@/context/AssessmentProvider";
import { Phase } from "@/types/core";
import { CompetencyId, TierLevel } from "@/types/rubric";

import EvidenceModal from "@/components/modals/EvidenceModal";
import RubricDisplay from "@/components/RubricDisplay";

import ShadcnAssessmentTable, {
  type TierValue,
  type TierOption,
  type LearnerRow,
  type Competency,
} from  "./AssesmentTable"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/* ----------------------------------------------------------------------------
   Competencies & Tier options
---------------------------------------------------------------------------- */
const COMPETENCIES: Competency[] = [
  { id: "motivation",  name: "Motivation & Self-Awareness", icon: Target },
  { id: "teamwork",    name: "Teamwork",                    icon: Users },
  { id: "analytical",  name: "Analytical Thinking",         icon: Lightbulb },
  { id: "curiosity",   name: "Curiosity & Creativity",      icon: Search },
  { id: "leadership",  name: "Leadership & Social Influence", icon: Star },
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
   Helpers
---------------------------------------------------------------------------- */
const competencyNameFor = (id: CompetencyId) =>
  COMPETENCIES.find((c) => c.id === id)?.name ?? "";

const toTierLevel = (tier: TierValue): TierLevel => {
  if (tier === "tier2") return 2;
  if (tier === "tier3") return 3;
  return 1;
};

/* ----------------------------------------------------------------------------
   Assessment Step (container + UI)
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
  } = useAssessment();

  /* Group learners by phase (for the table API) */
  const learnersByPhase = useMemo<Record<string, LearnerRow[]>>(() => {
    const map: Record<string, LearnerRow[]> = {};
    for (const l of selectedLearners) {
      const phase = l.phase ?? "Unknown";
      if (!map[phase]) map[phase] = [];
      map[phase].push({
        id: l.id,
        name: l.name,
        grade: l.grade,
        subject: l.subject,
        phase: l.phase,
      });
    }
    return map;
  }, [selectedLearners]);

  /* ---------------- Evidence Modal state ---------------- */
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

  /* ---------------- Rubric Sheet state ---------------- */
  const [rubricSheet, setRubricSheet] = useState<{
    open: boolean;
    phase: Phase;
    competencyId: CompetencyId;
  }>({
    open: false,
    phase: "Foundation",
    competencyId: "motivation",
  });

  /* ---------------- Table handlers ---------------- */
  const handleTierChange = (
    learnerId: string,
    competencyId: CompetencyId,
    newTier: TierValue
  ) => {
    updateAssessment(learnerId, competencyId, newTier);
  };

  const handleHeaderClick = (phase: string, competencyId: CompetencyId) => {
    setRubricSheet({
      open: true,
      phase: (phase || "Foundation") as Phase,
      competencyId,
    });
  };

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

  /* ---------------- Evidence modal glue ---------------- */
  const saveEvidence = (txt: string) => {
    if (!evidenceModal.learnerId) return;
    updateEvidence(evidenceModal.learnerId, evidenceModal.competencyId, txt);
  };

  const closeEvidence = () =>
    setEvidenceModal((s) => ({ ...s, open: false }));

  const currentEvidence = evidenceModal.open
    ? getEvidence(evidenceModal.learnerId, evidenceModal.competencyId)
    : "";

  const tierLevel = toTierLevel(evidenceModal.tier);
  const competencyName = competencyNameFor(evidenceModal.competencyId);

  /* ---------------- UI ---------------- */
  if (!selectedLearners.length) {
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        No learners selected for observation yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header (inside step) */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
          {selectedFellow
            ? `${selectedFellow.name} — Assess Learners`
            : "Assess Learners"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Choose a tier per competency. Click a column header to open the rubric.
        </p>
      </div>

      {/* Table */}
      <ShadcnAssessmentTable
        learnersByPhase={learnersByPhase}
        competencies={COMPETENCIES}
        tiers={TIERS}
        assessments={assessments}
        evidences={evidences}
        onTierChange={handleTierChange}
        onHeaderClick={handleHeaderClick}
        onOpenEvidence={handleOpenEvidence}
      />

      {/* Rubric Sheet */}
      <Sheet open={rubricSheet.open} onOpenChange={(o) => setRubricSheet((s) => ({ ...s, open: o }))}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="text-base sm:text-lg">
              Rubric — {competencyNameFor(rubricSheet.competencyId)} ({rubricSheet.phase})
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <RubricDisplay
              competencyId={rubricSheet.competencyId}
              phase={rubricSheet.phase}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={evidenceModal.open}
        onClose={closeEvidence}
        onSave={saveEvidence}
        currentEvidence={currentEvidence}
        learnerId={evidenceModal.learnerId}
        learnerName={evidenceModal.learnerName}
        phase={evidenceModal.phase}
        tierLevel={tierLevel}
        competencyId={evidenceModal.competencyId}
        competencyName={competencyName}
      />
    </div>
  );
};

export default AssessmentStep;
