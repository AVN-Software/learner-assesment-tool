"use client";

import React from "react";
import { AssessmentProvider } from "@/context/AssessmentProvider";
import AssessmentWizardUI from "./AssessmentWizardUI";

/**
 * Main entry point for the Assessment Wizard
 * Wraps the UI with the context provider
 */
export default function AssessmentWizard() {
  return (
    <AssessmentProvider>
      <AssessmentWizardUI />
    </AssessmentProvider>
  );
}