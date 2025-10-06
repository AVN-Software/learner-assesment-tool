"use client";

import React, { useMemo, useRef, useState } from "react";
import RubricDisplay from "@/components/RubricDisplay";
import {
  Target,
  Users,
  Lightbulb,
  Search,
  Star,
  StickyNote,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentProvider";
import { Learner, TierValue } from "@/types/assessment";
import { Phase } from "@/types/rubric"; // keep aligned with RubricDisplay’s expected type

/* ---------------------------------------------------------------------------
   🎯 CONSTANTS / LOCAL TYPES
--------------------------------------------------------------------------- */
export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

interface Competency {
  id: CompetencyId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const COMPETENCIES: Competency[] = [
  { id: "motivation", name: "Motivation & Self-Awareness", icon: Target },
  { id: "teamwork", name: "Teamwork", icon: Users },
  { id: "analytical", name: "Analytical Thinking", icon: Lightbulb },
  { id: "curiosity", name: "Curiosity & Creativity", icon: Search },
  { id: "leadership", name: "Leadership & Social Influence", icon: Star },
];

const TIERS = [
  { value: "", label: "Select Tier" },
  {
    value: "tier1",
    label: "Tier 1",
    fullLabel: "Tier 1: Emerging",
    color: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    value: "tier2",
    label: "Tier 2",
    fullLabel: "Tier 2: Developing",
    color: "bg-blue-100 text-blue-900 border-blue-300",
  },
  {
    value: "tier3",
    label: "Tier 3",
    fullLabel: "Tier 3: Advanced",
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
] as const;

const keyFor = (learnerId: string, compId: string) => `${learnerId}_${compId}`;
const evidenceKeyFor = (learnerId: string, compId: string) =>
  `${learnerId}_${compId}_evidence`;
const getTierBadge = (tier: string) =>
  TIERS.find((t) => t.value === (tier as (typeof TIERS)[number]["value"]));

/* ---------------------------------------------------------------------------
   🧩 COMPONENT (Context-driven)
--------------------------------------------------------------------------- */
const AssessmentTable: React.FC = () => {
  const {
    selectedFellow,
    selectedLearners,
    assessments,
    evidences,
    setAssessments,
    setEvidences,
    nextStep,
  } = useAssessment();

  const [openEvidenceKey, setOpenEvidenceKey] = useState<string | null>(null);
  const [openRubric, setOpenRubric] = useState<{
    phase: string | null;
    competencyId: CompetencyId | null;
  }>({ phase: null, competencyId: null });

  const textareasRef = useRef<Record<string, HTMLTextAreaElement | null>>({});

  // Group learners by phase for easier UI
  const learnersByPhase = useMemo(() => {
    const map: Record<string, Learner[]> = {};
    for (const learner of selectedLearners) {
      const phaseKey = learner.phase || "Unknown";
      if (!map[phaseKey]) map[phaseKey] = [];
      map[phaseKey].push(learner);
    }
    return map;
  }, [selectedLearners]);

  /* ------------------- Updaters (context writes) ------------------- */
  const updateAssessment = (
    learnerId: string,
    compId: CompetencyId,
    tier: TierValue
  ) => {
    setAssessments({ ...assessments, [keyFor(learnerId, compId)]: tier });
  };

  const updateEvidence = (
    learnerId: string,
    compId: CompetencyId,
    text: string
  ) => {
    setEvidences({
      ...evidences,
      [evidenceKeyFor(learnerId, compId)]: text,
    });
  };

  const toggleRubric = (phase: string, competencyId: CompetencyId) => {
    setOpenRubric((prev) =>
      prev.phase === phase && prev.competencyId === competencyId
        ? { phase: null, competencyId: null }
        : { phase, competencyId }
    );
  };

  /* ------------------- UI ------------------- */
  if (!selectedLearners.length) {
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        No learners selected for observation yet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
        {selectedFellow
          ? `${selectedFellow.name}'s Learners`
          : "Assess Selected Learners"}
      </h2>
      <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-[15px]">
        Select a tier and (optionally) add an evidence note. Click a header to
        view the rubric for that competency and phase.
      </p>

      {Object.entries(learnersByPhase).map(([phase, phaseLearners]) => (
        <section key={phase} className="mb-10 sm:mb-16">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 capitalize">
            {phase} Phase
          </h3>

          {openRubric.phase === phase && openRubric.competencyId && (
            <div className="mb-6">
              <RubricDisplay
                competencyId={openRubric.competencyId}
                phase={phase as Phase}
              />
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead className="sticky top-0 z-10 shadow-[0_2px_0_0_rgba(0,0,0,0.04)]">
                <tr className="bg-gradient-to-r from-slate-800 to-slate-900">
                  <th className="w-[280px] px-5 py-4 text-left border-r border-slate-700 text-white text-sm font-bold">
                    Learner
                  </th>
                  {COMPETENCIES.map((comp) => (
                    <th
                      key={comp.id}
                      onClick={() => toggleRubric(phase, comp.id)}
                      className="px-3 py-4 text-center border-r border-slate-700 last:border-r-0 cursor-pointer text-white text-xs hover:bg-slate-700/60"
                    >
                      <comp.icon className="w-4 h-4 inline-block mr-1" />
                      {comp.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {phaseLearners.map((learner, idx) => (
                  <tr
                    key={learner.id}
                    className={idx % 2 === 1 ? "bg-slate-50" : ""}
                  >
                    <th className="px-5 py-4 border-r border-slate-200 text-left">
                      <div className="font-semibold text-slate-900">
                        {learner.name}
                      </div>
                      <div className="text-xs text-slate-600">
                        {learner.grade} • {learner.subject}
                      </div>
                    </th>

                    {COMPETENCIES.map((comp) => {
                      const k = keyFor(learner.id, comp.id);
                      const evKey = evidenceKeyFor(learner.id, comp.id);
                      const value = assessments[k] || "";
                      const evidence = evidences[evKey] || "";
                      const tierBadge = getTierBadge(value);
                      const isOpen = openEvidenceKey === k;
                      const hasTier = Boolean(value);
                      const hasEvidence = Boolean(evidence);

                      return (
                        <td
                          key={comp.id}
                          className="border border-slate-100 text-center p-2 align-top"
                        >
                          {/* Tier control with status dot */}
                          <div className="inline-block relative">
                            {hasTier ? (
                              <button
                                onClick={() =>
                                  setOpenEvidenceKey(isOpen ? null : k)
                                }
                                className={`px-3 py-2 border-2 rounded-lg text-sm font-semibold ${
                                  tierBadge?.label || "border-slate-300"
                                }`}
                                title={
                                  hasEvidence
                                    ? "Note added"
                                    : "No note yet — click to add"
                                }
                              >
                                {tierBadge?.label}
                              </button>
                            ) : (
                              <select
                                value={value}
                                onChange={(e) =>
                                  updateAssessment(
                                    learner.id,
                                    comp.id,
                                    e.target.value as TierValue
                                  )
                                }
                                className="px-3 py-2 border-2 border-slate-300 rounded-lg text-sm"
                                title="Select a tier"
                              >
                                {TIERS.map((t) => (
                                  <option key={t.value} value={t.value}>
                                    {t.value ? t.fullLabel : t.label}
                                  </option>
                                ))}
                              </select>
                            )}

                            {/* Evidence status dot */}
                            {hasTier && (
                              <span
                                className={`absolute -top-1 -right-1 inline-block w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                                  hasEvidence
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                                title={
                                  hasEvidence
                                    ? "Evidence note present"
                                    : "Missing evidence note"
                                }
                                aria-label={
                                  hasEvidence
                                    ? "Evidence note present"
                                    : "Missing evidence note"
                                }
                              />
                            )}
                          </div>

                          {/* Secondary “note” pill */}
                          {hasTier && (
                            <div className="mt-2">
                              <button
                                onClick={() =>
                                  setOpenEvidenceKey(isOpen ? null : k)
                                }
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${
                                  hasEvidence
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                    : "border-amber-300 bg-amber-50 text-amber-800"
                                }`}
                              >
                                {hasEvidence ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    View note
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Add note
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {/* Evidence textarea (toggle) */}
                          {isOpen && (
                            <div className="mt-2">
                              <textarea
                                ref={(el) => {
                                  if (el) {
                                    textareasRef.current[k] = el;
                                  } else {
                                    delete textareasRef.current[k];
                                  }
                                }}
                                rows={2}
                                placeholder="Add evidence…"
                                value={evidence}
                                onChange={(e) =>
                                  updateEvidence(
                                    learner.id,
                                    comp.id,
                                    e.target.value
                                  )
                                }
                                className="w-full text-xs border border-slate-300 rounded-lg p-2"
                              />
                              <div className="mt-1 flex items-center justify-between">
                                <div className="text-[10px] text-slate-500">
                                  Tip: brief, specific, observable behaviour.
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {evidence.length}/500
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <div className="mt-10 flex justify-end">
        <button
          onClick={nextStep}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm"
        >
          Continue to Summary
        </button>
      </div>
    </div>
  );
};

export default AssessmentTable;
