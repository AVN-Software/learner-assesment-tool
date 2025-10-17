"use client";

import React, { useMemo } from "react";
import { GraduationCap, Users, User, BookOpen } from "lucide-react";

import { MOCK_LEARNERS } from "@/data/SAMPLE_DATA";
import type { Phase } from "@/types/core";
import type { Learner } from "@/types/people";

import { FormSelect } from "@/components/form";
import { Badge } from "@/components/ui/badge";

import {
  useAssessment,
  GRADES,
  GRADE_LABELS,
  type Grade,
} from "@/context/AssessmentProvider";
import { FellowSummaryCard } from "../FellowSummaryCard";

/**
 * 🧑‍🏫 LearnerSelectionStep
 * - Allows selecting learners linked to the selected fellow
 * - Groups learners by phase
 * - Sets assessment grade
 */
const LearnerSelectionStep: React.FC = () => {
  // ==================== CONTEXT ====================
  const {
    selectedFellow,
    selectedLearners,
    setSelectedLearners,
    selectedGrade,
    setSelectedGrade,
  } = useAssessment();

  // ==================== DERIVED DATA ====================
  const learnersForFellow: Learner[] = useMemo(() => {
    if (!selectedFellow) return [];
    // note: ensure SAMPLE_DATA.Learner has consistent field naming
    return MOCK_LEARNERS.filter(
      (l) => l.fellowId === selectedFellow.id
    );
  }, [selectedFellow]);

  const learnersByPhase: Record<Phase, Learner[]> = useMemo(() => {
    const phases: Phase[] = ["Foundation", "Intermediate", "Senior", "FET"];
    const map: Record<Phase, Learner[]> = {
      Foundation: [],
      Intermediate: [],
      Senior: [],
      FET: [],
    };

    for (const learner of learnersForFellow) {
      const phase = (learner.phase as Phase) ?? "foundation";
      if (map[phase]) map[phase].push(learner);
    }
    return map;
  }, [learnersForFellow]);

  const selectedIds = useMemo(
    () => new Set(selectedLearners.map((l) => l.id)),
    [selectedLearners]
  );

  // ==================== HANDLERS ====================
  const handleGradeChange = (gradeValue: string): void => {
    if (GRADES.includes(gradeValue as Grade)) {
      setSelectedGrade(gradeValue as Grade);
    }
  };

  const toggleLearner = (learnerId: string): void => {
    if (!selectedFellow) return;

    if (selectedIds.has(learnerId)) {
      setSelectedLearners(
        selectedLearners.filter((l) => l.id !== learnerId)
      );
    } else {
      const learner = learnersForFellow.find(
        (l) => l.id === learnerId
      );
      if (learner) setSelectedLearners([...selectedLearners, learner]);
    }
  };

  const selectAllInPhase = (phase: Phase): void => {
    const phaseLearners = learnersByPhase[phase] ?? [];
    const allSelected = phaseLearners.every((l) =>
      selectedIds.has(l.id)
    );

    if (allSelected) {
      const idsToRemove = new Set(phaseLearners.map((l) => l.id));
      setSelectedLearners(
        selectedLearners.filter((l) => !idsToRemove.has(l.id))
      );
    } else {
      const newLearners = phaseLearners.filter(
        (l) => !selectedIds.has(l.id)
      );
      setSelectedLearners([...selectedLearners, ...newLearners]);
    }
  };

  const selectAllLearners = (): void => {
    const allSelected = learnersForFellow.every((l) =>
      selectedIds.has(l.id)
    );
    setSelectedLearners(allSelected ? [] : [...learnersForFellow]);
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Fellow Summary Card */}
      {selectedFellow && (
        <FellowSummaryCard
          fellow={selectedFellow}
          selectedGrade={selectedGrade}
          showGradePrompt={selectedLearners.length > 0}
        />
      )}

      {/* Learner Selection */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        {learnersForFellow.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">
              No learners found
            </h3>
            <p className="text-sm text-slate-500">
              No learners found for {selectedFellow?.name}.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-slate-600" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Select Learners
                  </h3>
                  <p className="text-sm text-slate-500">
                    Choose learners to include in this assessment
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {selectedLearners.length} / {learnersForFellow.length} selected
                </Badge>
                <button
                  type="button"
                  onClick={selectAllLearners}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {selectedLearners.length === learnersForFellow.length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>
            </div>

            {Object.entries(learnersByPhase)
              .filter(([, learners]) => learners.length > 0)
              .map(([phase, learners]) => {
                const phaseKey = phase as Phase;
                const allSelected = learners.every((l) =>
                  selectedIds.has(l.id)
                );
                return (
                  <div key={phase} className="space-y-3">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-sm text-slate-900 capitalize">
                          {phaseKey} Phase
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
                              onChange={() =>
                                toggleLearner(learner.id)
                              }
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
                                {learner.grade ?? "N/A"} •{" "}
                                {learner.phase ?? "N/A"} Phase
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

      {/* Grade Selection */}
      {selectedLearners.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Assessment Grade Level
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Select the grade level you&apos;re assessing these{" "}
                  {selectedLearners.length} learner
                  {selectedLearners.length !== 1 ? "s" : ""} for.
                </p>

                <div className="max-w-xs">
                  <FormSelect
                    label="Grade Level for Assessment"
                    value={selectedGrade}
                    onChange={(e) => handleGradeChange(e.target.value)}
                    placeholder="Select grade level"
                    options={GRADES.map((grade) => ({
                      value: grade,
                      label: GRADE_LABELS[grade],
                    }))}
                  />
                </div>
              </div>
            </div>

            {selectedGrade && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Selected:</span> Assessing{" "}
                  {selectedLearners.length} learner
                  {selectedLearners.length !== 1 ? "s" : ""} at{" "}
                  {GRADE_LABELS[selectedGrade]} level
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedLearners.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <Users className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            No learners selected
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Select learners from the list above. After selecting learners, you&apos;ll specify the grade level for the assessment.
          </p>
        </div>
      )}
    </div>
  );
};

export default LearnerSelectionStep;
