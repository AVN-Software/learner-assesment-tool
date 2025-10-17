"use client";

import React, { useMemo } from "react";
import { GraduationCap, Users, User, BookOpen } from "lucide-react";

import { MOCK_LEARNERS } from "@/data/SAMPLE_DATA";
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
 * - Requires grade selection before showing learners
 * - Filters learners by verified fellow (matched by name)
 * - Allows selecting learners and saves to context
 */
const LearnerSelectionStep: React.FC = () => {
  // ==================== CONTEXT ====================
  const {
    selectedFellow,
    selectedLearners,
    setSelectedLearners,
    selectedGrade,
    setSelectedGrade,
    isFellowVerified,
  } = useAssessment();

  // ==================== DERIVED DATA ====================
  const learnersForFellow: Learner[] = useMemo(() => {
    if (!selectedFellow?.name || !isFellowVerified) return [];
    const normalizedName = selectedFellow.name.trim().toLowerCase();
    return MOCK_LEARNERS.filter(
      (l) => l.fellowName?.trim().toLowerCase() === normalizedName
    );
  }, [selectedFellow, isFellowVerified]);

  const selectedIds = useMemo(
    () => new Set(selectedLearners.map((l) => l.id)),
    [selectedLearners]
  );

  // ==================== HANDLERS ====================
  const handleGradeChange = (gradeValue: string): void => {
    if (GRADES.includes(gradeValue as Grade)) {
      setSelectedGrade(gradeValue as Grade);
      setSelectedLearners([]); // reset learners when grade changes
    }
  };

  const toggleLearner = (learnerId: string): void => {
    if (!selectedFellow) return;

    if (selectedIds.has(learnerId)) {
      setSelectedLearners(selectedLearners.filter((l) => l.id !== learnerId));
    } else {
      const learner = learnersForFellow.find((l) => l.id === learnerId);
      if (learner) setSelectedLearners([...selectedLearners, learner]);
    }
  };

  const selectAllLearners = (): void => {
    const allSelected = learnersForFellow.every((l) => selectedIds.has(l.id));
    setSelectedLearners(allSelected ? [] : [...learnersForFellow]);
  };

  // ==================== RENDER ====================
  if (!selectedFellow || !isFellowVerified) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-slate-400 mb-3" />
        <h3 className="text-sm font-medium text-slate-900 mb-1">
          No verified fellow
        </h3>
        <p className="text-sm text-slate-500">
          Please verify a fellow first before selecting learners.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fellow Summary */}
      <FellowSummaryCard
        fellow={selectedFellow}
        selectedGrade={selectedGrade}
        showGradePrompt={true}
      />

      {/* ==================== Grade Selection FIRST ==================== */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Assessment Grade Level
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Select the grade level youre assessing for this fellows learners.
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
      </div>

      {/* ==================== Learner Selection (AFTER Grade Selected) ==================== */}
      {!selectedGrade ? (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Select a grade to continue
          </h3>
          <p className="text-sm text-slate-500">
            Once you choose a grade level, the learners for this fellow will appear below.
          </p>
        </div>
      ) : learnersForFellow.length === 0 ? (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-sm font-medium text-slate-900 mb-1">
            No learners found
          </h3>
          <p className="text-sm text-slate-500">
            No learners found for {selectedFellow.name}.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-6">
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

          <div className="grid gap-2 sm:grid-cols-2">
            {learnersForFellow.map((learner) => {
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
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerSelectionStep;