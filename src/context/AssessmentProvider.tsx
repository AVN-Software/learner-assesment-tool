"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { CompetencyId } from "@/types/rubric";
import { Term } from "@/types/core";
import { Fellow, Learner } from "@/types/people";
import { useStepper } from "@/hooks/useStepper";

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
   KEYS
================================ */
export type AssessmentMap = Record<string, TierValue>;
export type EvidenceMap = Record<string, string>;

export const keyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}`;
export const eKeyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}_evidence`;

/* ================================
   STEPS
================================ */
export const STEPS = ["intro", "select", "assess", "summary"] as const;
export type Step = (typeof STEPS)[number];

/* ================================
   STEP METADATA
================================ */
export interface StepMetadata {
  label: string;
  desc: string;
  shortLabel: string;
}

export const STEP_META: Record<Step, StepMetadata> = {
  intro: {
    label: "Instructions",
    desc: "Review assessment guidance before starting.",
    shortLabel: "Instructions",
  },
  select: {
    label: "Choose Fellow",
    desc: "Select the fellow and class you're assessing.",
    shortLabel: "Select",
  },
  assess: {
    label: "Assess Learners",
    desc: "Complete the rubric and record tier ratings.",
    shortLabel: "Assess",
  },
  summary: {
    label: "Review & Submit",
    desc: "Check all entries before submitting.",
    shortLabel: "Submit",
  },
};

/* ================================
   DERIVED STATE TYPES
================================ */
export interface CompletionStats {
  totalCells: number;
  completedCells: number;
  missingEvidence: number;
  completionPercentage: number;
}

export interface StepInfo {
  current: Step;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  meta: StepMetadata;
}

export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  nextLabel: string;
  statusMessage: string;
}

/* ================================
   CONTEXT CONTRACT
================================ */
export interface AssessmentContextType {
  // Core state
  term: Term | "";
  selectedCoach: string;
  selectedFellow: Fellow | null;
  selectedLearners: Learner[];
  assessments: AssessmentMap;
  evidences: EvidenceMap;

  // Derived state (all computed in context)
  stepInfo: StepInfo;
  navigation: NavigationState;
  completion: CompletionStats;

  // Navigation methods (from useStepper)
  goToStep: (s: Step) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetStepper: () => void;

  // Selection methods
  setTerm: (t: Term | "") => void;
  setSelectedCoach: (name: string) => void;
  setSelectedFellow: (f: Fellow | null) => void;
  setSelectedLearners: (l: Learner[]) => void;

  // Assessment methods
  setAssessments: (a: AssessmentMap) => void;
  setEvidences: (e: EvidenceMap) => void;
  updateAssessment: (learnerId: string, compId: CompetencyId, tier: TierValue) => void;
  updateEvidence: (learnerId: string, compId: CompetencyId, text: string) => void;
  getEvidence: (learnerId: string, compId: CompetencyId) => string;
  clearEvidence: (learnerId: string, compId: CompetencyId) => void;

  // Utility methods
  resetAssessmentState: () => void;
  resetAll: () => void;
}

/* ================================
   CONTEXT + PROVIDER
================================ */
const AssessmentContext = createContext<AssessmentContextType | null>(null);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ==================== CORE STATE ====================
  const [term, setTerm] = useState<Term | "">("");
  const [selectedCoach, setSelectedCoach] = useState<string>("");
  const [selectedFellow, setSelectedFellow] = useState<Fellow | null>(null);
  const [selectedLearners, setSelectedLearners] = useState<Learner[]>([]);
  const [assessments, setAssessments] = useState<AssessmentMap>({});
  const [evidences, setEvidences] = useState<EvidenceMap>({});

  // ==================== STEP VALIDATION ====================
  /**
   * Validation logic for each step.
   * This determines if the user can proceed to the next step.
   */
  const canProceedFromStep = useCallback(
    (step: Step): boolean => {
      switch (step) {
        case "intro":
          return true; // Always can proceed from intro
        case "select":
          return !!selectedFellow && selectedLearners.length > 0;
        case "assess":
          return selectedLearners.length > 0; // Could add completion % requirement
        case "summary":
          return true; // Can always review
        default:
          return false;
      }
    },
    [selectedFellow, selectedLearners]
  );

  // ==================== STEPPER HOOK ====================
  const stepper = useStepper<Step>({
    steps: STEPS,
    initialStep: "intro",
    canProceed: canProceedFromStep,
    onStepChange: (newStep) => {
      console.log(`Step changed to: ${newStep}`);
      // You can add analytics, logging, or side effects here
    },
  });

  // ==================== DERIVED: STEP INFO ====================
  const stepInfo = useMemo<StepInfo>(() => {
    return {
      current: stepper.current,
      index: stepper.index,
      total: stepper.total,
      isFirst: stepper.index === 0,
      isLast: stepper.index === stepper.total - 1,
      progress: stepper.progressPct,
      meta: STEP_META[stepper.current],
    };
  }, [stepper.current, stepper.index, stepper.total, stepper.progressPct]);

  // ==================== DERIVED: COMPLETION STATS ====================
  const completion = useMemo<CompletionStats>(() => {
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

    const completionPercentage =
      totalCells === 0 ? 0 : Math.round((completedCells / totalCells) * 100);

    return {
      totalCells,
      completedCells,
      missingEvidence,
      completionPercentage,
    };
  }, [selectedLearners, assessments, evidences]);

  // ==================== DERIVED: NAVIGATION STATE ====================
  const navigation = useMemo<NavigationState>(() => {
    // Next button label
    const nextLabel = (() => {
      switch (stepper.current) {
        case "intro":
          return "Get Started";
        case "summary":
          return "Complete Assessment";
        default:
          return "Continue";
      }
    })();

    // Status message for footer
    const statusMessage = (() => {
      switch (stepper.current) {
        case "intro":
          return "Review the assessment guide before starting";
        case "select":
          return selectedFellow
            ? `Assessing ${selectedFellow.name}'s class`
            : "Select a fellow and their learners";
        case "assess":
          if (selectedLearners.length === 0) {
            return "No learners selected for assessment";
          }
          const pct = completion.completionPercentage;
          return `Assessing ${selectedLearners.length} learner${
            selectedLearners.length !== 1 ? "s" : ""
          } • ${pct}% complete`;
        case "summary":
          return "Review your assessment before final submission";
        default:
          return "";
      }
    })();

    return {
      canGoBack: stepper.canGoPrev,
      canGoNext: stepper.canGoNext,
      nextLabel,
      statusMessage,
    };
  }, [stepper, selectedFellow, selectedLearners, completion.completionPercentage]);

  // ==================== ASSESSMENT METHODS ====================
  const updateAssessment = useCallback(
    (learnerId: string, compId: CompetencyId, tier: TierValue) => {
      setAssessments((prev) => ({
        ...prev,
        [keyFor(learnerId, compId)]: tier,
      }));
    },
    []
  );

  const updateEvidence = useCallback(
    (learnerId: string, compId: CompetencyId, text: string) => {
      setEvidences((prev) => ({
        ...prev,
        [eKeyFor(learnerId, compId)]: text,
      }));
    },
    []
  );

  const getEvidence = useCallback(
    (learnerId: string, compId: CompetencyId): string =>
      evidences[eKeyFor(learnerId, compId)] ?? "",
    [evidences]
  );

  const clearEvidence = useCallback((learnerId: string, compId: CompetencyId) => {
    const key = eKeyFor(learnerId, compId);
    setEvidences((prev) => {
      const { [key]: _omit, ...rest } = prev;
      return rest;
    });
  }, []);

  const resetAssessmentState = useCallback(() => {
    setAssessments({});
    setEvidences({});
  }, []);

  const resetAll = useCallback(() => {
    setTerm("");
    setSelectedCoach("");
    setSelectedFellow(null);
    setSelectedLearners([]);
    setAssessments({});
    setEvidences({});
    stepper.reset();
  }, [stepper]);

  // ==================== CONTEXT VALUE ====================
  const value: AssessmentContextType = {
    // Core state
    term,
    selectedCoach,
    selectedFellow,
    selectedLearners,
    assessments,
    evidences,

    // Derived state
    stepInfo,
    navigation,
    completion,

    // Navigation (from stepper)
    goToStep: stepper.goTo,
    nextStep: stepper.next,
    previousStep: stepper.prev,
    resetStepper: stepper.reset,

    // Selection
    setTerm,
    setSelectedCoach,
    setSelectedFellow,
    setSelectedLearners,

    // Assessment
    setAssessments,
    setEvidences,
    updateAssessment,
    updateEvidence,
    getEvidence,
    clearEvidence,

    // Utility
    resetAssessmentState,
    resetAll,
  };

  return (
    <AssessmentContext.Provider value={value}>
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