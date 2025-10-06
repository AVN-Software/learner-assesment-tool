"use client";

import { useMemo, useState } from "react";
import { useAssessment } from "@/context/AssessmentProvider";
import {
  Target,
  Users,
  Lightbulb,
  Search,
  Star,
  CheckCircle2,
  Send,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  StickyNote,
} from "lucide-react";
import { Learner } from "@/types/learner";
import { TierLevel } from "@/types/rubric";
import { CompetencyId } from "./RubricDisplay";
// Keep this aligned with your actual TIER_LABELS keys
type TierValue = "" | "tier1" | "tier2" | "tier3";
type TierKey = Exclude<TierValue, "">; // "tier1" | "tier2" | "tier3"

// Keep IDs aligned with the assessment table component.
const COMPETENCIES = [
  {
    id: "motivation",
    name: "Motivation & Self-Awareness",
    short: "MOT",
    icon: Target,
  },
  { id: "teamwork", name: "Teamwork", short: "TWK", icon: Users },
  {
    id: "analytical",
    name: "Analytical Thinking",
    short: "ANL",
    icon: Lightbulb,
  },
  {
    id: "curiosity",
    name: "Curiosity & Creativity",
    short: "CUR",
    icon: Search,
  },
  {
    id: "leadership",
    name: "Leadership & Social Influence",
    short: "LED",
    icon: Star,
  },
] as const;

const TIER_LABELS = {
  tier1: {
    label: "Tier 1",
    fullLabel: "Emerging",
    color: "bg-amber-100 text-amber-900 border-amber-300",
  },
  tier2: {
    label: "Tier 2",
    fullLabel: "Developing",
    color: "bg-blue-100 text-blue-900 border-blue-300",
  },
  tier3: {
    label: "Tier 3",
    fullLabel: "Advanced",
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
} as const;

const cx = (...c: (string | false | undefined)[]) =>
  c.filter(Boolean).join(" ");
const evidenceKey = (learnerId: string, compId: string) =>
  `${learnerId}_${compId}_evidence`;

export default function SubmissionSummary() {
  const {
    learners,
    assessments,
    session,
    getTierDistribution,

    // optional in context; handle if absent
    evidences: ctxEvidences = {},
  } = useAssessment();

  const [expandedLearner, setExpandedLearner] = useState<string | null>(null);
  const [openEvidence, setOpenEvidence] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tierDistribution = getTierDistribution();

  const totalAssessments = useMemo(
    () => Object.values(assessments).filter((v) => v !== "").length,
    [assessments]
  );

  // 1) Strong types for tiers and keyed maps
  type TierValue = "" | "tier1" | "tier2" | "tier3";

  type AssessmentKey = `${string}_${CompetencyId}`;
  type EvidenceKey = `${string}_${CompetencyId}_evidence`;

  type AssessmentMap = Record<AssessmentKey, TierValue>;
  type EvidenceMap = Partial<Record<EvidenceKey, string>>;

  // 2) Key helpers with literal return types
  const aKey = (learnerId: string, compId: CompetencyId) =>
    `${learnerId}_${compId}` as const;
  const eKey = (learnerId: string, compId: CompetencyId) =>
    `${learnerId}_${compId}_evidence` as const;

  // 3) Narrow the context shapes locally (non-destructive)
  const typedAssessments = assessments as AssessmentMap;
  const typedEvidences = (ctxEvidences ?? {}) as EvidenceMap;

  // 4) Fully typed helper
  const getLearnerAssessments = (learnerId: string) =>
    COMPETENCIES.map((comp) => {
      const ak = aKey(learnerId, comp.id);
      const ek = eKey(learnerId, comp.id);
      return {
        competency: comp,
        tier: typedAssessments[ak] ?? "",
        evidence: typedEvidences[ek] ?? "",
      };
    });

  // 5) Typed aggregate with safe access
  const assessedWithoutEvidenceCount = useMemo(() => {
    let count = 0;
    for (const learner of learners) {
      for (const comp of COMPETENCIES) {
        const ak = aKey(learner.id, comp.id);
        const ek = eKey(learner.id, comp.id);
        const t = typedAssessments[ak] ?? "";
        const ev = typedEvidences[ek] ?? "";
        if (t && !ev) count += 1;
      }
    }
    return count;
  }, [learners, typedAssessments, typedEvidences]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1200));
    setIsSubmitting(false);
    // Navigate/Reset
    alert("Assessment submitted successfully!");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Review & Submit Assessment
        </h2>
        {session && (
          <div className="text-xs sm:text-sm text-slate-600">
            <span className="font-medium">Fellow:</span> {session.fellowName} •{" "}
            <span className="font-medium">Coach:</span> {session.coachName} •{" "}
            <span className="font-medium">Term:</span> {session.term}
          </div>
        )}
      </div>
      <p className="text-slate-600 mb-6 sm:mb-8 text-sm">
        Quick check of scores and optional evidence notes per competency.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl border-2 border-slate-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Total Assessed
            </p>
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">
            {totalAssessments}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
            {learners.length} learners
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs sm:text-sm text-amber-900 font-semibold">
              Emerging
            </p>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-900">
            {tierDistribution.tier1}
          </p>
          <p className="text-[11px] sm:text-xs text-amber-700 mt-1">
            Tier 1 scores
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs sm:text-sm text-blue-900 font-semibold">
              Developing
            </p>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900">
            {tierDistribution.tier2}
          </p>
          <p className="text-[11px] sm:text-xs text-blue-700 mt-1">
            Tier 2 scores
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs sm:text-sm text-emerald-900 font-semibold">
              Advanced
            </p>
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-900">
            {tierDistribution.tier3}
          </p>
          <p className="text-[11px] sm:text-xs text-emerald-700 mt-1">
            Tier 3 scores
          </p>
        </div>
      </div>

      {/* Missing evidence chip */}
      <div
        className={cx(
          "rounded-lg border p-3 sm:p-4 mb-6 sm:mb-8",
          assessedWithoutEvidenceCount > 0
            ? "border-amber-300 bg-amber-50"
            : "border-emerald-300 bg-emerald-50"
        )}
      >
        <div className="text-xs sm:text-sm">
          {assessedWithoutEvidenceCount > 0 ? (
            <span className="text-amber-800">
              <strong>{assessedWithoutEvidenceCount}</strong> scored
              competencies have <strong>no evidence note</strong>. Notes are
              optional, but you may add quick context before submitting.
            </span>
          ) : (
            <span className="text-emerald-800">
              All scored competencies have evidence notes attached. Nice!
            </span>
          )}
        </div>
      </div>

      {/* Summary list */}
      <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden mb-8">
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Assessment Summary
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {learners.map((learner: Learner) => {
            const learnerAssessments = getLearnerAssessments(learner.id);
            const completedCount = learnerAssessments.filter(
              (a) => a.tier !== ""
            ).length;
            const isComplete = completedCount === COMPETENCIES.length;
            const missingEvForLearner = learnerAssessments.filter(
              (a) => a.tier && !a.evidence
            ).length;
            const isExpanded = expandedLearner === learner.id;

            return (
              <div key={learner.id}>
                <button
                  onClick={() =>
                    setExpandedLearner(isExpanded ? null : learner.id)
                  }
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={cx(
                        "w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm",
                        isComplete
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {learner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {learner.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <span>{learner.grade}</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full" />
                        <span className="capitalize">{learner.phase}</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full" />
                        <span className="font-medium">
                          {completedCount}/{COMPETENCIES.length} assessed
                        </span>
                        {missingEvForLearner > 0 && (
                          <>
                            <span className="w-1 h-1 bg-slate-400 rounded-full" />
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                              <StickyNote className="w-3 h-3" />
                              {missingEvForLearner} no evidence
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {isComplete && (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 sm:pb-6 bg-slate-50">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {learnerAssessments.map(
                        ({ competency, tier, evidence }) => {
                          const Icon = competency.icon;
                          const tierInfo = tier
                            ? TIER_LABELS[tier as TierKey]
                            : null;
                          const evKey = evidenceKey(learner.id, competency.id);
                          const show = !!openEvidence[evKey];

                          return (
                            <div
                              key={competency.id}
                              className="flex flex-col gap-2 p-3 sm:p-4 bg-white rounded-lg border border-slate-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                  <Icon className="w-5 h-5 text-slate-700" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900 text-sm">
                                    {competency.name}
                                  </p>
                                  {tierInfo ? (
                                    <span
                                      className={cx(
                                        "inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-bold border",
                                        tierInfo.color
                                      )}
                                    >
                                      {tierInfo.label} • {tierInfo.fullLabel}
                                    </span>
                                  ) : (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-medium bg-slate-100 text-slate-600">
                                      Not assessed
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Evidence pill / viewer (optional) */}
                              {tier ? (
                                <div className="flex items-center justify-between">
                                  {evidence ? (
                                    <button
                                      className="text-xs sm:text-sm text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                                      onClick={() =>
                                        setOpenEvidence((prev) => ({
                                          ...prev,
                                          [evKey]: !prev[evKey],
                                        }))
                                      }
                                    >
                                      <StickyNote className="w-4 h-4 text-emerald-600" />
                                      {show ? "Hide note" : "View note"}
                                    </button>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 text-amber-900 text-[11px] sm:text-xs">
                                      <StickyNote className="w-3.5 h-3.5" />
                                      No evidence
                                    </span>
                                  )}
                                </div>
                              ) : null}

                              {show && evidence && (
                                <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-[12px] sm:text-sm text-slate-700">
                                  {evidence}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={cx(
          "w-full flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all",
          isSubmitting
            ? "bg-slate-400 text-white cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl hover:scale-[1.01]"
        )}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            Submit Assessment
          </>
        )}
      </button>
    </div>
  );
}
