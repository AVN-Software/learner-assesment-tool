"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { useData } from "@/providers/DataProvider";
import {
  CompetencyId,
  CompetencyDraft,
  AssessmentDraft,
  AssessmentMode,
  CompletionStats,
  Step,
} from "@/types/assessment";

// ============================================================================
// TYPES
// ============================================================================

interface AssessmentContextType {
  currentStep: Step;
  goToStep: (step: Step) => void;
  mode: AssessmentMode;
  selectedLearners: string[];
  toggleLearnerSelection: (learnerId: string) => void;
  clearSelection: () => void;

  assessmentDrafts: AssessmentDraft[];
  getAssessmentDraft: (learnerId: string) => AssessmentDraft | undefined;
  updateCompetency: (
    learnerId: string,
    competencyId: CompetencyId,
    data: Partial<CompetencyDraft>
  ) => void;
  getCompetency: (
    learnerId: string,
    competencyId: CompetencyId
  ) => CompetencyDraft | null;

  isComplete: boolean;
  completionStats: CompletionStats;
  canProceedToReview: () => boolean;

  initializeNewAssessment: (learnerIds: string[]) => void;
  loadAssessmentForEdit: (
    learnerId: string,
    assessmentId: string
  ) => Promise<void>;
  submitAssessments: () => Promise<boolean>;
  resetAssessment: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export const useAssessment = (): AssessmentContextType => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};

// ============================================================================
// PROVIDER
// ============================================================================

interface AssessmentProviderProps {
  children: ReactNode;
}

export function AssessmentProvider({ children }: AssessmentProviderProps) {
  const supabase = createClient();
  const { fellowData, refreshLearnerStatus } = useData();

  const [currentStep, setCurrentStep] = useState<Step>("login");
  const [mode, setMode] = useState<AssessmentMode>(null);
  const [selectedLearners, setSelectedLearners] = useState<string[]>([]);
  const [assessmentDrafts, setAssessmentDrafts] = useState<AssessmentDraft[]>(
    []
  );

  // Navigation
  const goToStep = useCallback((step: Step) => setCurrentStep(step), []);

  // Learner selection
  const toggleLearnerSelection = useCallback((learnerId: string) => {
    setSelectedLearners((prev) =>
      prev.includes(learnerId)
        ? prev.filter((id) => id !== learnerId)
        : [...prev, learnerId]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLearners([]);
    setAssessmentDrafts([]);
    setMode(null);
  }, []);

  // Initialize new assessment drafts
  const initializeNewAssessment = useCallback(
    (learnerIds: string[]) => {
      if (!fellowData) return;

      const drafts: AssessmentDraft[] = learnerIds.map((learnerId) => {
        const learner = fellowData.learners.find(
          (l) => l.learnerId === learnerId
        );
        return {
          learnerId,
          learnerName: learner?.learnerName || "",
          motivation: { tierScore: null, evidence: "" },
          teamwork: { tierScore: null, evidence: "" },
          analytical: { tierScore: null, evidence: "" },
          curiosity: { tierScore: null, evidence: "" },
          leadership: { tierScore: null, evidence: "" },
        };
      });

      setAssessmentDrafts(drafts);
      setMode({ type: "new", learnerIds });
    },
    [fellowData]
  );

  // Load existing assessment for edit
  const loadAssessmentForEdit = useCallback(
    async (learnerId: string, assessmentId: string) => {
      if (!fellowData) return;

      try {
        const { data: assessment, error } = await supabase
          .from("ll_tool_assessments")
          .select("*")
          .eq("id", assessmentId)
          .single();

        if (error) throw error;

        const learner = fellowData.learners.find(
          (l) => l.learnerId === learnerId
        );

        const draft: AssessmentDraft = {
          learnerId,
          learnerName: learner?.learnerName || assessment.learner_name,
          motivation: {
            tierScore: assessment.motivation_tier,
            evidence: assessment.motivation_evidence || "",
          },
          teamwork: {
            tierScore: assessment.teamwork_tier,
            evidence: assessment.teamwork_evidence || "",
          },
          analytical: {
            tierScore: assessment.analytical_tier,
            evidence: assessment.analytical_evidence || "",
          },
          curiosity: {
            tierScore: assessment.curiosity_tier,
            evidence: assessment.curiosity_evidence || "",
          },
          leadership: {
            tierScore: assessment.leadership_tier,
            evidence: assessment.leadership_evidence || "",
          },
        };

        setAssessmentDrafts([draft]);
        setSelectedLearners([learnerId]);
        setMode({ type: "edit", learnerId, assessmentId });
      } catch (err) {
        console.error("Error loading assessment for edit:", err);
      }
    },
    [fellowData, supabase]
  );

  // Competency accessors
  const getAssessmentDraft = useCallback(
    (learnerId: string) =>
      assessmentDrafts.find((draft) => draft.learnerId === learnerId),
    [assessmentDrafts]
  );

  const getCompetency = useCallback(
    (learnerId: string, competencyId: CompetencyId): CompetencyDraft | null => {
      const draft = assessmentDrafts.find((d) => d.learnerId === learnerId);
      return draft ? draft[competencyId] : null;
    },
    [assessmentDrafts]
  );

  const updateCompetency = useCallback(
    (
      learnerId: string,
      competencyId: CompetencyId,
      data: Partial<CompetencyDraft>
    ) => {
      setAssessmentDrafts((prev) =>
        prev.map((draft) =>
          draft.learnerId === learnerId
            ? {
                ...draft,
                [competencyId]: { ...draft[competencyId], ...data },
              }
            : draft
        )
      );
    },
    []
  );

  // Completion logic
  const isComplete = useMemo(() => {
    if (assessmentDrafts.length === 0) return false;

    return assessmentDrafts.every((draft) =>
      ["motivation", "teamwork", "analytical", "curiosity", "leadership"].every(
        (id) => {
          const comp = draft[id as CompetencyId];
          return comp.tierScore !== null && comp.evidence.trim() !== "";
        }
      )
    );
  }, [assessmentDrafts]);

  const completionStats = useMemo((): CompletionStats => {
    const totalLearners = assessmentDrafts.length;
    const completedLearners = assessmentDrafts.filter((draft) =>
      ["motivation", "teamwork", "analytical", "curiosity", "leadership"].every(
        (id) => {
          const c = draft[id as CompetencyId];
          return c.tierScore !== null && c.evidence.trim() !== "";
        }
      )
    ).length;

    const completionPercentage =
      totalLearners === 0
        ? 0
        : Math.round((completedLearners / totalLearners) * 100);

    return {
      totalLearners,
      completedLearners,
      completionPercentage,
      totalCells: totalLearners * 5,
      completedCells: completedLearners * 5,
      missingEvidence: totalLearners * 5 - completedLearners * 5,
    };
  }, [assessmentDrafts]);

  const canProceedToReview = useCallback(() => isComplete, [isComplete]);

  // Submit logic (INSERT or UPDATE)
  const submitAssessments = useCallback(async () => {
    if (!fellowData || !isComplete) return false;

    try {
      const now = new Date().toISOString();

      if (mode?.type === "edit") {
        // Update single record
        const draft = assessmentDrafts[0];
        const { error } = await supabase
          .from("ll_tool_assessments")
          .update({
            motivation_tier: draft.motivation.tierScore,
            motivation_evidence: draft.motivation.evidence,
            teamwork_tier: draft.teamwork.tierScore,
            teamwork_evidence: draft.teamwork.evidence,
            analytical_tier: draft.analytical.tierScore,
            analytical_evidence: draft.analytical.evidence,
            curiosity_tier: draft.curiosity.tierScore,
            curiosity_evidence: draft.curiosity.evidence,
            leadership_tier: draft.leadership.tierScore,
            leadership_evidence: draft.leadership.evidence,
            date_modified: now,
          })
          .eq("id", mode.assessmentId);

        if (error) throw error;
      } else {
        // Insert new assessments
        const assessmentsToInsert = assessmentDrafts.map((draft) => ({
          fellow_id: fellowData.fellowId,
          fellow_name: fellowData.fellowName,
          learner_id: draft.learnerId,
          learner_name: draft.learnerName,
          grade: fellowData.grade,
          phase: fellowData.phase,
          date_created: now,
          motivation_tier: draft.motivation.tierScore,
          motivation_evidence: draft.motivation.evidence,
          teamwork_tier: draft.teamwork.tierScore,
          teamwork_evidence: draft.teamwork.evidence,
          analytical_tier: draft.analytical.tierScore,
          analytical_evidence: draft.analytical.evidence,
          curiosity_tier: draft.curiosity.tierScore,
          curiosity_evidence: draft.curiosity.evidence,
          leadership_tier: draft.leadership.tierScore,
          leadership_evidence: draft.leadership.evidence,
        }));

        const { error } = await supabase
          .from("ll_tool_assessments")
          .insert(assessmentsToInsert);

        if (error) throw error;
      }

      await refreshLearnerStatus();
      resetAssessment();
      return true;
    } catch (err) {
      console.error("Error submitting assessments:", err);
      return false;
    }
  }, [
    fellowData,
    isComplete,
    mode,
    assessmentDrafts,
    supabase,
    refreshLearnerStatus,
  ]);

  // Reset
  const resetAssessment = useCallback(() => {
    setCurrentStep("intro");
    setMode(null);
    setSelectedLearners([]);
    setAssessmentDrafts([]);
  }, []);

  // Context value
  const value: AssessmentContextType = {
    currentStep,
    goToStep,
    mode,
    selectedLearners,
    toggleLearnerSelection,
    clearSelection,
    assessmentDrafts,
    getAssessmentDraft,
    updateCompetency,
    getCompetency,
    isComplete,
    completionStats,
    canProceedToReview,
    initializeNewAssessment,
    loadAssessmentForEdit,
    submitAssessments,
    resetAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}
