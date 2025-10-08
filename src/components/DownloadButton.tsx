"use client";

import React, { useState } from "react";
import { Download, X } from "lucide-react";
import { ALL_PHASE_CODES, LEARNER_RUBRIC_SYSTEM, PhaseCode } from "./rubric/RubricTableConfig";
import RubricTable from "./rubric/RubricTable";


type Props = { href?: string; invert?: boolean; className?: string };

export default function DownloadRubricButton({
  href = "/rubrics/full_rubric_2025.pdf", // kept for future enablement
  invert = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<PhaseCode>("foundation");
  const [showRubric, setShowRubric] = useState(false);

  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const look = invert
    ? "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200 focus:ring-slate-300"
    : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-700";

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(true);
    setShowRubric(false); // Reset to phase selection when reopening
  };

  const handleViewRubric = () => {
    setShowRubric(true);
  };

  const handleBackToSelection = () => {
    setShowRubric(false);
  };

  const handleClose = () => {
    setOpen(false);
    setShowRubric(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        data-future-href={href}
        className={[base, look, className].join(" ")}
        title="Download Full Rubric (PDF)"
      >
        <Download className="w-4 h-4" />
        Download Full Rubric (PDF)
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleClose}
          />
          <div className={`relative z-10 rounded-xl bg-white shadow-xl ${showRubric ? 'w-full max-w-7xl' : 'w-full max-w-md'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {showRubric ? LEARNER_RUBRIC_SYSTEM.phases[selectedPhase].phaseName : "Select Phase"}
              </h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!showRubric ? (
                // Phase Selection View
                <>
                  <p className="mb-6 text-sm text-slate-600">
                    Select a phase to view the complete learner rubric with competency progressions across all tiers.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {ALL_PHASE_CODES.map((phaseCode) => (
                      <button
                        key={phaseCode}
                        onClick={() => setSelectedPhase(phaseCode)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedPhase === phaseCode
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {LEARNER_RUBRIC_SYSTEM.phases[phaseCode].phaseName}
                            </h4>
                            {LEARNER_RUBRIC_SYSTEM.phases[phaseCode].description && (
                              <p className="text-sm text-slate-600 mt-1">
                                {LEARNER_RUBRIC_SYSTEM.phases[phaseCode].description}
                              </p>
                            )}
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPhase === phaseCode
                              ? "bg-blue-500 border-blue-500"
                              : "border-slate-300"
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleClose}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleViewRubric}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
                    >
                      View Rubric
                    </button>
                  </div>
                </>
              ) : (
                // Rubric Table View
                <>
                  <div className="mb-4">
                    <button
                      onClick={handleBackToSelection}
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
                    >
                      ← Back to phase selection
                    </button>
                    <p className="text-sm text-slate-600">
                      Viewing competency progressions for the {LEARNER_RUBRIC_SYSTEM.phases[selectedPhase].phaseName.toLowerCase()}.
                    </p>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto">
                    <RubricTable phase={selectedPhase} />
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                    <button
                      onClick={handleBackToSelection}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Select Different Phase
                    </button>
                    <button
                      onClick={handleClose}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}