// wizard-config.ts
import { 
  NotebookPen, 
  UserRoundSearch, 
  ClipboardCheck, 
  CheckCircle2 
} from "lucide-react";

export type StepKey = "intro" | "select" | "assess" | "summary";

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

export const WIZARD_CONFIG: Record<StepKey, StepConfig> = {
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

export const STEPS = Object.keys(WIZARD_CONFIG) as StepKey[];

export const STEP_ICONS: Record<StepKey, React.ComponentType<{ className?: string }>> = {
  intro: NotebookPen,
  select: UserRoundSearch,
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