"use client";

import React from "react";

import { StepKey } from "@/components/wizard/wizard-config";
import StepIndicator from "./StepIndicator";
import ProgressBar from "./ProgressBar";
import StepContent from "./StepContent";
import Navigation from "./Navigation";

// Step components
import Instructions from "../steps/Instructions";
import SubmissionSummary from "../steps/SubmissionSummary";
import LoginStep from "../steps/LoginStep";
import AssessmentStep from "../steps/AssessmentStep";
import LearnerSelectionStep from "../steps/LearnerSelectionStep"; // Fixed import name
import { useAssessment } from "@/providers/AssessmentProvider";

/**
 * Step component registry
 * Order: login → intro → learners → assess → summary
 */
const stepComponents: Record<StepKey, React.ComponentType> = {
  login: LoginStep,
  intro: Instructions,
  learners: LearnerSelectionStep, // Use correct component name
  assess: AssessmentStep,
  summary: SubmissionSummary,
};

/**
 * Main wizard UI — brand-styled, scroll-safe, with full-width footer actions
 */
export default function AssessmentWizardUI() {
  const { currentStep } = useAssessment();
  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div
      className={[
        "h-screen flex flex-col overflow-hidden",
        "bg-gradient-to-br from-[#F3F8F9] via-[#EFF7F4] to-[#F8FBFF]",
      ].join(" ")}
    >
      {/* Branding Bar (fixed 64px) */}
      <div className="h-16 flex-shrink-0 bg-white border-b border-[#004854]/15 shadow-sm">
        <div className="max-w-[1800px] mx-auto h-full w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center shadow-sm
                         bg-gradient-to-r from-[#004854] to-[#8ED1C1]"
            >
              <span className="text-white font-bold text-sm tracking-wide">
                TN
              </span>
            </div>
            <div className="leading-tight">
              <h1 className="font-semibold text-[#004854] text-lg">
                Teach the Nation
              </h1>
              <p className="text-sm text-[#32353C]/70">
                Learner Competency Assessment Tool
              </p>
            </div>
          </div>

          <div className="text-right leading-tight">
            <div className="font-medium text-[#32353C] text-sm">
              Conscious Leadership Development
            </div>
            <div className="text-xs text-[#838998] mt-0.5">
              Secure Assessment Portal
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-6xl h-full mx-auto min-h-0">
          <div
            className="bg-white rounded-xl h-full w-full flex flex-col overflow-hidden
                       border border-[#004854]/12 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
          >
            {/* Card Body: Left (steps) + Right (content) */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
              {/* Left Panel — Progress / Steps */}
              <aside className="w-64 flex-shrink-0 border-r border-[#004854]/15 bg-[#8ED1C1]/10 overflow-y-auto">
                <StepIndicator />
              </aside>

              {/* Right Panel — Step Content */}
              <section className="flex-1 min-w-0 flex flex-col">
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <StepContent>
                    <div className="h-full">
                      <CurrentStepComponent />
                    </div>
                  </StepContent>
                </div>
              </section>
            </div>

            {/* Card Footer — Actions (Navigation, ProgressBar, etc.) */}
            <footer className="border-t border-[#004854]/15 bg-white">
              <div className="p-4 flex flex-col gap-2">
                <ProgressBar />
                <Navigation />
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
