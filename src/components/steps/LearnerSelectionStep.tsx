"use client";

import { useEffect, useMemo } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useAssessment } from "@/providers/AssessmentProvider";
import { useData } from "@/providers/DataProvider";
import { Grade, Phase } from "@/types";

export default function LearnerSelectionStep() {
  const {
    fellow,
    learners: availableLearners,
    loading: dataLoading,
  } = useData();

  const {
    selectedTerm,
    selectedGrade,
    selectedPhase,
    selectedLearners,
    setSelectedTerm,
    setSelectedGrade,
    setSelectedPhase,
    setSelectedLearners,
    toggleLearnerSelection,
    availableTerms,
    canSelectForTerm,
    getTermStatus,
    nextStep,
    prevStep,
  } = useAssessment();

  // Update phase when grade changes
  useEffect(() => {
    if (selectedGrade) {
      const phase = derivePhaseFromGrade(selectedGrade);
      setSelectedPhase(phase as Phase);
    } else {
      setSelectedPhase("");
    }
  }, [selectedGrade, setSelectedPhase]);

  const derivePhaseFromGrade = (grade: string): string => {
    if (["Grade R", "Grade 1", "Grade 2", "Grade 3"].includes(grade))
      return "Foundation";
    if (["Grade 4", "Grade 5", "Grade 6"].includes(grade))
      return "Intermediate";
    if (["Grade 7", "Grade 8", "Grade 9"].includes(grade)) return "Senior";
    if (["Grade 10", "Grade 11", "Grade 12"].includes(grade)) return "FET";
    return "";
  };

  const handleStartAssessment = () => {
    if (
      !selectedTerm ||
      !selectedGrade ||
      !selectedPhase ||
      selectedLearners.length === 0
    )
      return;
    nextStep(); // Navigate to assessment step
  };

  const handleTermChange = (term: number | null) => {
    setSelectedTerm(term);
    // Clear selected learners when term changes
    setSelectedLearners([]);
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  if (!fellow) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Assessment Center
            </h1>
            <p className="text-sm text-slate-600 mt-1">{fellow.fellowname}</p>
          </div>
          <button
            onClick={prevStep}
            className="text-sm px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition font-medium"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-28">
        {/* Control Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sticky top-4 z-10">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Term
              </label>
              <select
                value={selectedTerm || ""}
                onChange={(e) => {
                  handleTermChange(
                    e.target.value ? Number(e.target.value) : null
                  );
                }}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Choose term…</option>
                {availableTerms.map((t) => (
                  <option key={t} value={t}>
                    Term {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as "" | Grade)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Choose grade…</option>
                {[
                  "Grade R",
                  "Grade 1",
                  "Grade 2",
                  "Grade 3",
                  "Grade 4",
                  "Grade 5",
                  "Grade 6",
                  "Grade 7",
                  "Grade 8",
                  "Grade 9",
                  "Grade 10",
                  "Grade 11",
                  "Grade 12",
                ].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phase Display */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-700">Phase:</span>
            {selectedPhase ? (
              <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                {selectedPhase}
              </span>
            ) : (
              <span className="inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
                Select grade first
              </span>
            )}
          </div>

          {selectedLearners.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-700">
                {selectedLearners.length} learner
                {selectedLearners.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}
        </div>

        {/* Learners List */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 mb-3 px-1">
            Select Learners ({availableLearners.length})
          </h2>
          <div className="space-y-2">
            {availableLearners.map((learner) => {
              const selectable = selectedTerm
                ? canSelectForTerm(learner.id, selectedTerm)
                : false;
              const selected = selectedLearners.some(
                (l) => l.id === learner.id
              );

              return (
                <label
                  key={learner.id}
                  className={`
                    flex items-center gap-4 w-full bg-white border rounded-xl p-4 shadow-sm
                    transition-all duration-200 cursor-pointer
                    ${
                      selected
                        ? "ring-2 ring-blue-500 border-blue-400 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }
                    ${
                      !selectedTerm || !selectable
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-[1.01]"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleLearnerSelection(learner.id)}
                    disabled={!selectedTerm || !selectable}
                    className="w-5 h-5 rounded border-2 border-slate-400 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {learner.learner_name}
                    </p>
                    {!selectedTerm && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Select a term first
                      </p>
                    )}
                    {selectedTerm && !selectable && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Already assessed
                      </p>
                    )}
                  </div>

                  {selected && (
                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  )}
                  {!selected && selectedTerm && selectable && (
                    <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={handleStartAssessment}
            disabled={
              !selectedTerm ||
              !selectedGrade ||
              !selectedPhase ||
              selectedLearners.length === 0
            }
            className="w-full inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-bold
                       text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400
                       shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
          >
            <CheckCircle2 className="w-6 h-6" />
            Start Assessment
            {selectedLearners.length > 0 && (
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-sm">
                {selectedLearners.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
