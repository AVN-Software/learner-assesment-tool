"use client";

import React, { JSX } from "react";
import {
  NotebookPen,
  UserRoundSearch,
  Users,
  ClipboardCheck,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";

import type { StepKey } from "@/types";
import { useAssessment } from "@/context/AssessmentProvider";

import StepHeader from "./StepHeader";
import StepContent from "./StepContent";
import StepFooter from "./StepFooter";
import Navigation from "../wizard/Navigation";

import Instructions from "../steps/Instructions";
import FellowSelectionStep from "../steps/FellowSelection";
import LearnerSelectionStep from "../steps/LearnerSelectionStep";
import AssessmentStep from "../steps/AssessmentStep";
import SubmissionSummary from "../steps/SubmissionSummary";

/* ===========================================================================
   🧭 STEP CONFIGURATION
=========================================================================== */

interface StepConfig {
  readonly stepNumber: number;
  readonly title: string;
  readonly description: string;
  readonly primaryButton: string;
  readonly showBackButton: boolean;
  readonly isSubmitStep: boolean;
  readonly icon: LucideIcon;
  readonly meta: {
    readonly label: string;
    readonly desc: string;
    readonly shortLabel: string;
  };
}

const WIZARD_CONFIG: Readonly<Record<StepKey, StepConfig>> = {
  intro: {
    stepNumber: 1,
    title: "Welcome to Learner Assessment",
    description:
      "Follow the steps below to complete your learner observation and competency ratings.",
    primaryButton: "Begin Assessment",
    showBackButton: false,
    isSubmitStep: false,
    icon: NotebookPen,
    meta: {
      label: "Instructions",
      desc: "Review guidance before starting.",
      shortLabel: "Instructions",
    },
  },
  select: {
    stepNumber: 2,
    title: "Select Fellow & Verify",
    description:
      "Choose the fellow you’ll be assessing and verify their details before proceeding.",
    primaryButton: "Continue to Learners",
    showBackButton: true,
    isSubmitStep: false,
    icon: UserRoundSearch,
    meta: {
      label: "Choose Fellow",
      desc: "Select and verify the fellow you're assessing.",
      shortLabel: "Fellow",
    },
  },
  learners: {
    stepNumber: 3,
    title: "Select Learners",
    description:
      "Choose the grade/classroom and select the specific learners for this observation.",
    primaryButton: "Continue to Assessment",
    showBackButton: true,
    isSubmitStep: false,
    icon: Users,
    meta: {
      label: "Choose Learners",
      desc: "Select the learners for this assessment.",
      shortLabel: "Learners",
    },
  },
  assess: {
    stepNumber: 4,
    title: "Assess Learners",
    description:
      "Complete your assessment using the competency rubrics. Click any competency header to view indicators.",
    primaryButton: "Continue to Review",
    showBackButton: true,
    isSubmitStep: false,
    icon: ClipboardCheck,
    meta: {
      label: "Assess Learners",
      desc: "Complete the rubric and record tier ratings.",
      shortLabel: "Assess",
    },
  },
  summary: {
    stepNumber: 5,
    title: "Review & Submit",
    description:
      "Review your completed assessments and submit your observation.",
    primaryButton: "Submit Assessment",
    showBackButton: true,
    isSubmitStep: true,
    icon: CheckCircle2,
    meta: {
      label: "Review & Submit",
      desc: "Check all entries before submitting.",
      shortLabel: "Submit",
    },
  },
};

/* ===========================================================================
   🧩 STEP COMPONENTS MAP
=========================================================================== */

const stepComponents: Readonly<Record<StepKey, React.ComponentType>> = {
  intro: Instructions,
  select: FellowSelectionStep,
  learners: LearnerSelectionStep,
  assess: AssessmentStep,
  summary: SubmissionSummary,
};

/* ===========================================================================
   🧠 MAIN CONTENT
=========================================================================== */

export default function MainContent(): JSX.Element {
  // Use centralized context state
  const { currentStep, stepInfo, navigation, nextStep, previousStep } =
    useAssessment();

  const CurrentStep = stepComponents[currentStep];
  const config = WIZARD_CONFIG[currentStep];

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      {/* === Step Header === */}
      <StepHeader
        icon={config.icon}
        title={config.title}
        description={config.description}
      />

      {/* === Step Body === */}
      <StepContent>
        <CurrentStep />
      </StepContent>

      {/* === Step Footer + Navigation === */}
      <StepFooter
        left={
          <span className="text-sm text-[#004854]/70">
            Step {config.stepNumber} of {stepInfo.total}
          </span>
        }
        right={<Navigation />}
      />
    </div>
  );
}
