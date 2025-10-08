"use client";

import React from "react";

import SubmissionSummary from "./steps/SubmissionSummary";
import AssessmentTable from "./AssesmentTable";
import FellowSelectionStep from "./steps/FellowSelection";
import Instructions from "./steps/Instructions";
import AssessmentStep from "./steps/AssessmentStep";
import { StepKey } from "@/hooks/wizard-config";
import { AssessmentProvider, useAssessment } from "@/context/AssessmentProvider";
import { WizardComponent } from "@/hooks/Wizard";

// Your actual step components


/* ---------------------------
   Step Component Registry
--------------------------- */
const stepComponents: Record<StepKey, React.ComponentType> = {
  intro: Instructions,
  select: FellowSelectionStep,
  assess: AssessmentStep,
  summary: SubmissionSummary,
};

/* ---------------------------
   Inner Wizard Wrapper
--------------------------- */
function AssessmentWizardInner() {
  const { currentStep, navigation, nextStep, previousStep } = useAssessment();

  // Validation — pulled from context (not static)
  const canProceed = (step: StepKey) => navigation.canGoNext;

  return (
    <WizardComponent
      canProceed={canProceed}
      stepComponents={stepComponents}
    />
  );
}

/* ---------------------------
   Exported Entry Point
--------------------------- */
export default function AssessmentWizard() {
  return (
    <AssessmentProvider>
      <AssessmentWizardInner />
    </AssessmentProvider>
  );
}
a