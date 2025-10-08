"use client";

import React, { useState, useMemo } from "react";
import { GraduationCap, CheckCircle2, Users, User } from "lucide-react";
import { useAssessment } from "@/context/AssessmentProvider";
import { MOCK_FELLOWS, MOCK_LEARNERS } from "@/data/SAMPLE_DATA";
import { Phase, Term } from "@/types/core";
import { Fellow, Learner } from "@/types/people";
import StepScaffold, { StepModal, useStepModals } from "./StepContainer";
import { FormSelect } from "../form";
import { EmailConfirmModal } from "../modals/EmailConfirmModal";
import { Badge } from "@/components/ui/badge";

/**
 * Fellow Selection Step
 * - Select term, coach, and fellow
 * - Verify fellow via email confirmation
 * - Select learners grouped by phase
 */
const FellowSelectionStep: React.FC = () => {
  // ==================== CONTEXT ====================
  const {
    term,
    setTerm,
    selectedCoach,
    setSelectedCoach,
    selectedFellow,
    setSelectedFellow,
    selectedLearners,
    setSelectedLearners,
    navigation,
    nextStep,
    previousStep,
  } = useAssessment();

  // ==================== LOCAL STATE ====================
  const [verified, setVerified] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Modal management
  const modals = useStepModals(["help"] as const);

  // ==================== DERIVED DATA ====================
  
  // Get unique coaches
  const coaches = useMemo(
    () => Array.from(new Set(MOCK_FELLOWS.map((f) => f.coachName))).sort(),
    []
  );

  // Fellows filtered by selected coach
  const fellowsForCoach = useMemo<Fellow[]>(
    () =>
      selectedCoach
        ? MOCK_FELLOWS.filter((f) => f.coachName === selectedCoach)
        : [],
    [selectedCoach]
  );

  // Learners for selected fellow
  const learnersForFellow = useMemo<Learner[]>(
    () =>
      selectedFellow
        ? MOCK_LEARNERS.filter((l) => l.fellowId === selectedFellow.id)
        : [],
    [selectedFellow]
  );

  // Group learners by phase
  const learnersByPhase = useMemo(() => {
    const phases: Phase[] = ["Foundation", "Intermediate", "Senior", "FET"];
    const map: Record<Phase, Learner[]> = {
      Foundation: [],
      Intermediate: [],
      Senior: [],
      FET: [],
    };

    for (const learner of learnersForFellow) {
      const phase = learner.phase ?? "Foundation";
      if (map[phase]) {
        map[phase].push(learner);
      }
    }

    // Only return phases that have learners
    return Object.entries(map)
      .filter(([_, learners]) => learners.length > 0)
      .reduce((acc, [phase, learners]) => {
        acc[phase as Phase] = learners;
        return acc;
      }, {} as Record<Phase, Learner[]>);
  }, [learnersForFellow]);

  // Set of selected learner IDs for O(1) lookup
  const selectedIds = useMemo(
    () => new Set(selectedLearners.map((l) => l.id)),
    [selectedLearners]
  );

  // ==================== HANDLERS ====================

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

    const fellow = MOCK_FELLOWS.find((f) => f.id === id) ?? null;
    setSelectedFellow(fellow);
    setSelectedLearners([]);
    setVerified(false);

    // Show email confirmation modal
    if (fellow) {
      setShowEmailModal(true);
    }
  };

  const toggleLearner = (learnerId: string) => {
    if (!selectedFellow) return;

    if (selectedIds.has(learnerId)) {
      // Remove learner
      setSelectedLearners(selectedLearners.filter((l) => l.id !== learnerId));
    } else {
      // Add learner
      const learner = learnersForFellow.find((l) => l.id === learnerId);
      if (learner) {
        setSelectedLearners([...selectedLearners, learner]);
      }
    }
  };

  const selectAllInPhase = (phase: Phase) => {
    const phaseLearners = learnersByPhase[phase] ?? [];
    const allSelected = phaseLearners.every((l) => selectedIds.has(l.id));

    if (allSelected) {
      // Deselect all in this phase
      const idsToRemove = new Set(phaseLearners.map((l) => l.id));
      setSelectedLearners(selectedLearners.filter((l) => !idsToRemove.has(l.id)));
    } else {
      // Select all in this phase
      const newLearners = phaseLearners.filter((l) => !selectedIds.has(l.id));
      setSelectedLearners([...selectedLearners, ...newLearners]);
    }
  };

  const handleEmailConfirm = () => {
    setVerified(true);
    setShowEmailModal(false);
  };

  // ==================== RENDER ====================

  return (
    <StepScaffold
      title="Select Fellow & Learners"
      description="Choose the term, coach, fellow, and learners you'll be assessing."
      maxWidth="lg"
      actions={{
        leftHint: navigation.statusMessage,
        secondary: {
          label: "Back",
          onClick: previousStep,
        },
        primary: {
          label: selectedLearners.length > 0 
            ? `Continue (${selectedLearners.length} learner${selectedLearners.length !== 1 ? 's' : ''})` 
            : "Continue",
          onClick: nextStep,
          disabled: !navigation.canGoNext,
        },
      }}
      modals={
        <>
          {/* Help Modal */}
          <StepModal
            open={modals.isOpen("help")}
            onOpenChange={(open) => (open ? modals.open("help") : modals.close())}
            title="Need Help?"
            description="Guidance on selecting the right fellow and learners."
            width="md"
          >
            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Academic Term</h4>
                <p>Select the current teaching period for this assessment.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Coach</h4>
                <p>Choose your assigned coach. This will filter the available fellows.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Fellow</h4>
                <p>Pick a teacher to assess. You'll need to verify their email address.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Learners</h4>
                <p>
                  Select students from the fellow's classes to include in this assessment.
                  Learners are grouped by phase for easier selection.
                </p>
              </div>
            </div>
          </StepModal>

          {/* Email Confirmation Modal */}
          {showEmailModal && selectedFellow && (
            <EmailConfirmModal
              fellow={selectedFellow}
              onConfirm={handleEmailConfirm}
              onClose={() => setShowEmailModal(false)}
            />
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Selection Card */}
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
              placeholder={selectedCoach ? "Select fellow" : "Choose coach first"}
              options={fellowsForCoach.map((f) => ({
                label: f.name,
                value: f.id,
              }))}
              disabled={!selectedCoach}
            />
          </div>

          {/* Help Link */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => modals.open("help")}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium underline-offset-2 hover:underline transition-colors"
              aria-label="Open help dialog"
            >
              Need help selecting?
            </button>
          </div>
        </div>

        {/* Fellow Summary (After Verification) */}
        {verified && selectedFellow && (
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 sm:p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-emerald-100 p-3">
                <GraduationCap className="h-6 w-6 text-emerald-700" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 text-base">
                    {selectedFellow.name}
                  </h3>
                  <Badge className="bg-emerald-600 text-white">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <dl className="mt-2 space-y-1 text-sm text-slate-700">
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

                <p className="mt-3 text-sm text-emerald-700 font-medium">
                  ✓ Ready — select learners below
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Learner Selection (After Verification) */}
        {verified && selectedFellow && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            {Object.keys(learnersByPhase).length === 0 ? (
              // No learners found
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <h3 className="text-sm font-medium text-slate-900 mb-1">
                  No learners found
                </h3>
                <p className="text-sm text-slate-500">
                  This fellow doesn't have any learners assigned yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">
                    Select Learners
                  </h3>
                  <Badge variant="secondary">
                    {selectedLearners.length} / {learnersForFellow.length} selected
                  </Badge>
                </div>

                {/* Learners by Phase */}
                {Object.entries(learnersByPhase).map(([phase, learners]) => {
                  const phaseKey = phase as Phase;
                  const allSelected = learners.every((l) => selectedIds.has(l.id));
                  const someSelected =
                    learners.some((l) => selectedIds.has(l.id)) && !allSelected;

                  return (
                    <div key={phase} className="space-y-3">
                      {/* Phase Header */}
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-slate-600" />
                          <span className="font-medium text-sm text-slate-900">
                            {phase} Phase
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {learners.length}
                          </Badge>
                        </div>
                        <button
                          type="button"
                          onClick={() => selectAllInPhase(phaseKey)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          aria-label={
                            allSelected
                              ? `Deselect all learners in ${phase} phase`
                              : `Select all learners in ${phase} phase`
                          }
                        >
                          {allSelected ? "Deselect all" : "Select all"}
                        </button>
                      </div>

                      {/* Learner List */}
                      <div className="grid gap-2 sm:grid-cols-2">
                        {learners.map((learner) => {
                          const isSelected = selectedIds.has(learner.id);

                          return (
                            <label
                              key={learner.id}
                              className={`
                                flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                                ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }
                              `}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleLearner(learner.id)}
                                className="w-4 h-4 accent-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label={`Select ${learner.name}`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                  <span className="font-medium text-sm text-slate-900 truncate">
                                    {learner.name}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-0.5">
                                  {learner.grade} • {learner.subject}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Empty State (No Fellow Selected) */}
        {!verified && !selectedFellow && (
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <GraduationCap className="mx-auto h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              No fellow selected
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Choose a coach and fellow above, then verify their email to view and select learners for assessment.
            </p>
          </div>
        )}
      </div>
    </StepScaffold>
  );
};

export default FellowSelectionStep;