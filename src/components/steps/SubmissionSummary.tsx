"use client";

import React, { useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  User,
  Users,
  ClipboardCheck,
  Award,
  Calendar,
  Mail,
  GraduationCap,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentProvider";
import { CompetencyId } from "@/types/rubric";
import { Learner } from "@/types/people";

import { type StepKey } from "@/hooks/wizard-config";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StepScaffold } from "./StepContainer";

/**
 * Submission Summary Step
 * - Review all selections and assessment progress
 * - Display completion statistics
 * - Submit assessment data
 */
const SubmissionSummary: React.FC = () => {
  // ==================== CONTEXT ====================
  const {
    term,
    selectedCoach,
    selectedFellow,
    selectedLearners,
    assessments,
    evidences,
    completion,
    navigation,
    previousStep,
    resetAssessmentState,
    stepInfo,
    nextStep,
    goToStep,
  } = useAssessment();

  // ==================== DERIVED STATE ====================

  const isComplete =
    completion.totalCells > 0 &&
    completion.completedCells === completion.totalCells;

  const hasMissingEvidence = completion.missingEvidence > 0;
  const canSubmit = completion.completedCells > 0;

  const submissionPayload = useMemo(() => {
    const competencyIds: CompetencyId[] = [
      "motivation",
      "teamwork",
      "analytical",
      "curiosity",
      "leadership",
    ];

    return {
      meta: {
        term,
        coach: selectedCoach || selectedFellow?.coachName || "",
        fellowId: selectedFellow?.id ?? null,
        fellowName: selectedFellow?.name ?? "",
        fellowEmail: selectedFellow?.email ?? "",
        submittedAt: new Date().toISOString(),
      },
      statistics: {
        totalCells: completion.totalCells,
        completedCells: completion.completedCells,
        missingEvidence: completion.missingEvidence,
        completionPercentage: completion.completionPercentage,
      },
      learners: selectedLearners.map((learner: Learner) => ({
        id: learner.id,
        name: learner.name,
        grade: learner.grade,
        subject: learner.subject,
        phase: learner.phase,
        competencies: competencyIds.map((compId) => {
          const key = `${learner.id}_${compId}`;
          const evidenceKey = `${key}_evidence`;
          return {
            id: compId,
            tier: assessments[key] || "",
            evidence: evidences[evidenceKey] || "",
          };
        }),
      })),
    };
  }, [
    term,
    selectedCoach,
    selectedFellow,
    selectedLearners,
    assessments,
    evidences,
    completion,
  ]);

  // ==================== HANDLERS ====================

  const handleSubmit = async () => {
    try {
      console.log("📤 SUBMISSION PAYLOAD:", submissionPayload);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        "✅ Assessment submitted successfully!\n\n" +
          `Fellow: ${selectedFellow?.name}\n` +
          `Learners: ${selectedLearners.length}\n` +
          `Completion: ${completion.completionPercentage}%\n\n` +
          "Check console for payload details."
      );

      // resetAssessmentState(); // optional
    } catch (error) {
      console.error("Submission error:", error);
      alert("❌ Submission failed. Please try again.");
    }
  };

  // ==================== STATUS MESSAGE ====================

  const getStatusAlert = () => {
    if (isComplete) {
      return {
        icon: CheckCircle2,
        className: "border-emerald-200 bg-emerald-50",
        iconClassName: "text-emerald-600",
        message: "All assessments complete! Ready to submit.",
      };
    }

    if (hasMissingEvidence) {
      return {
        icon: AlertTriangle,
        className: "border-amber-200 bg-amber-50",
        iconClassName: "text-amber-600",
        message: `${completion.missingEvidence} assessment${
          completion.missingEvidence !== 1 ? "s" : ""
        } missing evidence notes. You can still submit or go back to add them.`,
      };
    }

    if (!canSubmit) {
      return {
        icon: AlertTriangle,
        className: "border-red-200 bg-red-50",
        iconClassName: "text-red-600",
        message:
          "No assessments completed yet. Go back to complete assessments.",
      };
    }

    return {
      icon: ClipboardCheck,
      className: "border-blue-200 bg-blue-50",
      iconClassName: "text-blue-600",
      message: `${completion.completedCells}/${completion.totalCells} assessments completed. Continue to complete remaining assessments.`,
    };
  };

  const statusAlert = getStatusAlert();

  // ==================== RENDER ====================

  return (
    <StepScaffold<StepKey>
      stepInfo={stepInfo}
      navigation={navigation}
      onNext={nextStep}
      onPrevious={previousStep}
      onGoToStep={goToStep}
      title="Review & Submit"
      description="Review your selections and assessment progress before final submission."
      maxWidth="lg"
      actions={{
        leftHint: `${completion.completedCells}/${completion.totalCells} completed (${completion.completionPercentage}%)`,
        secondary: {
          label: "Back to Assessment",
          onClick: previousStep,
        },
        primary: {
          label: isComplete ? "Submit Assessment ✓" : "Submit Assessment",
          onClick: handleSubmit,
          disabled: !canSubmit,
        },
      }}
    >
      <div className="space-y-6 pb-6">
        {/* Status Alert */}
        <Alert className={statusAlert.className}>
          <statusAlert.icon
            className={`h-4 w-4 ${statusAlert.iconClassName}`}
          />
          <AlertDescription className="text-sm font-medium">
            {statusAlert.message}
          </AlertDescription>
        </Alert>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Term
            </div>
            <div className="text-slate-900 font-semibold text-base">
              {term || "—"}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <User className="w-3.5 h-3.5" />
              Coach
            </div>
            <div className="text-slate-900 font-semibold text-base">
              {selectedCoach || selectedFellow?.coachName || "—"}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Fellow
            </div>
            <div className="text-slate-900 font-semibold text-base truncate">
              {selectedFellow?.name || "—"}
            </div>
          </div>
        </div>

        {/* Fellow & Learners Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fellow Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Fellow Details</h3>
            </div>

            {selectedFellow ? (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Name:</dt>
                  <dd className="text-slate-900 font-medium">
                    {selectedFellow.name}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Email:</dt>
                  <dd className="text-slate-900 font-medium flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {selectedFellow.email}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Year:</dt>
                  <dd className="text-slate-900 font-medium">
                    {selectedFellow.yearOfFellowship}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Coach:</dt>
                  <dd className="text-slate-900 font-medium">
                    {selectedFellow.coachName}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-slate-500">No fellow selected</p>
            )}
          </div>

          {/* Learners Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Learners</h3>
            </div>

            <div className="text-center py-4">
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {selectedLearners.length}
              </div>
              <p className="text-sm text-slate-600">
                {selectedLearners.length === 1 ? "Learner" : "Learners"} selected
                for assessment
              </p>
            </div>

            {selectedLearners.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(selectedLearners.map((l) => l.phase ?? "Unknown"))
                  ).map((phase) => (
                    <Badge key={phase} variant="outline" className="text-xs">
                      {phase}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assessment Progress */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">
              Assessment Progress
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {completion.totalCells}
              </div>
              <div className="text-xs text-slate-600 mt-1">Total Cells</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {completion.completedCells}
              </div>
              <div className="text-xs text-slate-600 mt-1">Completed</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  hasMissingEvidence
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
              >
                {completion.missingEvidence}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Missing Evidence
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Completion</span>
              <span className="font-semibold text-slate-900">
                {completion.completionPercentage}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isComplete
                    ? "bg-emerald-500"
                    : completion.completionPercentage > 50
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${completion.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Note:</strong> Once submitted,
            this assessment will be recorded with a timestamp. You can review
            the submission payload in the browser console.
          </p>
        </div>
      </div>
    </StepScaffold>
  );
};

export default SubmissionSummary;
