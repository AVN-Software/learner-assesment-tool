'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { useAssessment } from '@/providers/AssessmentProvider';
import { useData } from '@/providers/DataProvider';

export default function LearnerSelectionStep() {
  const { fellowData, loading: dataLoading } = useData();

  const { selectedLearners, toggleLearnerSelection } = useAssessment();

  const handleLearnerToggle = (
    learnerId: string,
    assessmentId: string | null,
    isCompleted: boolean,
  ) => {
    // Just toggle selection - assessment loading happens when "Start Assessment" is clicked
    toggleLearnerSelection(learnerId);
  };

  if (dataLoading) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <p className="text-slate-600">Loading learners...</p>
      </div>
    );
  }

  if (!fellowData) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <p className="text-slate-600">Please log in to continue</p>
      </div>
    );
  }

  const { learners } = fellowData;
  const availableForNew = learners.filter((l) => !l.assessmentCompleted);
  const availableForEdit = learners.filter((l) => l.assessmentCompleted);

  // Calculate selected breakdown
  const selectedNew = selectedLearners.filter(
    (id) => !learners.find((l) => l.learnerId === id)?.assessmentCompleted,
  );
  const selectedEdit = selectedLearners.filter(
    (id) => learners.find((l) => l.learnerId === id)?.assessmentCompleted,
  );

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row">
      {/* LEFT: Learner Selection Lists */}
      <div className="flex-1 space-y-6">
        {/* New Assessments Section */}
        {availableForNew.length > 0 && (
          <div className="w-full">
            <h3 className="mb-3 text-sm font-bold text-slate-700">
              Available for New Assessment ({availableForNew.length})
            </h3>
            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
              {availableForNew.map((learner) => {
                const selected = selectedLearners.includes(learner.learnerId);

                return (
                  <label
                    key={learner.learnerId}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 ${
                      selected
                        ? 'border-[#005a6a] bg-[#005a6a]/5 ring-2 ring-[#005a6a]'
                        : 'border-slate-200 hover:scale-[1.01] hover:border-slate-300 hover:shadow-md'
                    } `}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleLearnerToggle(learner.learnerId, null, false)}
                      className="h-5 w-5 flex-shrink-0 cursor-pointer rounded border-2 border-slate-400 text-[#005a6a] focus:ring-2 focus:ring-[#005a6a]/40 focus:ring-offset-2"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {learner.learnerName}
                      </p>
                      <p className="mt-0.5 text-xs text-emerald-600">Ready for assessment</p>
                    </div>

                    {selected ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#005a6a]" />
                    ) : (
                      <Circle className="h-5 w-5 flex-shrink-0 text-slate-300" />
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
            <h3 className="mb-3 text-sm font-bold text-slate-700">
              Completed Assessments ({availableForEdit.length})
            </h3>
            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
              {availableForEdit.map((learner) => {
                const selected = selectedLearners.includes(learner.learnerId);

                return (
                  <label
                    key={learner.learnerId}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 ${
                      selected
                        ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-500'
                        : 'border-slate-200 hover:scale-[1.01] hover:border-slate-300 hover:shadow-md'
                    } `}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        handleLearnerToggle(learner.learnerId, learner.assessmentId!, true)
                      }
                      className="h-5 w-5 flex-shrink-0 cursor-pointer rounded border-2 border-slate-400 text-amber-600 focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-2"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {learner.learnerName}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {learner.dateModified ? (
                          <span>
                            Modified {new Date(learner.dateModified).toLocaleDateString()}
                          </span>
                        ) : (
                          <span>Created {new Date(learner.dateCreated!).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    {selected ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-amber-600" />
                    ) : (
                      <Circle className="h-5 w-5 flex-shrink-0 text-slate-300" />
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
            <Circle className="mb-4 h-16 w-16 text-slate-300" />
            <h3 className="mb-2 text-lg font-semibold text-slate-700">No Learners Assigned</h3>
            <p className="max-w-md text-sm text-slate-500">
              No learners are currently assigned to your account. Please contact your administrator.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT: Selection Summary Panel (Desktop) */}
      {selectedLearners.length > 0 && (
        <div className="flex-shrink-0 lg:w-80">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#005a6a] to-[#007786] px-4 py-3">
              <h3 className="text-sm font-semibold text-white">Selection Summary</h3>
              <p className="mt-0.5 text-xs text-white/80">
                {selectedLearners.length} learner
                {selectedLearners.length !== 1 ? 's' : ''} selected
              </p>
            </div>

            {/* Content */}
            <div className="space-y-4 p-4">
              {/* New Assessments */}
              {selectedNew.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#005a6a]"></div>
                    <h4 className="text-xs font-bold tracking-wide text-slate-700 uppercase">
                      New Assessments ({selectedNew.length})
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    {selectedNew.map((learnerId) => {
                      const learner = learners.find((l) => l.learnerId === learnerId);
                      return (
                        <div
                          key={learnerId}
                          className="flex items-center gap-2 rounded-md border border-[#005a6a]/20 bg-[#005a6a]/5 px-2 py-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#005a6a]" />
                          <span className="truncate text-xs font-medium text-slate-800">
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
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <h4 className="text-xs font-bold tracking-wide text-slate-700 uppercase">
                      Editing Assessments ({selectedEdit.length})
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    {selectedEdit.map((learnerId) => {
                      const learner = learners.find((l) => l.learnerId === learnerId);
                      return (
                        <div
                          key={learnerId}
                          className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
                          <span className="truncate text-xs font-medium text-slate-800">
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
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-center text-xs text-slate-600">
                Click <span className="font-semibold">Start Assessment</span> to continue
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Summary (shows when no selections on desktop) */}
      {selectedLearners.length > 0 && (
        <div className="lg:hidden">
          <div className="rounded-xl bg-gradient-to-r from-[#005a6a] to-[#007786] p-4 text-white shadow-md">
            <p className="text-sm font-semibold">
              {selectedLearners.length} learner
              {selectedLearners.length !== 1 ? 's' : ''} selected
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-white/90">
              {selectedNew.length > 0 && <span>{selectedNew.length} new</span>}
              {selectedEdit.length > 0 && (
                <span>
                  {selectedEdit.length} edit
                  {selectedEdit.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
