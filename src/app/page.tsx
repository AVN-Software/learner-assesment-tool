"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentProvider";
import AssessmentShell from "@/components/layout/AssessmentShell";
import Instructions from "@/components/steps/Instructions";
import FellowSelection from "@/components/steps/FellowSelection";

import SubmissionSummary from "@/components/steps/SubmissionSummary";
import ShadcnAssessmentTable, { CompetencyId, TierValue } from "@/components/steps/AssesmentTable";
import AssessmentStep from "@/components/steps/AssessmentStep";


/* ---------------------------------------------------------------------------
   🔹 Export the page wrapped with the Provider
--------------------------------------------------------------------------- */
export default function Page() {
  const { currentStep } = useAssessment();

  return (
    <AssessmentShell>
      {currentStep === "intro" && <Instructions />}
      {currentStep === "select" && <FellowSelection />}
      {currentStep === "assess" && <AssessmentStep />}
      {currentStep === "summary" && <SubmissionSummary />}
    </AssessmentShell>
  );
}