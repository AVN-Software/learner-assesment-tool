"use client";

import React, { useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Users,
  ClipboardList,
  Info,
} from "lucide-react";
import { useAssessment } from "@/providers/AssessmentProvider";
import { useData } from "@/providers/DataProvider";
import { CompetencyId } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

/** ---- Config ---- */
const COMPETENCIES: CompetencyId[] = [
  "motivation",
  "teamwork",
  "analytical",
  "curiosity",
  "leadership",
];

const COMP_LABEL: Record<CompetencyId, string> = {
  motivation: "Motivation",
  teamwork: "Teamwork",
  analytical: "Analytical",
  curiosity: "Curiosity",
  leadership: "Leadership",
};

const TIER_LABEL: Record<number, string> = {
  1: "T1",
  2: "T2",
  3: "T3",
};

const SubmissionSummary: React.FC = () => {
  const { assessmentDrafts, isComplete, completionStats, mode } =
    useAssessment();

  const { fellowData } = useData();

  /** ------ Per-learner summaries ------ */
  const learnerSummaries = useMemo(() => {
    return assessmentDrafts.map((draft) => {
      const compTiers = COMPETENCIES.map((compId) => {
        const competency = draft[compId];
        const tier = competency.tierScore;
        const evidence = competency.evidence || "";
        return { comp: compId, tier, evidence };
      });

      const tierCounts = compTiers.reduce(
        (acc, t) => {
          if (t.tier === 1) acc.T1 += 1;
          if (t.tier === 2) acc.T2 += 1;
          if (t.tier === 3) acc.T3 += 1;
          return acc;
        },
        { T1: 0, T2: 0, T3: 0 }
      );

      const setCount = compTiers.filter((t) => t.tier !== null).length;
      const evidenceCount = compTiers.filter(
        (t) => t.evidence.trim().length > 0
      ).length;

      const missingEvidence = compTiers
        .filter((t) => t.tier !== null && t.evidence.trim().length === 0)
        .map((t) => t.comp);

      const unsetTiers = compTiers
        .filter((t) => t.tier === null)
        .map((t) => t.comp);

      return {
        draft,
        compTiers,
        tierCounts,
        allTiersSet: setCount === COMPETENCIES.length,
        allEvidencePresent: evidenceCount === COMPETENCIES.length,
        evidenceCount,
        missingEvidence,
        unsetTiers,
      };
    });
  }, [assessmentDrafts]);

  /** ------ Cohort metrics ------ */
  const totalPairs = assessmentDrafts.length * COMPETENCIES.length;
  const totalEvidencePairs = learnerSummaries.reduce(
    (acc, s) => acc + s.evidenceCount,
    0
  );
  const evidenceCoveragePct =
    totalPairs > 0 ? Math.round((totalEvidencePairs / totalPairs) * 100) : 0;

  const learnersAssessed = learnerSummaries.filter(
    (s) => s.allTiersSet && s.allEvidencePresent
  ).length;

  const overallBuckets = learnerSummaries.reduce(
    (acc, s) => {
      acc.T1 += s.tierCounts.T1;
      acc.T2 += s.tierCounts.T2;
      acc.T3 += s.tierCounts.T3;
      return acc;
    },
    { T1: 0, T2: 0, T3: 0 }
  );

  /** ------ Gaps ------ */
  const gaps = useMemo(() => {
    const items: {
      learnerId: string;
      learnerName: string;
      type: "missingEvidence" | "unsetTier";
      comp: CompetencyId;
    }[] = [];
    learnerSummaries.forEach((s) => {
      s.missingEvidence.forEach((c) =>
        items.push({
          learnerId: s.draft.learnerId,
          learnerName: s.draft.learnerName,
          type: "missingEvidence",
          comp: c,
        })
      );
      s.unsetTiers.forEach((c) =>
        items.push({
          learnerId: s.draft.learnerId,
          learnerName: s.draft.learnerName,
          type: "unsetTier",
          comp: c,
        })
      );
    });
    return items;
  }, [learnerSummaries]);

  /** ------ Submission readiness ------ */
  const readyToSubmit = isComplete;

  /** ------ Status banner ------ */
  const StatusIcon = readyToSubmit
    ? CheckCircle2
    : gaps.length > 0
    ? AlertTriangle
    : Info;
  const statusBg = readyToSubmit
    ? "border-emerald-200 bg-emerald-50"
    : gaps.length > 0
    ? "border-amber-200 bg-amber-50"
    : "border-[#004854]/20 bg-[#8ED1C1]/10";
  const statusMsg = readyToSubmit
    ? "All learners fully assessed with evidence. Ready to submit."
    : gaps.length > 0
    ? `${gaps.length} gap${
        gaps.length === 1 ? "" : "s"
      } to resolve before submission.`
    : "Assess learners and add evidence to proceed.";

  const isEditMode = mode?.type === "edit";

  if (!fellowData) return null;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#004854]">Review & Submit</h2>
          <p className="text-sm text-slate-600 mt-1">
            {isEditMode
              ? "Review changes before updating assessment"
              : "Review assessments before final submission"}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {fellowData.grade} • {fellowData.phase}
        </Badge>
      </div>

      {/* Status */}
      <Alert className={statusBg}>
        <StatusIcon
          className={`h-4 w-4 ${
            readyToSubmit
              ? "text-emerald-600"
              : gaps.length
              ? "text-amber-600"
              : "text-[#004854]"
          }`}
        />
        <AlertDescription className="text-sm font-medium">
          {statusMsg}
        </AlertDescription>
      </Alert>

      {/* Assessment Overview */}
      <div className="rounded-xl border border-[#004854]/12 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#8ED1C1]/20 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-[#004854]" />
          </div>
          <h3 className="font-semibold text-[#004854]">Assessment Overview</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-2xl font-bold text-[#004854]">
              {assessmentDrafts.length}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {isEditMode ? "Learner" : "Learners"}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-2xl font-bold text-[#004854]">
              {learnersAssessed}
            </div>
            <div className="text-xs text-slate-600 mt-1">Completed</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-2xl font-bold text-[#004854]">
              {evidenceCoveragePct}%
            </div>
            <div className="text-xs text-slate-600 mt-1">Evidence Coverage</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-2xl font-bold text-[#004854]">
              {completionStats.completionPercentage}%
            </div>
            <div className="text-xs text-slate-600 mt-1">Overall Progress</div>
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="mt-4 pt-4 border-t border-[#004854]/12">
          <p className="text-xs font-semibold text-[#004854] mb-2">
            Tier Distribution
          </p>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-600">
                T3: {overallBuckets.T3}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-slate-600">
                T2: {overallBuckets.T2}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-slate-600">
                T1: {overallBuckets.T1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Learner Summary */}
      <div className="rounded-xl border border-[#004854]/12 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#8ED1C1]/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#004854]" />
          </div>
          <h3 className="font-semibold text-[#004854]">Per-Learner Summary</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-white bg-gradient-to-r from-[#004854] to-[#0a5e6c]">
                <th className="px-3 py-2 rounded-l-md">Learner</th>
                {COMPETENCIES.map((c) => (
                  <th key={c} className="px-3 py-2">
                    {COMP_LABEL[c]}
                  </th>
                ))}
                <th className="px-3 py-2 text-center rounded-r-md">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {learnerSummaries.map((s, idx) => (
                <tr
                  key={s.draft.learnerId}
                  className={`${
                    idx % 2 ? "bg-slate-50/60" : "bg-white"
                  } border-b border-[#004854]/10`}
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="font-medium text-[#004854]">
                      {s.draft.learnerName}
                    </div>
                    <div className="text-xs text-[#32353C]/70">
                      {fellowData.grade} • {fellowData.phase}
                    </div>
                  </td>
                  {s.compTiers.map((t) => (
                    <td
                      key={`${s.draft.learnerId}-${t.comp}`}
                      className="px-3 py-3"
                    >
                      <Badge
                        variant="outline"
                        className={`text-[11px] ${
                          t.tier === 3
                            ? "border-emerald-300 text-emerald-800 bg-emerald-50"
                            : t.tier === 2
                            ? "border-blue-300 text-blue-800 bg-blue-50"
                            : t.tier === 1
                            ? "border-amber-300 text-amber-800 bg-amber-50"
                            : "border-slate-300 text-slate-600 bg-slate-50"
                        }`}
                      >
                        {t.tier ? TIER_LABEL[t.tier] : "—"}
                      </Badge>
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {s.compTiers.map((t) => (
                        <span
                          key={`${s.draft.learnerId}-${t.comp}-e`}
                          title={`${COMP_LABEL[t.comp]}: ${
                            t.evidence.trim() ? "Has evidence" : "No evidence"
                          }`}
                          className={`inline-block h-2.5 w-2.5 rounded-full ${
                            t.evidence.trim()
                              ? "bg-emerald-500"
                              : "bg-amber-400"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {learnerSummaries.length === 0 && (
                <tr>
                  <td
                    colSpan={COMPETENCIES.length + 2}
                    className="px-3 py-6 text-center text-[#32353C]/70"
                  >
                    No learners selected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Gaps Warning */}
        {gaps.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs font-semibold text-amber-900 mb-2">
              ⚠️ Issues to Resolve ({gaps.length})
            </p>
            <div className="space-y-1">
              {gaps.slice(0, 5).map((g, i) => (
                <p key={i} className="text-xs text-amber-800">
                  • {g.learnerName} - {COMP_LABEL[g.comp]}:{" "}
                  {g.type === "unsetTier"
                    ? "Tier not selected"
                    : "Evidence missing"}
                </p>
              ))}
              {gaps.length > 5 && (
                <p className="text-xs text-amber-700 italic">
                  ...and {gaps.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionSummary;
