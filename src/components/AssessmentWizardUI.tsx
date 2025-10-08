"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentProvider";
import { StepKey } from "@/hooks/wizard-config";
import StepIndicator from "./StepIndicator";
import ProgressBar from "./ProgressBar";
import StepContent from "./StepContent";
import Navigation from "./Navigation";

// Step components
import Instructions from "./steps/Instructions";
import FellowSelectionStep from "./steps/FellowSelection";
import AssessmentStep from "./steps/AssessmentStep";
import SubmissionSummary from "./steps/SubmissionSummary";

/**
 * Step component registry
 */
const stepComponents: Record<StepKey, React.ComponentType> = {
  intro: Instructions,
  select: FellowSelectionStep,
  assess: AssessmentStep,
  summary: SubmissionSummary,
};

/**
 * Main wizard UI - reads from context only
 */
export default function AssessmentWizardUI() {
  const { currentStep, stepInfo } = useAssessment();
  
  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Indicator */}
        <StepIndicator />
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/50">
          
          {/* Header with Progress */}
          <ProgressBar />

          {/* Step Content */}
          <StepContent>
            <CurrentStepComponent />
          </StepContent>

          {/* Navigation */}
          <Navigation />
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Need help? Contact support or view documentation
        </div>
      </div>
    </div>
  );
}