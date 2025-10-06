"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentProvider";
import AssessmentShell from "@/components/layout/AssessmentShell";
import Instructions from "@/components/Instructions";
import FellowSelection from "@/components/FellowSelection";
import AssessmentTable from "@/components/AssesmentTable";
import SubmissionSummary from "@/components/SubmissionSummary";

/* ---------------------------------------------------------------------------
   🔹 Export the page wrapped with the Provider
--------------------------------------------------------------------------- */
export default function Page() {
  const { currentStep } = useAssessment();

  return (
    <AssessmentShell>
      {currentStep === "intro" && <Instructions />}
      {currentStep === "select" && <FellowSelection />}
      {currentStep === "assess" && <AssessmentTable />}
      {currentStep === "summary" && <SubmissionSummary />}
    </AssessmentShell>
  );
}