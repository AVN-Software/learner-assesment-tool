"use client";

import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  CheckCircle2,
  Users,
  User,
  BookOpen,
} from "lucide-react";

import { MOCK_FELLOWS, MOCK_LEARNERS } from "@/data/SAMPLE_DATA";
import { Phase, Term } from "@/types/core";
import { Fellow, Learner } from "@/types/people";

import { FormSelect } from "@/components/form";
import { EmailConfirmModal } from "@/components/modals/EmailConfirmModal";
import { Badge } from "@/components/ui/badge";
import { type StepKey } from "@/hooks/wizard-config";
import { StepScaffold } from "./StepContainer";
import { StepModal } from "@/hooks/StepModal";
import { useStepModals } from "@/hooks/useStepModals";
import { useAssessment } from "@/context/AssessmentProvider";

/**
 * Fellow Selection Step
 * - Select term, coach, and fellow
 * - Verify fellow via email confirmation
 * - Select grade/classroom
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
    stepInfo,
    navigation,
    nextStep,
    previousStep,
    goToStep,
  } = useAssessment();

  // ==================== LOCAL STATE ====================
  const [verified, setVerified] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  // Modal management
  const modals = useStepModals(["help"] as const);

  // ==================== DERIVED DATA ====================
  const coaches = useMemo(
    () => Array.from(new Set(MOCK_FELLOWS.map((f) => f.coachName))).sort(),
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

  const availableGrades = useMemo(() => {
    if (!selectedFellow) return [];
    return Array.from(new Set(learnersForFellow.map((l) => l.grade))).sort();
  }, [selectedFellow, learnersForFellow]);

  const filteredLearners = useMemo(() => {
    if (!selectedGrade) return learnersForFellow;
    return learnersForFellow.filter((l) => l.grade === selectedGrade);
  }, [learnersForFellow, selectedGrade]);

  const learnersByPhase = useMemo(() => {
    const phases: Phase[] = ["Foundation", "Intermediate", "Senior", "FET"];
    const map: Record<Phase, Learner[]> = {
      Foundation: [],
      Intermediate: [],
      Senior: [],
      FET: [],
    };
    
    for (const learner of filteredLearners) {
      const phase = learner.phase ?? "Foundation";
      if (map[phase]) map[phase].push(learner);
    }
    
    return Object.entries(map)
      .filter(([_, learners]) => learners.length > 0)
      .reduce((acc, [phase, learners]) => {
        acc[phase as Phase] = learners;
        return acc;
      }, {} as Record<Phase, Learner[]>);
  }, [filteredLearners]);

  const selectedIds = useMemo(
    () => new Set(selectedLearners.map((l: Learner) => l.id)),
    [selectedLearners]
  );

  // ==================== HANDLERS ====================
  const handleCoachChange = (val: string) => {
    setSelectedCoach(val);
    setSelectedFellow(null);
    setSelectedLearners([]);
    setSelectedGrade("");
    setVerified(false);
  };

  const handleFellowChange = (id: string) => {
    if (!id) {
      setSelectedFellow(null);
      setSelectedLearners([]);
      setSelectedGrade("");
      setVerified(false);
      return;
    }
    const fellow = MOCK_FELLOWS.find((f) => f.id === id) ?? null;
    setSelectedFellow(fellow);
    setSelectedLearners([]);
    setSelectedGrade("");
    setVerified(false);
    if (fellow) setShowEmailModal(true);
  };

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedLearners([]);
  };

  const toggleLearner = (learnerId: string) => {
    if (!selectedFellow || !selectedGrade) return;
    
    if (selectedIds.has(learnerId)) {
      setSelectedLearners(selectedLearners.filter((l: Learner) => l.id !== learnerId));
    } else {
      const learner = filteredLearners.find((l) => l.id === learnerId);
      if (learner) setSelectedLearners([...selectedLearners, learner]);
    }
  };

  const selectAllInPhase = (phase: Phase) => {
    const phaseLearners = learnersByPhase[phase] ?? [];
    const allSelected = phaseLearners.every((l) => selectedIds.has(l.id));
    
    if (allSelected) {
      const idsToRemove = new Set(phaseLearners.map((l) => l.id));
      setSelectedLearners(selectedLearners.filter((l: Learner) => !idsToRemove.has(l.id)));
    } else {
      const newLearners = phaseLearners.filter((l) => !selectedIds.has(l.id));
      setSelectedLearners([...selectedLearners, ...newLearners]);
    }
  };

  const selectAllInGrade = () => {
    const allSelected = filteredLearners.every((l) => selectedIds.has(l.id));
    
    if (allSelected) {
      const idsToRemove = new Set(filteredLearners.map((l) => l.id));
      setSelectedLearners(selectedLearners.filter((l: Learner) => !idsToRemove.has(l.id)));
    } else {
      const newLearners = filteredLearners.filter((l) => !selectedIds.has(l.id));
      setSelectedLearners([...selectedLearners, ...newLearners]);
    }
  };

  const handleEmailConfirm = () => {
    setVerified(true);
    setShowEmailModal(false);
  };

  // ==================== RENDER ====================
  return (
  <>
    {/* === MAIN STEP BODY === */}
    <div className="space-y-6">
      {/* Top Selection Fields */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormSelect
            label="Academic Term"
            value={term}
            onChange={(e) => setTerm(e.target.value as Term | "")}
            placeholder="Select term"
            options={["Term 1", "Term 2", "Term 3", "Term 4"]}
          />

          <FormSelect
            label="Coach Name"
            value={selectedCoach}
            onChange={(e) => handleCoachChange(e.target.value)}
            placeholder="Select coach"
            options={coaches}
          />

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

          <FormSelect
            label="Grade/Classroom"
            value={selectedGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
            placeholder={verified ? "Select grade" : "Verify fellow first"}
            options={availableGrades}
            disabled={!verified}
          />
        </div>

        {/* Help link */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => modals.open("help")}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium underline-offset-2 hover:underline transition-colors"
          >
            Need help selecting?
          </button>
        </div>
      </div>

      {/* Fellow Summary */}
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
                {selectedGrade && (
                  <div>
                    <dt className="inline font-medium">Classroom: </dt>
                    <dd className="inline">{selectedGrade}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 text-sm text-emerald-700 font-medium">
                {selectedGrade
                  ? "✓ Ready — select learners below"
                  : "✓ Select a grade/classroom to view learners"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Learner Selection */}
      {verified && selectedFellow && selectedGrade && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          {Object.keys(learnersByPhase).length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-slate-400 mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">
                No learners found
              </h3>
              <p className="text-sm text-slate-500">
                No learners found in {selectedGrade} for {selectedFellow.name}.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Learners in {selectedGrade}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Select learners to include in this assessment
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    {selectedLearners.length} / {filteredLearners.length} selected
                  </Badge>
                  <button
                    type="button"
                    onClick={selectAllInGrade}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {selectedLearners.length === filteredLearners.length
                      ? "Deselect all"
                      : "Select all"}
                  </button>
                </div>
              </div>

              {Object.entries(learnersByPhase).map(([phase, learners]) => {
                const phaseKey = phase as Phase;
                const allSelected = learners.every((l) => selectedIds.has(l.id));
                return (
                  <div key={phase} className="space-y-3">
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
                      >
                        {allSelected ? "Deselect all" : "Select all"}
                      </button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {learners.map((learner) => {
                        const isSelected = selectedIds.has(learner.id);
                        return (
                          <label
                            key={learner.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleLearner(learner.id)}
                              className="w-4 h-4 accent-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-slate-500" />
                                <span className="font-medium text-sm text-slate-900 truncate">
                                  {learner.name}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {learner.subject} • {learner.phase} Phase
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

      {/* Empty states */}
      {!verified && !selectedFellow && (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <GraduationCap className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            No fellow selected
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Choose a coach and fellow above, then verify their email to view
            and select learners for assessment.
          </p>
        </div>
      )}

      {verified && selectedFellow && !selectedGrade && (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <BookOpen className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Select a classroom
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Choose a grade/classroom from the dropdown above to view the
            learners in that class.
          </p>
        </div>
      )}
    </div>

    {/* Email Confirmation Modal */}
    {showEmailModal && selectedFellow && (
      <EmailConfirmModal
        fellow={selectedFellow}
        onConfirm={handleEmailConfirm}
        onClose={() => setShowEmailModal(false)}
      />
    )}
  </>
);

};

export default FellowSelectionStep;