"use client";

import React, { createContext, useContext, useState } from "react";
import { CompetencyId } from "@/types/rubric";
import { Term } from "@/types/core";
import { Fellow, Learner } from "@/types/people";

/* ================================
   TIERS
================================ */
export type TierValue = "" | "tier1" | "tier2" | "tier3";
export type TierKey = Exclude<TierValue, "">;

export const TIER_META: Record<TierKey, { label: string; color: string }> = {
  tier1: { label: "Emerging", color: "amber" },
  tier2: { label: "Developing", color: "blue" },
  tier3: { label: "Advanced", color: "emerald" },
};

/* ================================
   KEYS & STEPS
================================ */
export type AssessmentMap = Record<string, TierValue>;
export type EvidenceMap = Record<string, string>;

export const keyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}`;
export const eKeyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}_evidence`;

export const STEPS = ["intro", "select", "assess", "summary"] as const;
export type Step = (typeof STEPS)[number];

/* ================================
   CONTEXT CONTRACT
================================ */
export interface CompletionStats {
  totalCells: number;
  completedCells: number;
  missingEvidence: number;
}

export interface AssessmentContextType {
  // flow
  currentStep: Step;
  goToStep: (s: Step) => void;
  nextStep: () => void;
  previousStep: () => void;

  // selection
  term: Term | "";
  setTerm: (t: Term | "") => void;

  selectedCoach: string;
  setSelectedCoach: (name: string) => void;

  selectedFellow: Fellow | null;
  setSelectedFellow: (f: Fellow | null) => void;

  selectedLearners: Learner[];
  setSelectedLearners: (l: Learner[]) => void;

  // assessment data
  assessments: AssessmentMap;
  setAssessments: (a: AssessmentMap) => void;

  evidences: EvidenceMap;
  setEvidences: (e: EvidenceMap) => void;

  // ergonomic updaters
  updateAssessment: (
    learnerId: string,
    compId: CompetencyId,
    tier: TierValue
  ) => void;

  updateEvidence: (
    learnerId: string,
    compId: CompetencyId,
    text: string
  ) => void;

  getEvidence: (learnerId: string, compId: CompetencyId) => string;
  clearEvidence: (learnerId: string, compId: CompetencyId) => void;

  // derived
  completion: CompletionStats;

  // utils
  resetAssessmentState: () => void;
}

/* ================================
   CONTEXT + PROVIDER + HOOK
================================ */
const AssessmentContext = createContext<AssessmentContextType | null>(null);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // flow
  const [currentStep, setCurrentStep] = useState<Step>("intro");

  const goToStep = (s: Step) => setCurrentStep(s);
  const nextStep = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1]);
  };
  const previousStep = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1]);
  };

  // selection
  const [term, setTerm] = useState<Term | "">("");
  const [selectedCoach, setSelectedCoach] = useState<string>("");
  const [selectedFellow, setSelectedFellow] = useState<Fellow | null>(null);
  const [selectedLearners, setSelectedLearners] = useState<Learner[]>([]);

  // data
  const [assessments, setAssessments] = useState<AssessmentMap>({});
  const [evidences, setEvidences] = useState<EvidenceMap>({});

  // ergonomic updaters
  const updateAssessment = (
    learnerId: string,
    compId: CompetencyId,
    tier: TierValue
  ) => {
    setAssessments((prev) => ({
      ...prev,
      [keyFor(learnerId, compId)]: tier,
    }));
  };

  const updateEvidence = (
    learnerId: string,
    compId: CompetencyId,
    text: string
  ) => {
    setEvidences((prev) => ({
      ...prev,
      [eKeyFor(learnerId, compId)]: text,
    }));
  };

  const getEvidence = (learnerId: string, compId: CompetencyId): string =>
    evidences[eKeyFor(learnerId, compId)] ?? "";

  const clearEvidence = (learnerId: string, compId: CompetencyId) => {
    const key = eKeyFor(learnerId, compId);
    setEvidences((prev) => {
      const { [key]: _omit, ...rest } = prev;
      return rest;
    });
  };

  const resetAssessmentState = () => {
    setAssessments({});
    setEvidences({});
  };

  // derived (simple, no memo)
  const completion: CompletionStats = (() => {
    const COMP_COUNT = 5; // motivation, teamwork, analytical, curiosity, leadership
    const totalCells = selectedLearners.length * COMP_COUNT;

    let completedCells = 0;
    let missingEvidence = 0;

    for (const l of selectedLearners) {
      const comps: CompetencyId[] = [
        "motivation",
        "teamwork",
        "analytical",
        "curiosity",
        "leadership",
      ];
      for (const compId of comps) {
        const k = keyFor(l.id, compId);
        const ek = eKeyFor(l.id, compId);
        const tier = assessments[k];
        if (tier) {
          completedCells += 1;
          if (!evidences[ek]) missingEvidence += 1;
        }
      }
    }

    return { totalCells, completedCells, missingEvidence };
  })();

  const value: AssessmentContextType = {
    // flow
    currentStep,
    goToStep,
    nextStep,
    previousStep,

    // selection
    term,
    setTerm,
    selectedCoach,
    setSelectedCoach,
    selectedFellow,
    setSelectedFellow,
    selectedLearners,
    setSelectedLearners,

    // data
    assessments,
    setAssessments,
    evidences,
    setEvidences,

    // updaters
    updateAssessment,
    updateEvidence,

    // evidence helpers
    getEvidence,
    clearEvidence,

    // derived
    completion,

    // utils
    resetAssessmentState,
  };

  // simple progress bar (optional)
  const stepIndex = STEPS.indexOf(currentStep);
  const progressPct =
    STEPS.length <= 1 ? 0 : Math.round((stepIndex / (STEPS.length - 1)) * 100);

  return (
    <AssessmentContext.Provider value={value}>
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 z-50">
        <div
          className="h-full bg-[#304767] transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = (): AssessmentContextType => {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error("useAssessment() must be used within <AssessmentProvider>");
  }
  return ctx;
};
