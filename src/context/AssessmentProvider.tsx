// AssessmentContext.tsx
"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { CompetencyId } from "@/types/rubric";
import { Term } from "@/types/core";
import { Fellow, Learner } from "@/types/people";
import { useWizard } from "../hooks/useWizard";
import { 
  WIZARD_CONFIG, 
  STEPS, 
  type StepKey,
  getStepConfig,
  getStepIndex,
  calculateProgress,
} from "../components/wizard/wizard-config";

/* ================================
   TIERS & ASSESSMENT TYPES
================================ */
export type TierValue = "" | "tier1" | "tier2" | "tier3";
export type TierKey = Exclude<TierValue, "">;

export const TIER_META: Record<TierKey, { label: string; color: string }> = {
  tier1: { label: "Emerging", color: "amber" },
  tier2: { label: "Developing", color: "blue" },
  tier3: { label: "Advanced", color: "emerald" },
};

/* ================================
   DATA STRUCTURES
================================ */
export type AssessmentMap = Record<string, TierValue>;
export type EvidenceMap = Record<string, string>;

export const keyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}`;
export const eKeyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}_evidence`;

/* ================================
   COMPLETION STATS
================================ */
export interface CompletionStats {
  totalCells: number;
  completedCells: number;
  missingEvidence: number;
  completionPercentage: number;
}

/* ================================
   STEP INFO & NAVIGATION TYPES
================================ */
export interface StepInfo {
  current: StepKey;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  config: typeof WIZARD_CONFIG[StepKey];
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
  // ==================== CORE STATE ====================
  term: Term | "";
  selectedCoach: string;
  selectedFellow: Fellow | null;
  selectedLearners: Learner[];
  assessments: AssessmentMap;
  evidences: EvidenceMap;

  // ==================== WIZARD STATE ====================
  currentStep: StepKey;
  stepInfo: StepInfo;
  navigation: NavigationState;
  completion: CompletionStats;

  // ==================== NAVIGATION METHODS ====================
  goToStep: (step: StepKey) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetStepper: () => void;

  // ==================== SELECTION METHODS ====================
  setTerm: (term: Term | "") => void;
  setSelectedCoach: (coach: string) => void;
  setSelectedFellow: (fellow: Fellow | null) => void;
  setSelectedLearners: (learners: Learner[]) => void;

  // ==================== ASSESSMENT METHODS ====================
  setAssessments: (assessments: AssessmentMap) => void;
  setEvidences: (evidences: EvidenceMap) => void;
  updateAssessment: (learnerId: string, compId: CompetencyId, tier: TierValue) => void;
  updateEvidence: (learnerId: string, compId: CompetencyId, text: string) => void;
  getEvidence: (learnerId: string, compId: CompetencyId) => string;
  clearEvidence: (learnerId: string, compId: CompetencyId) => void;

  // ==================== UTILITY METHODS ====================
  resetAssessmentState: () => void;
  resetAll: () => void;
}

export const generateStepInfo = (currentStep: StepKey): StepInfo => {
  const index = getStepIndex(currentStep);
  const total = STEPS.length;
  
  return {
    current: currentStep,
    index,
    total,
    isFirst: index === 0,
    isLast: index === total - 1,
    progress: calculateProgress(currentStep),
    config: getStepConfig(currentStep),
  };
};

// Generate navigation state
export const generateNavigationState = (
  currentStep: StepKey,
  canProceed: boolean,
  selectedFellow: Fellow | null,
  selectedLearners: Learner[],
  completion: CompletionStats
): NavigationState => {
  const stepInfo = generateStepInfo(currentStep);
  const config = stepInfo.config;
  
  const statusMessage = (() => {
    switch (currentStep) {
      case "intro":
        return "Review the assessment guide before starting";
      case "select":
        return selectedFellow
          ? `Fellow selected: ${selectedFellow.name}`
          : "Select and verify a fellow to continue";
      case "learners":
        if (selectedLearners.length === 0) {
          return "Select learners to assess";
        }
        return `${selectedLearners.length} learner${
          selectedLearners.length !== 1 ? "s" : ""
        } selected`;
      case "assess":
        if (selectedLearners.length === 0) {
          return "No learners selected for assessment";
        }
        return `Assessing ${selectedLearners.length} learner${
          selectedLearners.length !== 1 ? "s" : ""
        } • ${completion.completionPercentage}% complete`;
      case "summary":
        return "Review your assessment before final submission";
      default:
        return "";
    }
  })();

  return {
    canGoBack: !stepInfo.isFirst && config.showBackButton,
    canGoNext: canProceed && !stepInfo.isLast,
    nextLabel: config.primaryButton,
    statusMessage,
  };
};

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
  const canProceedFromStep = useCallback(
    (step: StepKey): boolean => {
      switch (step) {
        case "intro":
          return true; // Always can proceed from intro
        case "select":
          return !!selectedFellow; // Only need fellow verified
        case "learners":
          return selectedLearners.length > 0; // Need learners selected
        case "assess":
          return selectedLearners.length > 0;
        case "summary":
          return true; // Can always review
        default:
          return false;
      }
    },
    [selectedFellow, selectedLearners]
  );

  // ==================== WIZARD HOOK ====================
  const wizard = useWizard({
    steps: STEPS,
    initialStep: "intro",
    onStepChange: (from, to) => {
      console.log(`Assessment: Navigated from ${from} to ${to}`);
    },
  });

  // ==================== COMPLETION STATS ====================
  const completion = useMemo<CompletionStats>(() => {
    const COMP_COUNT = 5; // motivation, teamwork, analytical, curiosity, leadership
    const totalCells = selectedLearners.length * COMP_COUNT;

    let completedCells = 0;
    let missingEvidence = 0;

    for (const learner of selectedLearners) {
      const comps: CompetencyId[] = [
        "motivation",
        "teamwork",
        "analytical",
        "curiosity",
        "leadership",
      ];
      for (const compId of comps) {
        const key = keyFor(learner.id, compId);
        const evidenceKey = eKeyFor(learner.id, compId);
        const tier = assessments[key];
        if (tier) {
          completedCells += 1;
          if (!evidences[evidenceKey] || evidences[evidenceKey].trim() === "") {
            missingEvidence += 1;
          }
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

  // ==================== DERIVED: STEP INFO ====================
  const stepInfo = useMemo((): StepInfo => {
    return generateStepInfo(wizard.currentStep as StepKey);
  }, [wizard.currentStep]);

  // ==================== DERIVED: NAVIGATION STATE ====================
  const navigation = useMemo((): NavigationState => {
    const canProceed = canProceedFromStep(wizard.currentStep as StepKey);
    return generateNavigationState(
      wizard.currentStep as StepKey,
      canProceed,
      selectedFellow,
      selectedLearners,
      completion
    );
  }, [wizard.currentStep, canProceedFromStep, selectedFellow, selectedLearners, completion]);

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

  // ==================== UTILITY METHODS ====================
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
    wizard.reset();
  }, [wizard]);

  // ==================== CONTEXT VALUE ====================
  const value: AssessmentContextType = {
    // Core state
    term,
    selectedCoach,
    selectedFellow,
    selectedLearners,
    assessments,
    evidences,

    // Wizard state
    currentStep: wizard.currentStep as StepKey,
    stepInfo,
    navigation,
    completion,

    // Navigation methods
    goToStep: (step: StepKey) => wizard.goToStep(step),
    nextStep: wizard.goToNext,
    previousStep: wizard.goToPrevious,
    resetStepper: wizard.reset,

    // Selection methods
    setTerm,
    setSelectedCoach,
    setSelectedFellow,
    setSelectedLearners,

    // Assessment methods
    setAssessments,
    setEvidences,
    updateAssessment,
    updateEvidence,
    getEvidence,
    clearEvidence,

    // Utility methods
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