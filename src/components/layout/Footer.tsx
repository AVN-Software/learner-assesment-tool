"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAssessment } from "@/context/AssessmentProvider";
import { STEPS } from "@/types/assessment";

const Footer: React.FC = () => {
  const {
    currentStep,
    nextStep,
    previousStep,
    selectedFellow,
    selectedLearners,
  } = useAssessment();

  const stepIndex = STEPS.indexOf(currentStep);
  const totalSteps = STEPS.length;

  const canProceed =
    currentStep === "intro" ||
    (currentStep === "select" && !!selectedFellow && selectedLearners.length > 0) ||
    (currentStep === "assess" && selectedLearners.length > 0) ||
    currentStep === "summary";

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < totalSteps - 1 && canProceed;

  const getStatusMessage = () => {
    switch (currentStep) {
      case "intro":
        return "Review the guide, then continue.";
      case "select":
        return selectedFellow
          ? `Selected: ${selectedFellow.name}`
          : "Pick your fellow and learners.";
      case "assess":
        return selectedLearners.length === 0
          ? "No learners selected."
          : "Record tiers & evidence.";
      case "summary":
        return "Review and submit your assessment.";
      default:
        return "";
    }
  };

  const getNextButtonText = () => {
    switch (currentStep) {
      case "intro":
        return "Start";
      case "summary":
        return "Done";
      default:
        return "Next Step";
    }
  };

  return (
    <footer
      className="
        border-t border-slate-200
        px-3 sm:px-4 md:px-6
        py-3
        flex flex-wrap items-center gap-3 justify-between
        bg-white
        [padding-bottom:calc(env(safe-area-inset-bottom)+0.75rem)]
      "
    >
      {/* Back */}
      <button
        type="button"
        onClick={previousStep}
        disabled={!canGoBack}
        aria-disabled={!canGoBack}
        className={[
          "h-10 px-4 w-full sm:w-24 text-sm rounded-md font-medium transition border",
          canGoBack
            ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
            : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed",
        ].join(" ")}
      >
        <ChevronLeft className="w-4 h-4 inline-block mr-1" />
        Back
      </button>

      {/* Status (mobile centered, desktop left) */}
      <div
        className="text-xs text-slate-500 truncate flex-1 text-center sm:text-left"
        aria-live="polite"
      >
        {getStatusMessage()}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={nextStep}
        disabled={!canGoNext}
        aria-disabled={!canGoNext}
        className={[
          "h-10 px-4 w-full sm:w-32 text-sm rounded-md font-semibold transition",
          "flex items-center justify-center gap-2",
          canGoNext
            ? "bg-[#0075ff] text-white hover:bg-[#005de0] active:scale-95"
            : "bg-slate-300 text-white cursor-not-allowed",
        ].join(" ")}
      >
        {getNextButtonText()}
        {canGoNext && <ChevronRight className="w-4 h-4" />}
      </button>
    </footer>
  );
};

export default Footer;
