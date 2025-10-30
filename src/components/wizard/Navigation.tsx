'use client';

import React from 'react';
import { useAssessment } from '@/providers/AssessmentProvider';
import { useData } from '@/providers/DataProvider';
import { useWizard } from '@/hooks/useWizard';

/**
 * Navigation buttons (Back / Next)
 * - Layout-only: full-width row, brand-styled buttons
 * - All logic for step progression lives in useWizard now
 * - Assessment loading happens when transitioning from selection to assessment
 */
export default function Navigation() {
  const {
    currentStep,
    selectedLearners,
    completionStats,
    isComplete,
    mode,
    goToStep,
    initializeNewAssessment,
    loadAssessmentsForEdit,
  } = useAssessment();

  const { fellowData } = useData();

  const wizard = useWizard({
    currentStep,
    canProceed: isComplete,
    selectedLearnersCount: selectedLearners.length,
    completionPercentage: completionStats.completionPercentage,
    mode,
    goToStep,
  });

  /**
   * Handle next step with assessment initialization
   * When moving from selection to assessment, load all data
   */
  const handleNext = async () => {
    // If moving from selection to assessment, initialize the assessments
    if (currentStep === 'selection' && fellowData) {
      const learners = fellowData.learners;

      // Separate new assessments from edits
      const newLearners = selectedLearners.filter(
        (id) => !learners.find((l) => l.learnerId === id)?.assessmentCompleted,
      );

      const editLearners = selectedLearners
        .filter((id) => learners.find((l) => l.learnerId === id)?.assessmentCompleted)
        .map((id) => ({
          learnerId: id,
          assessmentId: learners.find((l) => l.learnerId === id)!.assessmentId!,
        }));

      // Initialize new assessments (creates empty drafts)
      if (newLearners.length > 0) {
        initializeNewAssessment(newLearners);
      }

      // Load existing assessments for editing (fetches from database)
      if (editLearners.length > 0) {
        await loadAssessmentsForEdit(editLearners);
      }
    }

    // Then proceed to next step
    wizard.goNext();
  };

  return (
    <div className="flex w-full items-center justify-between gap-3">
      {/* Left side: Back or status */}
      <div className="min-w-0">
        {wizard.canGoBack ? (
          <button
            type="button"
            onClick={wizard.goBack}
            className={[
              'inline-flex h-10 items-center justify-center rounded-lg px-4',
              'border border-[#004854]/20 bg-white text-[#004854]',
              'hover:bg-[#8ED1C1]/10',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ED1C1]/40',
              'transition-colors duration-200',
            ].join(' ')}
            aria-label="Go to previous step"
          >
            ← Back
          </button>
        ) : (
          <span className="truncate text-sm text-[#838998]">{wizard.statusMessage}</span>
        )}
      </div>

      {/* Right side: Next or status */}
      <div className="min-w-0">
        {wizard.canGoNext || wizard.canSubmit ? (
          <button
            type="button"
            onClick={
              wizard.canSubmit
                ? () => {
                    // You can later wire this to a submit handler
                    console.log('Submitting assessment...');
                  }
                : handleNext
            }
            disabled={!wizard.canGoNext && !wizard.canSubmit}
            className={[
              'inline-flex h-10 items-center justify-center rounded-lg px-6 font-semibold',
              'bg-[#004854] text-white',
              'hover:bg-[#0a5e6c]',
              'disabled:cursor-not-allowed disabled:opacity-40',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ED1C1]/40',
              'shadow-sm transition hover:shadow',
            ].join(' ')}
            aria-label="Go to next step"
          >
            {wizard.currentConfig.primaryButton} →
          </button>
        ) : (
          <span className="text-sm font-medium text-[#32353C]/80">{wizard.statusMessage}</span>
        )}
      </div>
    </div>
  );
}
