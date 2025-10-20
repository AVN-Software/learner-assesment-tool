"use client";

import React, { useState } from "react";
import { Users, X, CheckCircle } from "lucide-react";

import { PhaseTable } from "../AssesmentTable/PhaseTable";
import EvidenceModal from "@/components/modals/EvidenceModal";
import { useAssessment } from "@/providers/AssessmentProvider";
import { CompetencyId } from "@/types";

/* ----------------------------------------------------------------------------
   AssessmentStep - Main component
---------------------------------------------------------------------------- */
const AssessmentStep: React.FC = () => {
  const {
    selectedLearners,
    assessments,
    isComplete,
    prevStep,
    selectedGrade,
    selectedPhase,
    selectedTerm,
  } = useAssessment();

  // Evidence modal state
  const [evidenceModal, setEvidenceModal] = useState<{
    open: boolean;
    learnerId: string;
    competencyId: CompetencyId;
  }>({
    open: false,
    learnerId: "",
    competencyId: "motivation",
  });

  /* ---------------------------- Handlers ---------------------------- */
  const handleOpenEvidence = (args: {
    learnerId: string;
    competencyId: CompetencyId;
    learnerName: string;
    tierScore: 1 | 2 | 3;
  }) => {
    setEvidenceModal({
      open: true,
      learnerId: args.learnerId,
      competencyId: args.competencyId,
    });
  };

  const closeEvidence = () =>
    setEvidenceModal((prev) => ({ ...prev, open: false }));

  const handleBackToSelection = () => {
    prevStep(); // Navigate back to learner selection
  };

  const handleSubmit = () => {
    // This will be handled in the SubmissionSummary step
    // For now, just navigate to the summary
    // You can add actual submission logic in the SubmissionSummary component
    console.log("Assessment data ready for submission:", assessments);
  };

  /* ---------------------------- Render ---------------------------- */
  if (selectedLearners.length === 0) {
    return (
      <div className="w-full">
        <div className="text-center rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <Users className="mx-auto w-10 h-10 text-slate-400 mb-2" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            No learners selected
          </h3>
          <p className="text-sm text-slate-600">
            Go back and choose learners to begin your assessment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Info */}
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              {selectedGrade} - {selectedPhase} Phase • Term {selectedTerm}
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Assessing {selectedLearners.length} learner
              {selectedLearners.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleBackToSelection}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>

      {/* PhaseTable */}
      <PhaseTable onOpenEvidence={handleOpenEvidence} />

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={handleBackToSelection}
          className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
        >
          Back to Selection
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
        >
          <CheckCircle className="w-4 h-4" />
          Continue to Review
        </button>
      </div>

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={evidenceModal.open}
        onClose={closeEvidence}
        learnerId={evidenceModal.learnerId}
        competencyId={evidenceModal.competencyId}
      />
    </div>
  );
};

export default AssessmentStep;
