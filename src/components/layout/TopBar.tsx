"use client";

import React, { useMemo } from "react";
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

  const { label, number, total } = useMemo(() => {
    const idx = STEPS.indexOf(currentStep);
    return {
      label: STEP_LABEL[currentStep],
      number: idx + 1,
      total: STEPS.length,
    };
  }, [currentStep]);

  return (
    <header className="px-4 sm:px-6 pt-6 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
          TTN Fellowship — Learner Observation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {label} • Step {number} of {total}
        </p>
      </div>
      <DownloadRubricButton />
    </header>
  );
};

export default TopBar;
