// steps-config.ts
import { 
  NotebookPen, 
  UserRoundSearch, 
  ClipboardCheck, 
  CheckCircle2 
} from "lucide-react";

/* ================================
   CORE TYPES
================================ */
export type Step = "intro" | "select" | "assess" | "summary";

export interface StepConfig {
  stepNumber: number;
  title: string;
  description: string;
  primaryButton: string;
  showBackButton: boolean;
  icon: React.ComponentType<{ className?: string }>;
  meta: {
    label: string;
    desc: string;
    shortLabel: string;
  };
}

export interface StepInfo {
  current: Step;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  config: StepConfig;
}

export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  nextLabel: string;
  statusMessage: string;
}

/* ================================
   STEP CONFIGURATION
================================ */
export const STEP_CONFIG: Record<Step, StepConfig> = {
  intro: {
    stepNumber: 1,
    title: "Welcome to Learner Assessment",
    description: "Thank you for participating in our Conscious Leadership Development pilot program. Follow the steps below to complete your learner observation.",
    primaryButton: "Begin Assessment",
    showBackButton: false,
    icon: NotebookPen,
    meta: {
      label: "Instructions",
      desc: "Review assessment guidance before starting.",
      shortLabel: "Instructions",
    }
  },
  select: {
    stepNumber: 2,
    title: "Select Fellow & Learners", 
    description: "Choose the academic term, coach, fellow, and specific learners you'll be assessing in this observation.",
    primaryButton: "Continue to Assessment",
    showBackButton: true,
    icon: UserRoundSearch,
    meta: {
      label: "Choose Fellow",
      desc: "Select the fellow and class you're assessing.",
      shortLabel: "Select",
    }
  },
  assess: {
    stepNumber: 3,
    title: "Assess Learners",
    description: "Complete your assessment using the competency rubrics below. Click any competency header to view detailed indicators.",
    primaryButton: "Continue to Review",
    showBackButton: true,
    icon: ClipboardCheck,
    meta: {
      label: "Assess Learners",
      desc: "Complete the rubric and record tier ratings.",
      shortLabel: "Assess",
    }
  },
  summary: {
    stepNumber: 4,
    title: "Review & Submit",
    description: "Review your completed assessments and submit your observation. You can still make changes before final submission.",
    primaryButton: "Submit Assessment",
    showBackButton: true,
    icon: CheckCircle2,
    meta: {
      label: "Review & Submit",
      desc: "Check all entries before submitting.",
      shortLabel: "Submit",
    }
  },
} as const;

/* ================================
   CONSTANTS
================================ */
export const STEPS = Object.keys(STEP_CONFIG) as Step[];
export const STEP_ICONS: Record<Step, React.ComponentType<{ className?: string }>> = {
  intro: NotebookPen,
  select: UserRoundSearch,
  assess: ClipboardCheck,
  summary: CheckCircle2,
};

/* ================================
   HELPER FUNCTIONS
================================ */
export const getStepConfig = (step: Step): StepConfig => STEP_CONFIG[step];

export const getTotalSteps = (): number => STEPS.length;

export const getStepIndex = (step: Step): number => STEPS.indexOf(step);

export const getStepByIndex = (index: number): Step => STEPS[index];

export const getNextStep = (currentStep: Step): Step | null => {
  const currentIndex = getStepIndex(currentStep);
  return currentIndex < STEPS.length - 1 ? STEPS[currentIndex + 1] : null;
};

export const getPreviousStep = (currentStep: Step): Step | null => {
  const currentIndex = getStepIndex(currentStep);
  return currentIndex > 0 ? STEPS[currentIndex - 1] : null;
};

export const calculateProgress = (currentStep: Step): number => {
  const currentIndex = getStepIndex(currentStep);
  return ((currentIndex + 1) / STEPS.length) * 100;
};

export const canGoToStep = (fromStep: Step, toStep: Step): boolean => {
  const fromIndex = getStepIndex(fromStep);
  const toIndex = getStepIndex(toStep);
  return toIndex <= fromIndex; // Can only go to previous steps, not future ones
};

export const generateStepInfo = (currentStep: Step): StepInfo => {
  const index = getStepIndex(currentStep);
  const total = getTotalSteps();
  
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

export const generateNavigationState = (
  currentStep: Step,
  canProceed: boolean,
  selectedFellow: any,
  selectedLearners: any[],
  completion: any
): NavigationState => {
  const stepInfo = generateStepInfo(currentStep);
  const config = stepInfo.config;
  
  const statusMessage = (() => {
    switch (currentStep) {
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
        const pct = completion?.completionPercentage || 0;
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
    canGoBack: !stepInfo.isFirst,
    canGoNext: canProceed && !stepInfo.isLast,
    nextLabel: config.primaryButton,
    statusMessage,
  };
};