'use client';

import React from 'react';
import { useAssessment } from '@/providers/AssessmentProvider';

import StepIndicator from './StepIndicator';
import StepContent from './StepContent';

// Step components
import LoginStep from '../steps/LoginStep';
import Instructions from '../steps/Instructions';
import LearnerSelectionStep from '../steps/LearnerSelectionStep';
import AssessmentStep from '../steps/AssessmentStep';
import SubmissionSummary from '../steps/SubmissionSummary';
import { Step } from '@/types/assessment';
import TopBar from '../layout/TopBar';

/**
 * Step component registry
 * Order: login → intro → selection → assessment → review
 */
const stepComponents: Record<Step, React.ComponentType> = {
  login: LoginStep,
  intro: Instructions,
  selection: LearnerSelectionStep,
  assessment: AssessmentStep,
  review: SubmissionSummary,
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
        'flex h-screen flex-col overflow-hidden',
        'bg-gradient-to-br from-[#F3F8F9] via-[#EFF7F4] to-[#F8FBFF]',
      ].join(' ')}
    >
      {/* Branding Bar (fixed 64px) */}

      {/* Main Content Area */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
        <div className="mx-auto h-full min-h-0 w-full max-w-6xl">
          <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#004854]/12 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            {/* Card Body: Left (steps) + Right (content) */}
            <div className="flex min-h-0 flex-1 overflow-hidden">
              {/* Left Panel — Progress / Steps */}
              <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-[#004854]/15 bg-[#8ED1C1]/10">
                <StepIndicator />
              </aside>

              {/* Right Panel — Step Content */}
              <section className="flex min-w-0 flex-1 flex-col">
                {/* Step Content Area */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <StepContent>
                    <div className="h-full">
                      <CurrentStepComponent />
                    </div>
                  </StepContent>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
