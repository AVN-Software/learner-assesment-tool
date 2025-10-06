"use client";

import { useMemo, useState } from "react";
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
import { Learner } from "@/app/page";

/* ---------------------------------------------------------------------------
   🧩 TYPES
--------------------------------------------------------------------------- */

/** Tier level values (used for scoring) */
export type TierValue = "" | "tier1" | "tier2" | "tier3";
export type TierKey = Exclude<TierValue, "">;

/** Map of all learner-competency scores */
export type AssessmentMap = Record<string, TierValue>;

/** Map of all learner-competency evidence notes */
export type EvidenceMap = Record<string, string>;

/** Props for the SubmissionSummary component */
export interface SubmissionSummaryProps {
  /** The learners who were assessed (for display context only) */
  learners: Learner[];

  /** All assessment results keyed as learnerId_competencyId */
  assessments: AssessmentMap;

  /** Optional map of evidence notes keyed as learnerId_competencyId_evidence */
  evidences?: EvidenceMap;

  /** Handler for when the user submits all assessments */
  onSubmit?: (submission: {
    assessments: AssessmentMap;
    evidences: EvidenceMap;
  }) => Promise<void> | void;
}

/* ---------------------------------------------------------------------------
   🧠 CONSTANTS
--------------------------------------------------------------------------- */

const COMPETENCIES = [
  { id: "motivation", name: "Motivation & Self-Awareness", icon: Target },
  { id: "teamwork", name: "Teamwork", icon: Users },
  { id: "analytical", name: "Analytical Thinking", icon: Lightbulb },
  { id: "curiosity", name: "Curiosity & Creativity", icon: Search },
  { id: "leadership", name: "Leadership & Social Influence", icon: Star },
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

const eKey = (learnerId: string, compId: string) =>
  `${learnerId}_${compId}_evidence`;

/* ---------------------------------------------------------------------------
   🧾 COMPONENT
--------------------------------------------------------------------------- */
export default function SubmissionSummary({
  learners,
  assessments,
  evidences = {},
  onSubmit,
}: SubmissionSummaryProps) {
  const [expandedLearner, setExpandedLearner] = useState<string | null>(null);
  const [openEvidence, setOpenEvidence] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Total scored items
  const totalAssessments = useMemo(
    () => Object.values(assessments).filter((v) => v !== "").length,
    [assessments]
  );

  // Tier distribution
  const tierDistribution = useMemo(() => {
    const counts = { tier1: 0, tier2: 0, tier3: 0 };
    Object.values(assessments).forEach((t) => {
      if (t === "tier1" || t === "tier2" || t === "tier3") counts[t] += 1;
    });
    return counts;
  }, [assessments]);

  // Missing evidence count
  const assessedWithoutEvidenceCount = useMemo(() => {
    let count = 0;
    for (const learner of learners) {
      for (const comp of COMPETENCIES) {
        const key = `${learner.id}_${comp.id}`;
        const tier = assessments[key];
        const evidence = evidences[eKey(learner.id, comp.id)];
        if (tier && !evidence) count += 1;
      }
    }
    return count;
  }, [learners, assessments, evidences]);

  // Handle submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (onSubmit) await onSubmit({ assessments, evidences });
      else alert("Submitted!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLearnerAssessments = (learnerId: string) =>
    COMPETENCIES.map((comp) => {
      const key = `${learnerId}_${comp.id}`;
      const evKey = eKey(learnerId, comp.id);
      return {
        competency: comp,
        tier: assessments[key] || "",
        evidence: evidences[evKey] || "",
      };
    });

  /* -----------------------------------------------------------------------
     🖥️ UI
  ----------------------------------------------------------------------- */
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
        Review & Submit Assessment
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-600 font-medium mb-1">
            Total Assessed
          </p>
          <p className="text-3xl font-bold text-slate-900">
            {totalAssessments}
          </p>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-900 font-semibold mb-1">Emerging</p>
          <p className="text-3xl font-bold text-amber-900">
            {tierDistribution.tier1}
          </p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900 font-semibold mb-1">Developing</p>
          <p className="text-3xl font-bold text-blue-900">
            {tierDistribution.tier2}
          </p>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-900 font-semibold mb-1">
            Advanced
          </p>
          <p className="text-3xl font-bold text-emerald-900">
            {tierDistribution.tier3}
          </p>
        </div>
      </div>

      {/* Evidence Notice */}
      <div
        className={cx(
          "rounded-lg border p-4 mb-8 text-sm",
          assessedWithoutEvidenceCount > 0
            ? "border-amber-300 bg-amber-50 text-amber-800"
            : "border-emerald-300 bg-emerald-50 text-emerald-800"
        )}
      >
        {assessedWithoutEvidenceCount > 0
          ? `${assessedWithoutEvidenceCount} scored competencies have no evidence note.`
          : "All scored competencies have evidence notes. Nice!"}
      </div>

      {/* Assessment Summary */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden mb-8">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-bold text-slate-900">
          Assessment Summary
        </div>

        <div className="divide-y divide-slate-200">
          {learners.map((learner) => {
            const learnerAssessments = getLearnerAssessments(learner.id);
            const completedCount = learnerAssessments.filter(
              (a) => a.tier
            ).length;
            const expanded = expandedLearner === learner.id;

            return (
              <div key={learner.id}>
                <button
                  onClick={() =>
                    setExpandedLearner(expanded ? null : learner.id)
                  }
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cx(
                        "w-9 h-9 flex items-center justify-center rounded-lg font-bold",
                        completedCount === COMPETENCIES.length
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
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {learner.name}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {learner.grade} • {learner.phase}
                      </p>
                    </div>
                  </div>
                  {expanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {expanded && (
                  <div className="px-4 pb-5 bg-slate-50">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {learnerAssessments.map(
                        ({ competency, tier, evidence }) => {
                          const Icon = competency.icon;
                          const tierInfo = tier
                            ? TIER_LABELS[tier as TierKey]
                            : null;
                          const evId = eKey(learner.id, competency.id);
                          const show = openEvidence[evId];

                          return (
                            <div
                              key={competency.id}
                              className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-2"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                                  <Icon className="w-5 h-5 text-slate-700" />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-slate-900">
                                    {competency.name}
                                  </p>
                                  {tierInfo ? (
                                    <span
                                      className={`mt-1 inline-block px-2 py-0.5 rounded-md text-xs font-bold border ${tierInfo.color}`}
                                    >
                                      {tierInfo.label} • {tierInfo.fullLabel}
                                    </span>
                                  ) : (
                                    <span className="mt-1 inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                      Not assessed
                                    </span>
                                  )}
                                </div>
                              </div>

                              {tier ? (
                                evidence ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        setOpenEvidence((p) => ({
                                          ...p,
                                          [evId]: !p[evId],
                                        }))
                                      }
                                      className="text-xs text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                                    >
                                      <StickyNote className="w-4 h-4 text-emerald-600" />
                                      {show ? "Hide note" : "View note"}
                                    </button>
                                    {show && (
                                      <div className="border bg-slate-50 rounded-md p-2 text-xs text-slate-700">
                                        {evidence}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-amber-100 text-amber-900 rounded-md">
                                    <StickyNote className="w-3.5 h-3.5" /> No
                                    evidence
                                  </span>
                                )
                              ) : null}
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
          "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-all",
          isSubmitting
            ? "bg-slate-400 text-white cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        )}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="w-5 h-5" /> Submit Assessment
          </>
        )}
      </button>
    </div>
  );
}
