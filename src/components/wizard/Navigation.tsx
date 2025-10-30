"use client";

import React from "react";
import { useAssessment } from "@/providers/AssessmentProvider";
import { useWizard } from "@/hooks/useWizard";

/**
 * Navigation buttons (Back / Next)
 * - Layout-only: full-width row, brand-styled buttons
 * - All logic for step progression lives in useWizard now
 */
export default function Navigation() {
  const {
    currentStep,
    selectedLearners,
    completionStats,
    isComplete,
    mode,
    goToStep,
  } = useAssessment();

  const wizard = useWizard({
    currentStep,
    canProceed: isComplete,
    selectedLearnersCount: selectedLearners.length,
    completionPercentage: completionStats.completionPercentage,
    mode,
    goToStep,
  });

  return (
    <div className="w-full flex items-center justify-between gap-3">
      {/* Left side: Back or status */}
      <div className="min-w-0">
        {wizard.canGoBack ? (
          <button
            type="button"
            onClick={wizard.goBack}
            className={[
              "inline-flex items-center justify-center h-10 px-4 rounded-lg",
              "bg-white border border-[#004854]/20 text-[#004854]",
              "hover:bg-[#8ED1C1]/10",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ED1C1]/40",
              "transition-colors duration-200",
            ].join(" ")}
            aria-label="Go to previous step"
          >
            ← Back
          </button>
        ) : (
          <span className="text-sm text-[#838998] truncate">
            {wizard.statusMessage}
          </span>
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
                    console.log("Submitting assessment...");
                  }
                : wizard.goNext
            }
            disabled={!wizard.canGoNext && !wizard.canSubmit}
            className={[
              "inline-flex items-center justify-center h-10 px-6 rounded-lg font-semibold",
              "bg-[#004854] text-white",
              "hover:bg-[#0a5e6c]",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ED1C1]/40",
              "shadow-sm hover:shadow transition",
            ].join(" ")}
            aria-label="Go to next step"
          >
            {wizard.currentConfig.primaryButton} →
          </button>
        ) : (
          <span className="text-sm font-medium text-[#32353C]/80">
            {wizard.statusMessage}
          </span>
        )}
      </div>
    </div>
  );
}
