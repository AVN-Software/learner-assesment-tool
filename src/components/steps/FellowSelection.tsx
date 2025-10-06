"use client";

import React, { useState, useMemo } from "react";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import { useAssessment } from "@/context/AssessmentProvider";
import { MOCK_FELLOWS, MOCK_LEARNERS } from "@/data/SAMPLE_DATA";
import { Phase, Term } from "@/types/core";
import { Fellow, Learner } from "@/types/people";

// Scaffold components

import { FormSelect } from "../form";
import { EmailConfirmModal } from "../modals/EmailConfirmModal";
import StepScaffold, { StepModal, useStepModals } from "./StepContainer";

/* ============================================================================
   FellowSelectionStep (context-driven, mobile-first)
============================================================================ */
const FellowSelectionStep: React.FC = () => {
  const {
    // context state
    term,
    setTerm,
    selectedCoach,
    setSelectedCoach,
    selectedFellow,
    setSelectedFellow,
    selectedLearners,
    setSelectedLearners,
    nextStep,
    previousStep,
  } = useAssessment();

  // local-only UI state
  const [verified, setVerified] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Modal management for additional modals if needed
  const modals = useStepModals(["help"] as const);

  /* -------------------- Derived data -------------------- */
  const coaches = useMemo(
    () => Array.from(new Set(MOCK_FELLOWS.map((f) => f.coachName))),
    []
  );

  const fellowsForCoach = useMemo<Fellow[]>(
    () =>
      selectedCoach
        ? MOCK_FELLOWS.filter((f) => f.coachName === selectedCoach)
        : [],
    [selectedCoach]
  );

  const learnersForFellow = useMemo<Learner[]>(
    () =>
      selectedFellow
        ? MOCK_LEARNERS.filter((l) => l.fellowId === selectedFellow.id)
        : [],
    [selectedFellow]
  );

  const learnersByPhase = useMemo(() => {
    const map: Record<Phase | "Unassigned", Learner[]> = {
      Foundation: [],
      Intermediate: [],
      Senior: [],
      FET: [],
      Unassigned: [],
    };
    for (const l of learnersForFellow) {
      const key = (l.phase ?? "Unassigned") as Phase | "Unassigned";
      map[key].push(l);
    }
    return map;
  }, [learnersForFellow]);

  const selectedIds = useMemo(
    () => new Set(selectedLearners.map((l) => l.id)),
    [selectedLearners]
  );

  /* -------------------- Handlers -------------------- */
  const handleCoachChange = (val: string) => {
    setSelectedCoach(val);
    setSelectedFellow(null);
    setSelectedLearners([]);
    setVerified(false);
  };

  const handleFellowChange = (id: string) => {
    if (!id) {
      setSelectedFellow(null);
      setSelectedLearners([]);
      setVerified(false);
      return;
    }
    const f = MOCK_FELLOWS.find((x) => x.id === id) ?? null;
    setSelectedFellow(f);
    setSelectedLearners([]);
    setVerified(false);
    setShowEmailModal(!!f);
  };

  const toggleLearner = (id: string) => {
    if (!selectedFellow) return;
    if (selectedIds.has(id)) {
      setSelectedLearners(selectedLearners.filter((l) => l.id !== id));
    } else {
      const l = learnersForFellow.find((x) => x.id === id);
      if (l) setSelectedLearners([...selectedLearners, l]);
    }
  };

  const canContinue = Boolean(selectedFellow && selectedLearners.length > 0);

  /* -------------------- Status Text -------------------- */
  const getStatusText = () => {
    if (!selectedFellow) return "Pick a coach and fellow to proceed.";
    if (selectedLearners.length === 0) return "Select at least one learner.";
    return `Ready to continue with ${selectedLearners.length} learner${selectedLearners.length > 1 ? 's' : ''}.`;
  };

  /* -------------------- Primary Button Label -------------------- */
  const getPrimaryLabel = () => {
    const base = "Continue";
    if (selectedLearners.length === 0) return base;
    return `${base} (${selectedLearners.length} learner${selectedLearners.length > 1 ? 's' : ''})`;
  };

  /* -------------------- Render -------------------- */
  return (
    <StepScaffold
      title="Fellow Selection"
      description="Pick the academic term, coach, then verify a fellow. Choose the learners you'll assess."
      maxWidth="lg"
      actions={{
        leftHint: getStatusText(),
        secondary: previousStep ? { 
          label: "Back", 
          onClick: previousStep 
        } : undefined,
        primary: { 
          label: getPrimaryLabel(), 
          onClick: nextStep,
          disabled: !canContinue
        },
      }}
      modals={
        <>
          {/* Help Modal */}
          <StepModal
            open={modals.isOpen("help")}
            onOpenChange={(o: any) => o ? modals.open("help") : modals.close()}
            title="Need Help Selecting?"
            description="Guidance on choosing the right fellow and learners for assessment."
            width="md"
          >
            <div className="space-y-3 text-sm text-slate-600">
              <p><strong>Academic Term:</strong> Select the current teaching period.</p>
              <p><strong>Coach:</strong> Choose your assigned coach from the list.</p>
              <p><strong>Fellow:</strong> Pick a teacher to assess. You'll need to verify their email.</p>
              <p><strong>Learners:</strong> Select students from the fellow's classes to include in this assessment.</p>
            </div>
          </StepModal>

          {/* Email Confirmation Modal */}
          {showEmailModal && selectedFellow && (
            <EmailConfirmModal
              fellow={selectedFellow}
              onConfirm={() => {
                setVerified(true);
                setShowEmailModal(false);
              }}
              onClose={() => setShowEmailModal(false)}
            />
          )}
        </>
      }
    >
      <div className="grid gap-4 sm:gap-6">
        {/* Card: Selections */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Term */}
            <FormSelect
              label="Academic Term"
              value={term}
              onChange={(e) => setTerm(e.target.value as Term | "")}
              placeholder="Select term"
              options={["Term 1", "Term 2", "Term 3", "Term 4"]}
            />

            {/* Coach */}
            <FormSelect
              label="Coach Name"
              value={selectedCoach}
              onChange={(e) => handleCoachChange(e.target.value)}
              placeholder="Select coach"
              options={coaches}
            />

            {/* Fellow */}
            <FormSelect
              label="Fellow (Teacher)"
              value={selectedFellow?.id ?? ""}
              onChange={(e) => handleFellowChange(e.target.value)}
              placeholder={selectedCoach ? "Select fellow" : "Pick a coach first"}
              options={fellowsForCoach.map((f) => ({ label: f.name, value: f.id }))}
              disabled={!selectedCoach}
            />
          </div>

          {/* Help button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => modals.open("help")}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Need help selecting?
            </button>
          </div>
        </div>

        {/* Card: Fellow summary (after verification) */}
        {verified && selectedFellow && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-lg bg-[#304767]/10 p-2">
                <GraduationCap className="h-5 w-5 text-[#304767]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900">{selectedFellow.name}</h3>
                <dl className="mt-1 text-sm text-slate-700">
                  <div>
                    <dt className="inline font-medium">Coach: </dt>
                    <dd className="inline">{selectedFellow.coachName}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Email: </dt>
                    <dd className="inline">{selectedFellow.email}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Year: </dt>
                    <dd className="inline">{selectedFellow.yearOfFellowship}</dd>
                  </div>
                </dl>
                <div className="mt-2 flex items-center gap-2 text-emerald-700 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified — select learners below.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card: Learners by phase */}
        {verified && selectedFellow && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="grid gap-6">
              {Object.entries(learnersByPhase).map(([phase, learners]) => (
                <div key={phase}>
                  <div className="mb-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
                    {phase} Phase
                  </div>

                  {learners.length === 0 ? (
                    <div className="rounded-md border border-dashed border-slate-200 p-3 text-xs text-slate-500">
                      No learners in this phase.
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {learners.map((l) => (
                        <label
                          key={l.id}
                          className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span className="truncate">
                            {l.name}{" "}
                            <span className="text-xs text-slate-500">
                              ({l.grade} — {l.subject})
                            </span>
                          </span>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(l.id)}
                            onChange={() => toggleLearner(l.id)}
                            className="accent-[#304767] focus:ring-2 focus:ring-[#304767] focus:ring-offset-2 rounded"
                          />
                        </label>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no fellow selected */}
        {!verified && !selectedFellow && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">
              No fellow selected
            </h3>
            <p className="text-sm text-slate-500">
              Choose a coach and fellow above to get started with the assessment.
            </p>
          </div>
        )}
      </div>
    </StepScaffold>
  );
};

export default FellowSelectionStep;