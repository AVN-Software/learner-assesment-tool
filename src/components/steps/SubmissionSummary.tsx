"use client";

import React, { useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  Send,
  ClipboardList,
  Info,
} from "lucide-react";
import { useAssessment } from "@/providers/AssessmentProvider";
import { useData } from "@/providers/DataProvider";
import { CompetencyId } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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

const TIER_SHORT: Record<string, "T1" | "T2" | "T3" | "—"> = {
  "": "—",
  tier1: "T1",
  tier2: "T2",
  tier3: "T3",
};

/** ---- Helpers ---- */
const getBucket = (val: string) =>
  val === "tier3"
    ? "T3"
    : val === "tier2"
    ? "T2"
    : val === "tier1"
    ? "T1"
    : "—";
const pct = (num: number, den: number) =>
  den > 0 ? Math.round((num / den) * 100) : 0;

const SubmissionSummary: React.FC = () => {
  const {
    selectedLearners,
    assessments,
    selectedGrade,
    selectedPhase,
    selectedTerm,
    completion,
    isComplete,
    nextStep,
  } = useAssessment();

  const { fellow } = useData();

  /** ------ Per-learner summaries ------ */
  const learnerSummaries = useMemo(() => {
    return selectedLearners.map((learner) => {
      const learnerAssessment = assessments[learner.id];

      const compTiers = COMPETENCIES.map((compId) => {
        const competency = learnerAssessment?.[compId];
        const tier = competency?.tier_score
          ? (`tier${competency.tier_score}` as const)
          : "";
        const evidence = competency?.evidence || "";
        return { comp: compId, tier, evidence };
      });

      const tierCounts = compTiers.reduce(
        (acc, t) => {
          const b = getBucket(t.tier);
          if (b === "T1") acc.T1 += 1;
          if (b === "T2") acc.T2 += 1;
          if (b === "T3") acc.T3 += 1;
          return acc;
        },
        { T1: 0, T2: 0, T3: 0 }
      );

      const setCount = compTiers.filter((t) => t.tier !== "").length;
      const evidenceCount = compTiers.filter(
        (t) => t.evidence.trim().length > 0
      ).length;

      const missingEvidence = compTiers
        .filter((t) => t.tier !== "" && t.evidence.trim().length === 0)
        .map((t) => t.comp);

      const unsetTiers = compTiers
        .filter((t) => t.tier === "")
        .map((t) => t.comp);

      return {
        learner,
        compTiers,
        tierCounts,
        allTiersSet: setCount === COMPETENCIES.length,
        allEvidencePresent: evidenceCount === COMPETENCIES.length,
        evidenceCount,
        missingEvidence,
        unsetTiers,
      };
    });
  }, [selectedLearners, assessments]);

  /** ------ Cohort metrics ------ */
  const totalPairs = selectedLearners.length * COMPETENCIES.length;
  const totalEvidencePairs = learnerSummaries.reduce(
    (acc, s) => acc + s.evidenceCount,
    0
  );
  const evidenceCoveragePct = pct(totalEvidencePairs, totalPairs);
  const learnersAssessed = learnerSummaries.filter((s) => s.allTiersSet).length;

  const overallBuckets = learnerSummaries.reduce(
    (acc, s) => {
      acc.T1 += s.tierCounts.T1;
      acc.T2 += s.tierCounts.T2;
      acc.T3 += s.tierCounts.T3;
      return acc;
    },
    { T1: 0, T2: 0, T3: 0 }
  );
  const bucketTotal =
    overallBuckets.T1 + overallBuckets.T2 + overallBuckets.T3 || 1;
  const bucketPct = {
    T3: pct(overallBuckets.T3, bucketTotal),
    T2: pct(overallBuckets.T2, bucketTotal),
    T1: pct(overallBuckets.T1, bucketTotal),
  };

  /** ------ Gaps ------ */
  const gaps = useMemo(() => {
    const items: {
      learner: (typeof selectedLearners)[0];
      type: "missingEvidence" | "unsetTier";
      comp: CompetencyId;
    }[] = [];
    learnerSummaries.forEach((s) => {
      s.missingEvidence.forEach((c) =>
        items.push({ learner: s.learner, type: "missingEvidence", comp: c })
      );
      s.unsetTiers.forEach((c) =>
        items.push({ learner: s.learner, type: "unsetTier", comp: c })
      );
    });
    return items;
  }, [learnerSummaries]);

  /** ------ Submission readiness ------ */
  const readyToSubmit = isComplete;

  /** ------ Payload + Submit ------ */
  const submissionPayload = useMemo(() => {
    return {
      meta: {
        term: selectedTerm,
        fellowId: fellow?.id ?? null,
        fellowName: fellow?.fellowname ?? "",
        fellowEmail: fellow?.email ?? "",
        coachName: fellow?.coachname ?? "",
        grade: selectedGrade,
        phase: selectedPhase,
        submittedAt: new Date().toISOString(),
      },
      statistics: {
        learnersSelected: selectedLearners.length,
        learnersAssessed,
        evidenceCoveragePct,
        tierBuckets: overallBuckets,
        completionPercentage: completion.completionPercentage,
      },
      learners: learnerSummaries.map((s) => ({
        id: s.learner.id,
        name: s.learner.learner_name,
        grade: selectedGrade,
        phase: selectedPhase,
        assessments: Object.fromEntries(
          s.compTiers.map((t) => [
            t.comp,
            {
              tier_score: parseInt(t.tier.replace("tier", "")) || null,
              evidence: t.evidence,
            },
          ])
        ),
      })),
      gaps: gaps.map((g) => ({
        learnerId: g.learner.id,
        competency: g.comp,
        type: g.type,
      })),
    };
  }, [
    selectedTerm,
    fellow,
    selectedGrade,
    selectedPhase,
    selectedLearners,
    learnersAssessed,
    evidenceCoveragePct,
    overallBuckets,
    completion,
    learnerSummaries,
    gaps,
  ]);

  const handleSubmit = async () => {
    try {
      console.log("📤 SUBMISSION PAYLOAD:", submissionPayload);
      // TODO: Replace with actual Supabase submission
      await new Promise((r) => setTimeout(r, 600));
      alert(
        "✅ Assessment submitted!\n\n" +
          `Fellow: ${fellow?.fellowname}\n` +
          `Learners assessed: ${learnersAssessed}/${selectedLearners.length}\n` +
          `Evidence coverage: ${evidenceCoveragePct}%\n\n` +
          "Check console for payload details."
      );
      // Navigate to next step or show success
      nextStep();
    } catch (e) {
      console.error(e);
      alert("❌ Submission failed. Please try again.");
    }
  };

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

  return (
    <div className="space-y-6">
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
              {selectedLearners.length}
            </div>
            <div className="text-xs text-slate-600 mt-1">Learners</div>
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
              {completion.completionPercentage}%
            </div>
            <div className="text-xs text-slate-600 mt-1">Overall Progress</div>
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
                  key={s.learner.id}
                  className={`${
                    idx % 2 ? "bg-slate-50/60" : "bg-white"
                  } border-b border-[#004854]/10`}
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="font-medium text-[#004854]">
                      {s.learner.learner_name}
                    </div>
                    <div className="text-xs text-[#32353C]/70">
                      {selectedGrade} • {selectedPhase}
                    </div>
                  </td>
                  {s.compTiers.map((t) => (
                    <td key={`${s.learner.id}-${t.comp}`} className="px-3 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[11px] ${
                          t.tier === "tier3"
                            ? "border-emerald-300 text-emerald-800 bg-emerald-50"
                            : t.tier === "tier2"
                            ? "border-blue-300 text-blue-800 bg-blue-50"
                            : t.tier === "tier1"
                            ? "border-amber-300 text-amber-800 bg-amber-50"
                            : "border-slate-300 text-slate-600 bg-slate-50"
                        }`}
                      >
                        {TIER_SHORT[t.tier || ""]}
                      </Badge>
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {s.compTiers.map((t) => (
                        <span
                          key={`${s.learner.id}-${t.comp}-e`}
                          title={`${COMP_LABEL[t.comp]}: ${
                            t.evidence.trim() ? "Has note" : "No note"
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

        <div className="flex justify-end pt-4 border-t border-[#004854]/12">
          <Button
            onClick={handleSubmit}
            disabled={!readyToSubmit}
            size="lg"
            className="bg-[#004854] hover:bg-[#003844] text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSummary;
