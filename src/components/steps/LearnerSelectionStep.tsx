"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useAssessment } from "@/providers/AssessmentProvider";
import { useData } from "@/providers/DataProvider";

export default function LearnerSelectionStep() {
  const { fellowData, loading: dataLoading } = useData();

  const { selectedLearners, toggleLearnerSelection, loadAssessmentForEdit } =
    useAssessment();

  const handleLearnerToggle = async (
    learnerId: string,
    assessmentId: string | null,
    isCompleted: boolean
  ) => {
    const isCurrentlySelected = selectedLearners.includes(learnerId);

    if (isCurrentlySelected) {
      // Deselecting - just remove from selection
      toggleLearnerSelection(learnerId);
    } else {
      // Selecting
      if (isCompleted && assessmentId) {
        // Load existing assessment into context
        await loadAssessmentForEdit(learnerId, assessmentId);
        toggleLearnerSelection(learnerId);
      } else {
        // New assessment - just add to selection
        toggleLearnerSelection(learnerId);
      }
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center w-full py-12">
        <p className="text-slate-600">Loading learners...</p>
      </div>
    );
  }

  if (!fellowData) {
    return (
      <div className="flex items-center justify-center w-full py-12">
        <p className="text-slate-600">Please log in to continue</p>
      </div>
    );
  }

  const { learners } = fellowData;
  const availableForNew = learners.filter((l) => !l.assessmentCompleted);
  const availableForEdit = learners.filter((l) => l.assessmentCompleted);

  // Calculate selected breakdown
  const selectedNew = selectedLearners.filter(
    (id) => !learners.find((l) => l.learnerId === id)?.assessmentCompleted
  );
  const selectedEdit = selectedLearners.filter(
    (id) => learners.find((l) => l.learnerId === id)?.assessmentCompleted
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* LEFT: Learner Selection Lists */}
      <div className="flex-1 space-y-6">
        {/* New Assessments Section */}
        {availableForNew.length > 0 && (
          <div className="w-full">
            <h3 className="text-sm font-bold text-slate-700 mb-3">
              Available for New Assessment ({availableForNew.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              {availableForNew.map((learner) => {
                const selected = selectedLearners.includes(learner.learnerId);

                return (
                  <label
                    key={learner.learnerId}
                    className={`
                      flex items-center gap-3 w-full bg-white border rounded-lg p-3 shadow-sm
                      transition-all duration-200 cursor-pointer
                      ${
                        selected
                          ? "ring-2 ring-[#005a6a] border-[#005a6a] bg-[#005a6a]/5"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-[1.01]"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        handleLearnerToggle(learner.learnerId, null, false)
                      }
                      className="w-5 h-5 rounded border-2 border-slate-400 text-[#005a6a] focus:ring-2 focus:ring-[#005a6a]/40 focus:ring-offset-2 cursor-pointer flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate text-sm">
                        {learner.learnerName}
                      </p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        Ready for assessment
                      </p>
                    </div>

                    {selected ? (
                      <CheckCircle2 className="w-5 h-5 text-[#005a6a] flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Assessments Section */}
        {availableForEdit.length > 0 && (
          <div className="w-full">
            <h3 className="text-sm font-bold text-slate-700 mb-3">
              Completed Assessments ({availableForEdit.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              {availableForEdit.map((learner) => {
                const selected = selectedLearners.includes(learner.learnerId);

                return (
                  <label
                    key={learner.learnerId}
                    className={`
                      flex items-center gap-3 w-full bg-white border rounded-lg p-3 shadow-sm
                      transition-all duration-200 cursor-pointer
                      ${
                        selected
                          ? "ring-2 ring-amber-500 border-amber-400 bg-amber-50"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-[1.01]"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        handleLearnerToggle(
                          learner.learnerId,
                          learner.assessmentId!,
                          true
                        )
                      }
                      className="w-5 h-5 rounded border-2 border-slate-400 text-amber-600 focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-2 cursor-pointer flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate text-sm">
                        {learner.learnerName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {learner.dateModified ? (
                          <span>
                            Modified{" "}
                            {new Date(
                              learner.dateModified
                            ).toLocaleDateString()}
                          </span>
                        ) : (
                          <span>
                            Created{" "}
                            {new Date(
                              learner.dateCreated!
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {selected ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {learners.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Circle className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Learners Assigned
            </h3>
            <p className="text-sm text-slate-500 max-w-md">
              No learners are currently assigned to your account. Please contact
              your administrator.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT: Selection Summary Panel (Desktop) */}
      {selectedLearners.length > 0 && (
        <div className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#005a6a] to-[#007786] px-4 py-3">
              <h3 className="font-semibold text-white text-sm">
                Selection Summary
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {selectedLearners.length} learner
                {selectedLearners.length !== 1 ? "s" : ""} selected
              </p>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* New Assessments */}
              {selectedNew.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#005a6a]"></div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      New Assessments ({selectedNew.length})
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    {selectedNew.map((learnerId) => {
                      const learner = learners.find(
                        (l) => l.learnerId === learnerId
                      );
                      return (
                        <div
                          key={learnerId}
                          className="flex items-center gap-2 px-2 py-1.5 bg-[#005a6a]/5 rounded-md border border-[#005a6a]/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#005a6a] flex-shrink-0" />
                          <span className="text-xs font-medium text-slate-800 truncate">
                            {learner?.learnerName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Editing Assessments */}
              {selectedEdit.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Editing Assessments ({selectedEdit.length})
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    {selectedEdit.map((learnerId) => {
                      const learner = learners.find(
                        (l) => l.learnerId === learnerId
                      );
                      return (
                        <div
                          key={learnerId}
                          className="flex items-center gap-2 px-2 py-1.5 bg-amber-50 rounded-md border border-amber-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-slate-800 truncate">
                            {learner?.learnerName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
              <p className="text-xs text-slate-600 text-center">
                Click <span className="font-semibold">Start Assessment</span> to
                continue
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Summary (shows when no selections on desktop) */}
      {selectedLearners.length > 0 && (
        <div className="lg:hidden">
          <div className="bg-gradient-to-r from-[#005a6a] to-[#007786] rounded-xl p-4 text-white shadow-md">
            <p className="font-semibold text-sm">
              {selectedLearners.length} learner
              {selectedLearners.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-white/90">
              {selectedNew.length > 0 && <span>{selectedNew.length} new</span>}
              {selectedEdit.length > 0 && (
                <span>
                  {selectedEdit.length} edit
                  {selectedEdit.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
