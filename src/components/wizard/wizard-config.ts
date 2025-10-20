// wizard-config.ts

import {
  CompletionStats,
  Learner,
  NavigationState,
  StepConfig,
  StepInfo,
} from "@/types";
import {
  LogIn,
  NotebookPen,
  Users,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

export type StepKey = "login" | "intro" | "learners" | "assess" | "summary";

export const WIZARD_CONFIG: Record<StepKey, StepConfig> = {
  login: {
    stepNumber: 1,
    title: "Sign In to Continue",
    description:
      "Use your registered email to access the Teach the Nation Learner Assessment portal.",
    primaryButton: "Login",
    showBackButton: false,
    isSubmitStep: false,
    icon: LogIn,
    meta: {
      label: "Login",
      desc: "Sign in using your official credentials.",
      shortLabel: "Login",
    },
  },

  intro: {
    stepNumber: 2,
    title: "Assessment Instructions",
    description:
      "Review the guidelines carefully before starting your learner observation.",
    primaryButton: "Begin",
    showBackButton: true,
    isSubmitStep: false,
    icon: NotebookPen,
    meta: {
      label: "Instructions",
      desc: "Review guidance before proceeding.",
      shortLabel: "Instructions",
    },
  },

  learners: {
    stepNumber: 3,
    title: "Select Learners",
    description:
      "Choose the classroom or group, then select the learners you'll assess during this observation.",
    primaryButton: "Continue to Assessment",
    showBackButton: true,
    isSubmitStep: false,
    icon: Users,
    meta: {
      label: "Learner Selection",
      desc: "Select the learners to assess.",
      shortLabel: "Learners",
    },
  },

  assess: {
    stepNumber: 4,
    title: "Assessment Centre",
    description:
      "Evaluate each learner using the competency rubrics provided. You can expand each category for details.",
    primaryButton: "Continue to Review",
    showBackButton: true,
    isSubmitStep: false,
    icon: ClipboardCheck,
    meta: {
      label: "Assessment",
      desc: "Complete rubric-based learner assessments.",
      shortLabel: "Assess",
    },
  },

  summary: {
    stepNumber: 5,
    title: "Review & Submit",
    description:
      "Review your completed assessments. Make any final edits before submission.",
    primaryButton: "Submit Assessment",
    showBackButton: true,
    isSubmitStep: true,
    icon: CheckCircle2,
    meta: {
      label: "Summary",
      desc: "Final review before submission.",
      shortLabel: "Submit",
    },
  },
} as const;

// Utility exports
export const STEPS = Object.keys(WIZARD_CONFIG) as StepKey[];

export const STEP_ICONS: Record<
  StepKey,
  React.ComponentType<{ className?: string }>
> = {
  login: LogIn,
  intro: NotebookPen,
  learners: Users,
  assess: ClipboardCheck,
  summary: CheckCircle2,
};

export const getStepConfig = (step: StepKey): StepConfig => WIZARD_CONFIG[step];

export const getTotalSteps = (): number => STEPS.length;
export const getStepIndex = (step: StepKey): number => STEPS.indexOf(step);
export const getStepByIndex = (index: number): StepKey => STEPS[index];
export const calculateProgress = (currentStep: StepKey): number => {
  const currentIndex = getStepIndex(currentStep);
  return ((currentIndex + 1) / STEPS.length) * 100;
};

export const isSubmitStep = (step: StepKey): boolean =>
  WIZARD_CONFIG[step].isSubmitStep;

// Navigation & metadata types

const generateStepInfo = (currentStep: StepKey): StepInfo => {
  const config = getStepConfig(currentStep);
  const index = getStepIndex(currentStep);
  return {
    config,
    isFirst: index === 0,
    isLast: index === STEPS.length - 1,
  };
};

// Generates dynamic navigation states
export const generateNavigationState = (
  currentStep: StepKey,
  canProceed: boolean,
  selectedLearners: Learner[],
  completion: CompletionStats
): NavigationState => {
  const { config, isFirst, isLast } = generateStepInfo(currentStep);
  const isOnSubmitStep = isSubmitStep(currentStep);

  const statusMessage = (() => {
    switch (currentStep) {
      case "login":
        return "Enter your credentials to access the portal.";
      case "intro":
        return "Review the instructions before proceeding.";
      case "learners":
        return selectedLearners.length
          ? `${selectedLearners.length} learner${
              selectedLearners.length !== 1 ? "s" : ""
            } selected`
          : "Select learners to continue.";
      case "assess":
        return `Assessment progress: ${completion.completionPercentage}% complete`;
      case "summary":
        return "Final review before submission.";
      default:
        return "";
    }
  })();

  return {
    canGoBack: !isFirst && config.showBackButton,
    canGoNext: canProceed && !isLast,
    canSubmit: isOnSubmitStep && canProceed,
    nextLabel: config.primaryButton,
    statusMessage,
  };
};
