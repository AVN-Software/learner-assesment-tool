"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
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
export type Grade =
  | "R"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

export const GRADES: Grade[] = [
  "R",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

export const GRADE_LABELS: Record<Grade, string> = {
  R: "Grade R",
  1: "Grade 1",
  2: "Grade 2",
  3: "Grade 3",
  4: "Grade 4",
  5: "Grade 5",
  6: "Grade 6",
  7: "Grade 7",
  8: "Grade 8",
  9: "Grade 9",
  10: "Grade 10",
  11: "Grade 11",
  12: "Grade 12",
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
  if (["R", "1", "2", "3"].includes(grade)) return "Foundation";
  if (["4", "5", "6"].includes(grade)) return "Intermediate";
  if (["7", "8", "9"].includes(grade)) return "Senior";
  return "FET";
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
  config: (typeof WIZARD_CONFIG)[StepKey];
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
  isFellowVerified: boolean; // ✅ NEW
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
  setIsFellowVerified: (verified: boolean) => void; // ✅ NEW
  setSelectedLearners: (learners: Learner[]) => void;
  setSelectedGrade: (grade: Grade | "") => void;

  // ==================== ASSESSMENT METHODS ====================
  setAssessments: (assessments: AssessmentMap) => void;
  setEvidences: (evidences: EvidenceMap) => void;
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

  // ==================== SUBMISSION METHODS ====================
  submitAssessment: () => Promise<void>;

  // ==================== UTILITY METHODS ====================
  resetAssessmentState: () => void;
  resetAll: () => void;
}

/* ================================
   STEP HELPERS
================================ */
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
  const [isFellowVerified, setIsFellowVerified] = useState<boolean>(false); // ✅ NEW
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
          return true;
        case "select":
          return !!selectedFellow && isFellowVerified; // ✅ Require verified fellow
        case "learners":
          return selectedLearners.length > 0 && !!selectedGrade;
        case "assess":
          return selectedLearners.length > 0;
        case "summary":
          return true;
        default:
          return false;
      }
    },
    [selectedFellow, isFellowVerified, selectedLearners, selectedGrade]
  );

  // ==================== WIZARD HOOK ====================
  const wizard = useWizard({
    steps: STEPS,
    initialStep: "intro",
  });

  // ==================== COMPLETION STATS ====================
  const completion = useMemo<CompletionStats>(() => {
    const COMP_COUNT = 5;
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
          completedCells++;
          if (!evidences[evidenceKey]?.trim()) missingEvidence++;
        }
      }
    }

    const completionPercentage =
      totalCells === 0 ? 0 : Math.round((completedCells / totalCells) * 100);

    return { totalCells, completedCells, missingEvidence, completionPercentage };
  }, [selectedLearners, assessments, evidences]);

  // ==================== DERIVED STATE ====================
  const stepInfo = useMemo(() => generateStepInfo(wizard.currentStep as StepKey), [wizard.currentStep]);

  const navigation = useMemo(() => {
    const canProceed = canProceedFromStep(wizard.currentStep as StepKey);
    return {
      canGoBack: !stepInfo.isFirst && stepInfo.config.showBackButton,
      canGoNext: canProceed && !stepInfo.isLast,
      nextLabel: stepInfo.config.primaryButton,
      statusMessage: "",
    };
  }, [wizard.currentStep, canProceedFromStep, stepInfo]);

  // ==================== RESET METHODS ====================
  const resetAssessmentState = useCallback(() => {
    setAssessments({});
    setEvidences({});
  }, []);

  const resetAll = useCallback(() => {
    setTerm("");
    setSelectedCoach("");
    setSelectedFellow(null);
    setIsFellowVerified(false); // ✅ Reset verification
    setSelectedLearners([]);
    setSelectedGrade("");
    setAssessments({});
    setEvidences({});
    setIsSubmitting(false);
    wizard.reset();
  }, [wizard]);

  // ==================== CONTEXT VALUE ====================
  const value: AssessmentContextType = {
    term,
    selectedCoach,
    selectedFellow,
    isFellowVerified, // ✅
    selectedLearners,
    selectedGrade,
    assessments,
    evidences,
    currentStep: wizard.currentStep as StepKey,
    stepInfo,
    navigation,
    completion,
    isSubmitting,
    goToStep: wizard.goToStep,
    nextStep: wizard.goToNext,
    previousStep: wizard.goToPrevious,
    resetStepper: wizard.reset,
    setTerm,
    setSelectedCoach,
    setSelectedFellow,
    setIsFellowVerified, // ✅
    setSelectedLearners,
    setSelectedGrade,
    setAssessments,
    setEvidences,
    updateAssessment: (id, comp, tier) =>
      setAssessments((prev) => ({ ...prev, [keyFor(id, comp)]: tier })),
    updateEvidence: (id, comp, text) =>
      setEvidences((prev) => ({ ...prev, [eKeyFor(id, comp)]: text })),
    getEvidence: (id, comp) => evidences[eKeyFor(id, comp)] ?? "",
    clearEvidence: (id, comp) =>
      setEvidences((prev) => {
        const { [eKeyFor(id, comp)]: _, ...rest } = prev;
        return rest;
      }),
    submitAssessment: async () => {},
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
  if (!ctx) throw new Error("useAssessment() must be used within <AssessmentProvider>");
  return ctx;
};
