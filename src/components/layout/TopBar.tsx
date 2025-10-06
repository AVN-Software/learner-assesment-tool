"use client";

import React from "react";
import DownloadRubricButton from "@/components/DownloadButton";
import { useAssessment } from "@/context/AssessmentProvider";
import { STEPS } from "@/types/assessment";

const STEP_LABEL: Record<(typeof STEPS)[number], string> = {
  intro: "Instructions",
  select: "Choose Fellow",
  assess: "Assess Learners",
  summary: "Review & Submit",
};

const TopBar: React.FC = () => {
  const { currentStep } = useAssessment();

  const stepIndex = STEPS.indexOf(currentStep);
  const label = STEP_LABEL[currentStep];
  const number = stepIndex + 1;
  const total = STEPS.length;

  return (
    <header
      className="
        px-3 sm:px-4 md:px-6
        pt-4 pb-2
        flex flex-col sm:flex-row sm:items-center justify-between gap-3
        bg-white
      "
    >
      <div className="min-w-0">
        <h1 className="text-lg md:text-xl font-semibold text-slate-900 truncate">
          TTN Fellowship — Learner Observation
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
          {label} • Step {number} of {total}
        </p>
      </div>

      <div className="shrink-0">
        <DownloadRubricButton />
      </div>
    </header>
  );
};

export default TopBar;
