"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useData } from "./DataProvider"; // Adjust path as needed
import {
  CompetencyAssessment,
  CompetencyId,
  Grade,
  Phase,
  Learner,
  StepConfig,
  NavigationState,
  CompletionStats,
} from "@/types";
import {
  STEPS,
  type StepKey,
  getStepConfig,
  getStepIndex,
  calculateProgress,
  generateNavigationState,
} from "@/components/wizard/wizard-config";

/* ----------------------------------------------------------------------------
   Assessment Data Types (V2 Structure)
---------------------------------------------------------------------------- */
export type LearnerAssessment = {
  learner_id: string;
  fellow_id: string;
  term: number;
  grade: Grade;
  phase: Phase;
  motivation: CompetencyAssessment | null;
  teamwork: CompetencyAssessment | null;
  analytical: CompetencyAssessment | null;
  curiosity: CompetencyAssessment | null;
  leadership: CompetencyAssessment | null;
};

/* ----------------------------------------------------------------------------
   Context Type
---------------------------------------------------------------------------- */
interface AssessmentContextType {
  // ==================== WIZARD STATE ====================
  currentStep: StepKey;
  stepInfo: {
    current: StepKey;
    index: number;
    total: number;
    isFirst: boolean;
    isLast: boolean;
    progress: number;
    config: StepConfig;
  };
  navigation: NavigationState;

  // ==================== SELECTION STATE ====================
  selectedTerm: number | null;
  selectedGrade: Grade | "";
  selectedPhase: Phase | "";
  selectedLearners: Learner[];

  // ==================== ASSESSMENT DATA ====================
  assessments: Record<string, LearnerAssessment>;

  // ==================== COMPLETION STATE ====================
  completion: CompletionStats;
  isComplete: boolean;

  // ==================== WIZARD ACTIONS ====================
  goToStep: (step: StepKey) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetToStart: () => void;

  // ==================== SELECTION ACTIONS ====================
  setSelectedTerm: (term: number | null) => void;
  setSelectedGrade: (grade: Grade | "") => void;
  setSelectedPhase: (phase: Phase | "") => void;
  setSelectedLearners: (learners: Learner[]) => void;
  toggleLearnerSelection: (learnerId: string) => void;

  // ==================== ASSESSMENT ACTIONS ====================
  updateCompetency: (
    learnerId: string,
    competencyId: CompetencyId,
    data: Partial<CompetencyAssessment>
  ) => void;
  getCompetency: (
    learnerId: string,
    competencyId: CompetencyId
  ) => CompetencyAssessment | null;

  // ==================== BUSINESS LOGIC ====================
  availableTerms: number[];
  canSelectForTerm: (learnerId: string, term: number) => boolean;
  getTermStatus: (
    term: number,
    learnerId: string
  ) => { status: "na" | "completed" | "pending" | "not-started" };
}

/* ----------------------------------------------------------------------------
   Context
---------------------------------------------------------------------------- */
const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

/* ----------------------------------------------------------------------------
   Provider Component
---------------------------------------------------------------------------- */
interface AssessmentProviderProps {
  children: React.ReactNode;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({
  children,
}) => {
  // ==================== DATA FROM DATAPROVIDER ====================
  const { fellow, learners: availableLearners } = useData();

  // ==================== WIZARD STATE ====================
  const [currentStep, setCurrentStep] = useState<StepKey>("login");

  // ==================== SELECTION STATE ====================
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | "">("");
  const [selectedPhase, setSelectedPhase] = useState<Phase | "">("");
  const [selectedLearners, setSelectedLearners] = useState<Learner[]>([]);

  // ==================== ASSESSMENT STATE ====================
  const [assessments, setAssessments] = useState<
    Record<string, LearnerAssessment>
  >({});

  // ==================== AUTO-NAVIGATE BASED ON AUTH ====================
  useEffect(() => {
    if (fellow && currentStep === "login") {
      setCurrentStep("intro");
    } else if (!fellow && currentStep !== "login") {
      setCurrentStep("login");
    }
  }, [fellow, currentStep]);

  // ==================== PHASE DERIVATION ====================
  const derivePhaseFromGrade = useCallback((grade: string): Phase | "" => {
    if (["Grade R", "Grade 1", "Grade 2", "Grade 3"].includes(grade))
      return "Foundation";
    if (["Grade 4", "Grade 5", "Grade 6"].includes(grade))
      return "Intermediate";
    if (["Grade 7", "Grade 8", "Grade 9"].includes(grade)) return "Senior";
    if (["Grade 10", "Grade 11", "Grade 12"].includes(grade)) return "FET";
    return "";
  }, []);

  useEffect(() => {
    setSelectedPhase(derivePhaseFromGrade(selectedGrade));
  }, [selectedGrade, derivePhaseFromGrade]);

  // ==================== BUSINESS LOGIC ====================
  const availableTerms = useMemo(() => {
    if (!fellow?.onboarding_term) return [];
    return [1, 2, 3, 4].filter((t) => t >= (fellow.onboarding_term ?? 1));
  }, [fellow?.onboarding_term]);

  const getTermStatus = useCallback(
    (term: number, learnerId: string) => {
      const learner = availableLearners.find((l) => l.id === learnerId);
      if (!learner || !fellow?.onboarding_term)
        return { status: "not-started" as const };

      if (term < fellow.onboarding_term) return { status: "na" as const };

      const assessmentKey = `term${term}_assessment_id` as keyof typeof learner;
      const assessmentId = learner[assessmentKey];
      if (assessmentId) return { status: "completed" as const };

      return { status: "pending" as const };
    },
    [availableLearners, fellow?.onboarding_term]
  );

  const canSelectForTerm = useCallback(
    (learnerId: string, term: number) => {
      const status = getTermStatus(term, learnerId);
      return status.status === "pending";
    },
    [getTermStatus]
  );

  // ==================== COMPLETION CALCULATION ====================
  const isComplete = useMemo(() => {
    if (selectedLearners.length === 0) return false;

    return selectedLearners.every((learner) => {
      const assessment = assessments[learner.id];
      if (!assessment) return false;

      const competencies: CompetencyId[] = [
        "motivation",
        "teamwork",
        "analytical",
        "curiosity",
        "leadership",
      ];

      return competencies.every((compId) => {
        const competency = assessment[compId];
        return competency?.tier_score && competency?.evidence?.trim();
      });
    });
  }, [selectedLearners, assessments]);

  // ==================== STEP VALIDATION ====================
  const canProceedFromStep = useCallback(
    (step: StepKey): boolean => {
      switch (step) {
        case "login":
          return !!fellow;
        case "intro":
          return true;
        case "learners":
          return (
            selectedLearners.length > 0 && !!selectedGrade && !!selectedTerm
          );
        case "assess":
          return selectedLearners.length > 0;
        case "summary":
          return isComplete;
        default:
          return false;
      }
    },
    [fellow, selectedLearners, selectedGrade, selectedTerm, isComplete]
  );

  const completionStats = useMemo(() => {
    const totalLearners = selectedLearners.length;
    let completedLearners = 0;

    selectedLearners.forEach((learner) => {
      const assessment = assessments[learner.id];
      if (!assessment) return;

      const competencies: CompetencyId[] = [
        "motivation",
        "teamwork",
        "analytical",
        "curiosity",
        "leadership",
      ];

      const isLearnerComplete = competencies.every((compId) => {
        const competency = assessment[compId];
        return competency?.tier_score && competency?.evidence?.trim();
      });

      if (isLearnerComplete) completedLearners++;
    });

    const completionPercentage =
      totalLearners === 0
        ? 0
        : Math.round((completedLearners / totalLearners) * 100);

    return {
      totalLearners,
      completedLearners,
      completionPercentage,
      totalCells: selectedLearners.length * 5,
      completedCells: completedLearners * 5,
      missingEvidence: totalLearners * 5 - completedLearners * 5,
    };
  }, [selectedLearners, assessments]);

  // ==================== STEP INFO & NAVIGATION ====================
  const stepInfo = useMemo(() => {
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
  }, [currentStep]);

  const navigation = useMemo(
    () =>
      generateNavigationState(
        currentStep,
        canProceedFromStep(currentStep),
        selectedLearners,
        completionStats
      ),
    [currentStep, canProceedFromStep, selectedLearners, completionStats]
  );

  // ==================== WIZARD ACTIONS ====================
  const goToStep = useCallback((step: StepKey) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < STEPS.length - 1 && canProceedFromStep(currentStep)) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  }, [currentStep, canProceedFromStep]);

  const prevStep = useCallback(() => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  }, [currentStep]);

  const resetToStart = useCallback(() => {
    setCurrentStep("login");
    setSelectedTerm(null);
    setSelectedGrade("");
    setSelectedPhase("");
    setSelectedLearners([]);
    setAssessments({});
  }, []);

  // ==================== SELECTION ACTIONS ====================
  const handleSetSelectedLearners = useCallback((learners: Learner[]) => {
    setSelectedLearners(learners);

    // Remove assessment data for deselected learners
    setAssessments((prev) => {
      const newAssessments = { ...prev };
      Object.keys(newAssessments).forEach((learnerId) => {
        if (!learners.find((l) => l.id === learnerId)) {
          delete newAssessments[learnerId];
        }
      });
      return newAssessments;
    });
  }, []);

  const handleToggleLearnerSelection = useCallback(
    (learnerId: string) => {
      setSelectedLearners((prev) => {
        const isSelected = prev.some((l) => l.id === learnerId);
        const learner = availableLearners.find((l) => l.id === learnerId);

        if (!learner) return prev;

        const learnerInfo: Learner = {
          fellow_id: learner.fellow_id,
          id: learner.id,
          learner_name: learner.learner_name,
        };

        if (isSelected) {
          // Remove learner and their assessments
          setAssessments((prevAssessments) => {
            const { [learnerId]: _, ...rest } = prevAssessments;
            return rest;
          });
          return prev.filter((l) => l.id !== learnerId);
        } else {
          return [...prev, learnerInfo];
        }
      });
    },
    [availableLearners]
  );

  // ==================== ASSESSMENT ACTIONS ====================
  const updateCompetency = useCallback(
    (
      learnerId: string,
      competencyId: CompetencyId,
      data: Partial<CompetencyAssessment>
    ) => {
      if (!fellow || !selectedTerm || !selectedGrade || !selectedPhase) return;

      setAssessments((prev) => {
        const learnerAssessment = prev[learnerId];

        // Initialize learner assessment if it doesn't exist
        if (!learnerAssessment) {
          return {
            ...prev,
            [learnerId]: {
              learner_id: learnerId,
              fellow_id: fellow.id,
              term: selectedTerm,
              grade: selectedGrade,
              phase: selectedPhase,
              motivation: null,
              teamwork: null,
              analytical: null,
              curiosity: null,
              leadership: null,
              [competencyId]: {
                tier_score: data.tier_score ?? 1,
                evidence: data.evidence ?? "",
              },
            },
          };
        }

        const currentCompetency = learnerAssessment[competencyId];

        return {
          ...prev,
          [learnerId]: {
            ...learnerAssessment,
            [competencyId]: {
              tier_score: data.tier_score ?? currentCompetency?.tier_score ?? 1,
              evidence: data.evidence ?? currentCompetency?.evidence ?? "",
            },
          },
        };
      });
    },
    [fellow, selectedTerm, selectedGrade, selectedPhase]
  );

  const getCompetency = useCallback(
    (
      learnerId: string,
      competencyId: CompetencyId
    ): CompetencyAssessment | null => {
      return assessments[learnerId]?.[competencyId] ?? null;
    },
    [assessments]
  );

  // ==================== CONTEXT VALUE ====================
  const value: AssessmentContextType = {
    // Wizard State
    currentStep,
    stepInfo,
    navigation,

    // Selection State
    selectedTerm,
    selectedGrade,
    selectedPhase,
    selectedLearners,

    // Assessment Data
    assessments,

    // Completion State
    completion: completionStats,
    isComplete,

    // Wizard Actions
    goToStep,
    nextStep,
    prevStep,
    resetToStart,

    // Selection Actions
    setSelectedTerm,
    setSelectedGrade,
    setSelectedPhase: (phase: Phase | "") => setSelectedPhase(phase),
    setSelectedLearners: handleSetSelectedLearners,
    toggleLearnerSelection: handleToggleLearnerSelection,

    // Assessment Actions
    updateCompetency,
    getCompetency,

    // Business Logic
    availableTerms,
    canSelectForTerm,
    getTermStatus,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

/* ----------------------------------------------------------------------------
   Hook
---------------------------------------------------------------------------- */
export const useAssessment = (): AssessmentContextType => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};
