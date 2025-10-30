import { useMemo, useCallback } from "react";
import { Step } from "@/types/assessment";
import {
  LogIn,
  NotebookPen,
  Users,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface StepConfig {
  stepNumber: number;
  title: string;
  description: string;
  primaryButton: string;
  showBackButton: boolean;
  isSubmitStep: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface WizardState {
  currentConfig: StepConfig;
  canGoBack: boolean;
  canGoNext: boolean;
  canSubmit: boolean;
  progress: number;
  statusMessage: string;
  isFirstStep: boolean;
  isLastStep: boolean;
  goNext: () => void;
  goBack: () => void;
}

interface UseWizardProps {
  currentStep: Step;
  canProceed: boolean;
  selectedLearnersCount: number;
  completionPercentage: number;
  mode: { type: "new" | "edit" } | null;
  goToStep: (step: Step) => void;
}

// ============================================================================
// STEP CONFIGURATIONS
// ============================================================================

const STEP_CONFIGS: Record<Step, StepConfig> = {
  login: {
    stepNumber: 1,
    title: "Fellow Login",
    description: "Sign in to access your learner assessments.",
    primaryButton: "Login",
    showBackButton: false,
    isSubmitStep: false,
    icon: LogIn,
    label: "Login",
  },
  intro: {
    stepNumber: 2,
    title: "Assessment Instructions",
    description: "Review the guidelines before starting your assessment.",
    primaryButton: "Begin Assessment",
    showBackButton: false,
    isSubmitStep: false,
    icon: NotebookPen,
    label: "Instructions",
  },
  selection: {
    stepNumber: 3,
    title: "Select Learners",
    description: "Choose learners for new assessments or edit existing ones.",
    primaryButton: "Start Assessment",
    showBackButton: true,
    isSubmitStep: false,
    icon: Users,
    label: "Selection",
  },
  assessment: {
    stepNumber: 4,
    title: "Assessment Center",
    description: "Evaluate each learner using the competency rubrics provided.",
    primaryButton: "Continue to Review",
    showBackButton: true,
    isSubmitStep: false,
    icon: ClipboardCheck,
    label: "Assessment",
  },
  review: {
    stepNumber: 5,
    title: "Review & Submit",
    description: "Review your completed assessments before final submission.",
    primaryButton: "Submit Assessment",
    showBackButton: true,
    isSubmitStep: true,
    icon: CheckCircle2,
    label: "Review",
  },
};

const STEPS: Step[] = ["login", "intro", "selection", "assessment", "review"];

// ============================================================================
// HOOK
// ============================================================================

export function useWizard({
  currentStep,
  canProceed,
  selectedLearnersCount,
  completionPercentage,
  mode,
  goToStep,
}: UseWizardProps): WizardState {
  const stepIndex = STEPS.indexOf(currentStep);
  const totalSteps = STEPS.length;
  const currentConfig = STEP_CONFIGS[currentStep];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  // Progress bar percentage
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  // Determine whether navigation buttons should be active
  const canGoBack = !isFirstStep && currentConfig.showBackButton;

  // ✅ Navigation rules per step:
  // - login/intro: always allow (free navigation)
  // - selection: allow if at least 1 learner selected
  // - assessment: allow if assessments are complete (canProceed)
  // - review: handled by canSubmit
  const canGoNext = useMemo(() => {
    if (isLastStep) return false;

    switch (currentStep) {
      case "login":
      case "intro":
        return true; // Free navigation
      case "selection":
        return selectedLearnersCount > 0; // At least 1 learner selected
      case "assessment":
        return canProceed; // All assessments complete
      default:
        return false;
    }
  }, [isLastStep, currentStep, selectedLearnersCount, canProceed]);

  const canSubmit = currentConfig.isSubmitStep && canProceed;

  // Navigation logic (centralized)
  const goNext = useCallback(() => {
    if (canGoNext) {
      goToStep(STEPS[stepIndex + 1]);
    }
  }, [canGoNext, stepIndex, goToStep]);

  const goBack = useCallback(() => {
    if (canGoBack) {
      goToStep(STEPS[stepIndex - 1]);
    }
  }, [canGoBack, stepIndex, goToStep]);

  // Status messages
  const statusMessage = useMemo(() => {
    switch (currentStep) {
      case "login":
        return "Enter your credentials to access the portal.";
      case "intro":
        return "Review the instructions before proceeding.";
      case "selection":
        if (mode?.type === "edit") return "Editing existing assessment";
        return selectedLearnersCount > 0
          ? `${selectedLearnersCount} learner${
              selectedLearnersCount !== 1 ? "s" : ""
            } selected`
          : "Select learners to continue.";
      case "assessment":
        return `Assessment progress: ${completionPercentage}% complete`;
      case "review":
        return "Final review before submission.";
      default:
        return "";
    }
  }, [currentStep, selectedLearnersCount, completionPercentage, mode]);

  return {
    currentConfig,
    canGoBack,
    canGoNext,
    canSubmit,
    progress,
    statusMessage,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export { STEP_CONFIGS, STEPS };
export type { StepConfig, WizardState };
