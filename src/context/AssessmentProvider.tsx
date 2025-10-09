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
   GRADE TYPES
================================ */
export type Grade = "R" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

export const GRADES: Grade[] = ["R", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

export const GRADE_LABELS: Record<Grade, string> = {
  "R": "Grade R",
  "1": "Grade 1",
  "2": "Grade 2",
  "3": "Grade 3",
  "4": "Grade 4",
  "5": "Grade 5",
  "6": "Grade 6",
  "7": "Grade 7",
  "8": "Grade 8",
  "9": "Grade 9",
  "10": "Grade 10",
  "11": "Grade 11",
  "12": "Grade 12",
};

/* ================================
   PHASE MAPPING
================================ */
export type Phase = "Foundation" | "Intermediate" | "Senior" | "FET";

export const PHASE_LABELS: Record<Phase, string> = {
  Foundation: "Foundation Phase",
  Intermediate: "Intermediate Phase",
  Senior: "Senior Phase",
  FET: "FET Phase",
};

export const getPhaseFromGrade = (grade: Grade): Phase => {
  if (grade === "R" || grade === "1" || grade === "2" || grade === "3") {
    return "Foundation";
  }
  if (grade === "4" || grade === "5" || grade === "6") {
    return "Intermediate";
  }
  if (grade === "7" || grade === "8" || grade === "9") {
    return "Senior";
  }
  return "FET"; // 10, 11, 12
};

export const getGradesForPhase = (phase: Phase): Grade[] => {
  switch (phase) {
    case "Foundation":
      return ["R", "1", "2", "3"];
    case "Intermediate":
      return ["4", "5", "6"];
    case "Senior":
      return ["7", "8", "9"];
    case "FET":
      return ["10", "11", "12"];
  }
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
  selectedGrade: Grade | "";
  assessments: AssessmentMap;
  evidences: EvidenceMap;

  // ==================== WIZARD STATE ====================
  currentStep: StepKey;
  stepInfo: StepInfo;
  navigation: NavigationState;
  completion: CompletionStats;

  // ==================== SUBMISSION STATE ====================
  isSubmitting: boolean;

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
  setSelectedGrade: (grade: Grade | "") => void;

  // ==================== ASSESSMENT METHODS ====================
  setAssessments: (assessments: AssessmentMap) => void;
  setEvidences: (evidences: EvidenceMap) => void;
  updateAssessment: (learnerId: string, compId: CompetencyId, tier: TierValue) => void;
  updateEvidence: (learnerId: string, compId: CompetencyId, text: string) => void;
  getEvidence: (learnerId: string, compId: CompetencyId) => string;
  clearEvidence: (learnerId: string, compId: CompetencyId) => void;

  // ==================== SUBMISSION METHODS ====================
  submitAssessment: () => Promise<void>;

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
  selectedGrade: Grade | "",
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
        if (!selectedGrade) {
          return `${selectedLearners.length} learner${
            selectedLearners.length !== 1 ? "s" : ""
          } selected • Select grade to continue`;
        }
        return `${selectedLearners.length} ${GRADE_LABELS[selectedGrade]} learner${
          selectedLearners.length !== 1 ? "s" : ""
        } selected`;
      case "assess":
        if (selectedLearners.length === 0) {
          return "No learners selected for assessment";
        }
        return `Assessing ${selectedLearners.length} ${selectedGrade ? GRADE_LABELS[selectedGrade] : ""} learner${
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
  const [selectedGrade, setSelectedGrade] = useState<Grade | "">("");
  const [assessments, setAssessments] = useState<AssessmentMap>({});
  const [evidences, setEvidences] = useState<EvidenceMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==================== STEP VALIDATION ====================
  const canProceedFromStep = useCallback(
    (step: StepKey): boolean => {
      switch (step) {
        case "intro":
          return true; // Always can proceed from intro
        case "select":
          return !!selectedFellow; // Only need fellow verified
        case "learners":
          return selectedLearners.length > 0 && !!selectedGrade; // Need learners AND grade
        case "assess":
          return selectedLearners.length > 0;
        case "summary":
          return true; // Can always review
        default:
          return false;
      }
    },
    [selectedFellow, selectedLearners, selectedGrade]
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
      selectedGrade,
      completion
    );
  }, [wizard.currentStep, canProceedFromStep, selectedFellow, selectedLearners, selectedGrade, completion]);

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
    setSelectedGrade("");
    setAssessments({});
    setEvidences({});
    setIsSubmitting(false);
    wizard.reset();
  }, [wizard]);

  // ==================== SUBMISSION METHOD ====================
  const submitAssessment = useCallback(async () => {
    if (!selectedFellow || selectedLearners.length === 0 || !term) {
      throw new Error("Missing required data for submission");
    }

    setIsSubmitting(true);
    try {
      // Format the assessment data for submission
      const assessmentData = {
        term,
        coachId: selectedCoach,
        fellowId: selectedFellow.id,
        grade: selectedGrade,
        learners: selectedLearners.map(learner => ({
          learnerId: learner.id,
          assessments: {
            motivation: assessments[keyFor(learner.id, "motivation")],
            teamwork: assessments[keyFor(learner.id, "teamwork")],
            analytical: assessments[keyFor(learner.id, "analytical")],
            curiosity: assessments[keyFor(learner.id, "curiosity")],
            leadership: assessments[keyFor(learner.id, "leadership")],
          },
          evidence: {
            motivation: evidences[eKeyFor(learner.id, "motivation")] || "",
            teamwork: evidences[eKeyFor(learner.id, "teamwork")] || "",
            analytical: evidences[eKeyFor(learner.id, "analytical")] || "",
            curiosity: evidences[eKeyFor(learner.id, "curiosity")] || "",
            leadership: evidences[eKeyFor(learner.id, "leadership")] || "",
          },
        })),
        submittedAt: new Date().toISOString(),
      };

      // TODO: Replace with actual API call
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      // On success, reset everything
      resetAll();
    } catch (error) {
      console.error('Submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [term, selectedCoach, selectedFellow, selectedLearners, selectedGrade, assessments, evidences, resetAll]);

  // ==================== CONTEXT VALUE ====================
  const value: AssessmentContextType = {
    // Core state
    term,
    selectedCoach,
    selectedFellow,
    selectedLearners,
    selectedGrade,
    assessments,
    evidences,

    // Wizard state
    currentStep: wizard.currentStep as StepKey,
    stepInfo,
    navigation,
    completion,

    // Submission state
    isSubmitting,

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
    setSelectedGrade,

    // Assessment methods
    setAssessments,
    setEvidences,
    updateAssessment,
    updateEvidence,
    getEvidence,
    clearEvidence,

    // Submission methods
    submitAssessment,

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