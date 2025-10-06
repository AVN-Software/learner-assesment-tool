"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  User,
  Users,
  ClipboardCheck,
} from "lucide-react";

import { Learner, CompetencyId, keyFor, eKeyFor } from "@/types/assessment";
import { useAssessment } from "@/context/AssessmentProvider";

const SubmissionSummary: React.FC = () => {
  const {
    term,
    selectedCoach,
    selectedFellow,
    selectedLearners,
    assessments,
    evidences,
    completion,
    previousStep,
    resetAssessmentState,
  } = useAssessment();

  const allDone =
    completion.totalCells > 0 &&
    completion.completedCells === completion.totalCells;
  const hasMissingEvidence = completion.missingEvidence > 0;

  const handleSubmit = () => {
    // Build a minimal payload (swap this with Supabase call later)
    const payload = {
      meta: {
        term,
        coach: selectedCoach || (selectedFellow?.coachName ?? ""),
        fellowId: selectedFellow?.id ?? null,
        fellowName: selectedFellow?.name ?? "",
        submittedAt: new Date().toISOString(),
      },
      learners: selectedLearners.map((l: Learner) => ({
        id: l.id,
        name: l.name,
        grade: l.grade,
        subject: l.subject,
        phase: l.phase,
        competencies: (
          [
            "motivation",
            "teamwork",
            "analytical",
            "curiosity",
            "leadership",
          ] as CompetencyId[]
        ).map((c) => ({
          id: c,
          tier: assessments[keyFor(l.id, c)] ?? "",
          evidence: evidences[eKeyFor(l.id, c)] ?? "",
        })),
      })),
    };

    // For now, just log it (or replace with an API call)
    // eslint-disable-next-line no-console
    console.log("SUBMISSION PAYLOAD:", payload);

    // Tiny UX confirmation
    alert("Submission captured (console). Replace with your Supabase call.");

    // Optional: clear assessments after submit
    resetAssessmentState();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-[#304767]" />
          Review & Submit
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Quick summary of your selections and progress. Click **Submit** to
          capture the assessment.
        </p>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">Term</div>
          <div className="text-slate-900 font-semibold">{term || "—"}</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">Coach</div>
          <div className="text-slate-900 font-semibold">
            {selectedCoach || selectedFellow?.coachName || "—"}
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">Fellow</div>
          <div className="text-slate-900 font-semibold">
            {selectedFellow ? selectedFellow.name : "—"}
          </div>
        </div>
      </div>

      {/* People snapshot */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 border border-slate-200 rounded-xl p-4 bg-white">
          <div className="flex items-center gap-2 text-slate-700">
            <User className="w-4 h-4" />
            <span className="text-sm font-semibold">Fellow Details</span>
          </div>
          <dl className="mt-2 text-sm text-slate-700">
            <div>
              <dt className="inline text-slate-500">Name:&nbsp;</dt>
              <dd className="inline">{selectedFellow?.name || "—"}</dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Email:&nbsp;</dt>
              <dd className="inline">{selectedFellow?.email || "—"}</dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Year:&nbsp;</dt>
              <dd className="inline">
                {selectedFellow?.yearOfFellowship ?? "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex-1 border border-slate-2 00 rounded-xl p-4 bg-white">
          <div className="flex items-center gap-2 text-slate-700">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">Learners Selected</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {selectedLearners.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across all phases assigned to this fellow.
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="border border-slate-200 rounded-xl p-4 bg-white mb-8">
        <div className="text-sm text-slate-700 font-semibold mb-2">
          Assessment Progress
        </div>

        <div className="flex items-end gap-6">
          <div>
            <div className="text-xs text-slate-500">Total Cells</div>
            <div className="text-xl font-semibold text-slate-900">
              {completion.totalCells}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Completed</div>
            <div className="text-xl font-semibold text-slate-900">
              {completion.completedCells}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Missing Evidence</div>
            <div
              className={`text-xl font-semibold ${
                hasMissingEvidence ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {completion.missingEvidence}
            </div>
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full ${
              allDone ? "bg-emerald-500" : "bg-[#304767]"
            } transition-all`}
            style={{
              width:
                completion.totalCells === 0
                  ? "0%"
                  : `${Math.round(
                      (completion.completedCells / completion.totalCells) * 100
                    )}%`,
            }}
          />
        </div>

        <div className="mt-3 text-xs">
          {allDone ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              All tiers selected. You can submit.
            </span>
          ) : hasMissingEvidence ? (
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <AlertTriangle className="w-4 h-4" />
              Some evidence notes are missing. You can still submit, or go back
              to add notes.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-600">
              Continue completing tiers before submission.
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousStep}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium"
        >
          Back to Assessment
        </button>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-[#304767] hover:bg-[#22334a] text-white rounded-lg font-semibold text-sm"
          disabled={selectedLearners.length === 0}
        >
          Submit Assessment
        </button>
      </div>
    </div>
  );
};

export default SubmissionSummary;
