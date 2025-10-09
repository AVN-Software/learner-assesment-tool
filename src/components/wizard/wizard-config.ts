// wizard-config.ts
import { 
  NotebookPen, 
  UserRoundSearch,
  Users,
  ClipboardCheck, 
  CheckCircle2 
} from "lucide-react";

export type StepKey = "intro" | "select" | "learners" | "assess" | "summary";

export interface StepConfig {
  stepNumber: number;
  title: string;
  description: string;
  primaryButton: string;
  showBackButton: boolean;
  isSubmitStep: boolean; // NEW: Indicates if this step triggers submission
  icon: React.ComponentType<{ className?: string }>;
  meta: {
    label: string;
    desc: string;
    shortLabel: string;
  };
}

export const WIZARD_CONFIG: Record<StepKey, StepConfig> = {
  intro: {
    stepNumber: 1,
    title: "Welcome to Learner Assessment",
    description: "Thank you for participating in our Conscious Leadership Development pilot program. Follow the steps below to complete your learner observation.",
    primaryButton: "Begin Assessment",
    showBackButton: false,
    isSubmitStep: false,
    icon: NotebookPen,
    meta: {
      label: "Instructions",
      desc: "Review assessment guidance before starting.",
      shortLabel: "Instructions",
    }
  },
  select: {
    stepNumber: 2,
    title: "Select Fellow & Verify", 
    description: "Choose the academic term, coach, and fellow you'll be assessing. Verify the fellow's email to continue.",
    primaryButton: "Continue to Learners",
    showBackButton: true,
    isSubmitStep: false,
    icon: UserRoundSearch,
    meta: {
      label: "Choose Fellow",
      desc: "Select and verify the fellow you're assessing.",
      shortLabel: "Fellow",
    }
  },
  learners: {
    stepNumber: 3,
    title: "Select Learners",
    description: "Choose the grade/classroom and select the specific learners you'll be assessing in this observation.",
    primaryButton: "Continue to Assessment",
    showBackButton: true,
    isSubmitStep: false,
    icon: Users,
    meta: {
      label: "Choose Learners",
      desc: "Select the learners for this assessment.",
      shortLabel: "Learners",
    }
  },
  assess: {
    stepNumber: 4,
    title: "Assess Learners",
    description: "Complete your assessment using the competency rubrics below. Click any competency header to view detailed indicators.",
    primaryButton: "Continue to Review",
    showBackButton: true,
    isSubmitStep: false,
    icon: ClipboardCheck,
    meta: {
      label: "Assess Learners",
      desc: "Complete the rubric and record tier ratings.",
      shortLabel: "Assess",
    }
  },
  summary: {
    stepNumber: 5,
    title: "Review & Submit",
    description: "Review your completed assessments and submit your observation. You can still make changes before final submission.",
    primaryButton: "Submit Assessment",
    showBackButton: true,
    isSubmitStep: true, // This is the submit step!
    icon: CheckCircle2,
    meta: {
      label: "Review & Submit",
      desc: "Check all entries before submitting.",
      shortLabel: "Submit",
    }
  },
} as const;

export const STEPS = Object.keys(WIZARD_CONFIG) as StepKey[];

export const STEP_ICONS: Record<StepKey, React.ComponentType<{ className?: string }>> = {
  intro: NotebookPen,
  select: UserRoundSearch,
  learners: Users,
  assess: ClipboardCheck,
  summary: CheckCircle2,
};

// Helper functions
export const getStepConfig = (step: StepKey): StepConfig => WIZARD_CONFIG[step];
export const getTotalSteps = (): number => STEPS.length;
export const getStepIndex = (step: StepKey): number => STEPS.indexOf(step);
export const getStepByIndex = (index: number): StepKey => STEPS[index];
export const calculateProgress = (currentStep: StepKey): number => {
  const currentIndex = getStepIndex(currentStep);
  return ((currentIndex + 1) / STEPS.length) * 100;
};

// Check if current step is a submit step
export const isSubmitStep = (step: StepKey): boolean => {
  return WIZARD_CONFIG[step].isSubmitStep;
};

// Types for navigation state
export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  canSubmit: boolean; // NEW: Indicates if submit is available
  nextLabel: string;
  statusMessage: string;
}

export interface CompletionStats {
  completionPercentage: number;
  totalCells?: number;
  completedCells?: number;
  missingEvidence?: number;
}

export interface Fellow {
  id: string;
  name: string;
  email: string;
  coachName: string;
  yearOfFellowship: string;
}

export interface Learner {
  id: string;
  name: string;
  fellowId: string;
  grade: string;
  subject: string;
  phase: string;
}

export interface StepInfo {
  config: StepConfig;
  isFirst: boolean;
  isLast: boolean;
}

// Generate step info
const generateStepInfo = (currentStep: StepKey): StepInfo => {
  const config = getStepConfig(currentStep);
  const currentIndex = getStepIndex(currentStep);
  
  return {
    config,
    isFirst: currentIndex === 0,
    isLast: currentIndex === STEPS.length - 1,
  };
};

// Generate navigation state
export const generateNavigationState = (
  currentStep: StepKey,
  canProceed: boolean,
  selectedFellow: Fellow | null,
  selectedLearners: Learner[],
  selectedGrade: string,
  completion: CompletionStats
): NavigationState => {
  const stepInfo = generateStepInfo(currentStep);
  const config = stepInfo.config;
  const isOnSubmitStep = isSubmitStep(currentStep);
  
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
    canSubmit: isOnSubmitStep && canProceed,
    nextLabel: config.primaryButton,
    statusMessage,
  };
};