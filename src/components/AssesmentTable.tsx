"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAssessment } from "@/context/AssessmentProvider";
import RubricDisplay from "@/components/RubricDisplay";
import {
  Target,
  Users,
  Lightbulb,
  Search,
  Star,
  CheckCircle2,
  Info,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Learner } from "@/types/learner";

// --------------------------------------------------
// 🔹 Tier options
// --------------------------------------------------
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
];

// --------------------------------------------------
// 🔹 Competency Type
// --------------------------------------------------
export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

interface Competency {
  id: CompetencyId;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const COMPETENCIES: Competency[] = [
  {
    id: "motivation",
    name: "Motivation & Self-Awareness",
    description:
      "Learners develop emotional awareness, resilience, and motivation to sustain engagement in learning.",
    icon: Target,
  },
  {
    id: "teamwork",
    name: "Teamwork",
    description:
      "Learners collaborate with peers, follow group norms, and contribute meaningfully to shared tasks.",
    icon: Users,
  },
  {
    id: "analytical",
    name: "Analytical Thinking",
    description:
      "Learners recognise patterns, integrate concepts, and apply reasoning to solve increasingly complex problems.",
    icon: Lightbulb,
  },
  {
    id: "curiosity",
    name: "Curiosity & Creativity",
    description:
      "Learners ask questions, explore ideas, and adapt creatively to generate innovative solutions.",
    icon: Search,
  },
  {
    id: "leadership",
    name: "Leadership & Social Influence",
    description:
      "Learners practise social influence, take initiative, and guide peers in collaborative and inclusive ways.",
    icon: Star,
  },
];

// --------------------------------------------------
// 🔧 Small helpers
// --------------------------------------------------
const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const keyFor = (learnerId: string, compId: string) => `${learnerId}_${compId}`;
const evidenceKeyFor = (learnerId: string, compId: string) =>
  `${learnerId}_${compId}_evidence`;

const getTierBadge = (tier: string) => TIERS.find((t) => t.value === tier);

// --------------------------------------------------
// 🧩 Component
// --------------------------------------------------
export default function AssessmentTable() {
  const {
    learners,
    assessments,
    updateAssessment,
    getLearnerProgress,
    updateEvidence,
    evidences: ctxEvidences = {},
  } = useAssessment();

  // Local evidence map (syncs to context if function exists)
  const [localEvidence, setLocalEvidence] = useState<Record<string, string>>(
    ctxEvidences || {}
  );

  useEffect(() => {
    // If context evidence changes externally, hydrate local
    setLocalEvidence((prev) => ({ ...prev, ...(ctxEvidences || {}) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ctxEvidences)]);

  const setEvidence = (learnerId: string, compId: string, value: string) => {
    const k = evidenceKeyFor(learnerId, compId);
    setLocalEvidence((prev) => ({ ...prev, [k]: value }));
    if (typeof updateEvidence === "function") {
      updateEvidence(learnerId, compId, value);
    }
  };

  // Evidence popover (keyed by learner_competency)
  const [openEvidenceKey, setOpenEvidenceKey] = useState<string | null>(null);

  // After selecting a tier, auto-open evidence and focus textarea
  const textareasRef = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const focusTextareaSoon = (k: string) => {
    // Let the popover render first
    requestAnimationFrame(() => {
      textareasRef.current[k]?.focus();
      textareasRef.current[k]?.setSelectionRange(
        textareasRef.current[k]!.value.length,
        textareasRef.current[k]!.value.length
      );
    });
  };

  // Rubric toggle
  const [openRubric, setOpenRubric] = useState<{
    phase: string | null;
    competencyId: CompetencyId | null;
  }>({ phase: null, competencyId: null });

  const rubricRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (rubricRef.current && openRubric.phase && openRubric.competencyId) {
      rubricRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [openRubric]);

  // Group learners by phase (case-insensitive)
  const learnersByPhase = useMemo(() => {
    return learners.reduce<Record<string, Learner[]>>((acc, learner) => {
      const phase = (learner.phase || "").toString();
      const phaseKey =
        phase.toLowerCase() === "foundation"
          ? "Foundation"
          : phase.toLowerCase() === "intermediate"
          ? "Intermediate"
          : phase.toLowerCase() === "senior"
          ? "Senior"
          : phase.toLowerCase() === "fet"
          ? "FET"
          : phase || "Unknown";
      if (!acc[phaseKey]) acc[phaseKey] = [];
      acc[phaseKey].push(learner);
      return acc;
    }, {});
  }, [learners]);

  const toggleRubric = (phase: string, competencyId: CompetencyId) => {
    setOpenRubric((prev) =>
      prev.phase === phase && prev.competencyId === competencyId
        ? { phase: null, competencyId: null }
        : { phase, competencyId }
    );
  };

  // Close evidence on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      // If click occurs on a popover or its trigger, ignore
      if (t.closest?.("[data-evidence-popover]")) return;
      if (t.closest?.("[data-evidence-trigger]")) return;
      if (openEvidenceKey) setOpenEvidenceKey(null);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [openEvidenceKey]);

  // --------------------------------------------------
  // 🧩 Render
  // --------------------------------------------------
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-4">
        Assess Learner Competencies
      </h2>
      <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Select a tier and (optionally) add a brief evidence note. Click a
        competency header to view its rubric.
      </p>

      {Object.entries(learnersByPhase).map(([phase, phaseLearners]) => {
        const activeRubric = openRubric.competencyId
          ? COMPETENCIES.find(
              (c) =>
                c.id === openRubric.competencyId && openRubric.phase === phase
            )
          : null;

        return (
          <div key={phase} className="mb-10 sm:mb-16">
            {/* Rubric (when opened for this phase) */}
            {activeRubric && (
              <div ref={rubricRef} className="mb-6 sm:mb-8 scroll-mt-10">
                <RubricDisplay
                  phase={
                    phase as "Foundation" | "Intermediate" | "Senior" | "FET"
                  }
                  competencyId={activeRubric.id}
                />
              </div>
            )}

            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 capitalize">
              {phase} Phase
            </h3>

            {/* Desktop / Large (matrix) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-slate-800 to-slate-900">
                    <th className="px-5 py-4 text-left border-r border-slate-700">
                      <span className="text-sm font-bold text-white">
                        Learner
                      </span>
                    </th>
                    {COMPETENCIES.map((comp) => {
                      const IconComponent = comp.icon;
                      const isOpen =
                        openRubric.phase === phase &&
                        openRubric.competencyId === comp.id;

                      return (
                        <th
                          key={comp.id}
                          onClick={() => toggleRubric(phase, comp.id)}
                          className={cx(
                            "relative px-3 py-4 text-center border-r border-slate-700 last:border-r-0 cursor-pointer transition-colors group",
                            isOpen ? "bg-slate-700" : "hover:bg-slate-700/50"
                          )}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-5 h-5 text-white" />
                              <span className="text-[11px] font-semibold text-white">
                                {comp.name}
                              </span>
                              <Info className="w-3.5 h-3.5 text-white opacity-70 group-hover:opacity-100" />
                            </div>
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal z-20 shadow-xl max-w-xs">
                            {comp.description}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {phaseLearners.map((learner, idx) => {
                    const progress = getLearnerProgress(learner.id);

                    return (
                      <tr
                        key={learner.id}
                        className={cx(
                          "border-t border-slate-200 hover:bg-slate-50 transition-colors",
                          idx % 2 === 1 && "bg-slate-50/50"
                        )}
                      >
                        {/* Learner cell */}
                        <td className="px-5 py-4 border-r border-slate-200 align-middle">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">
                                {learner.name}
                              </div>
                              <div className="text-xs text-slate-600">
                                {learner.grade}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="text-xs font-semibold text-slate-600">
                                {progress.assessed}/{progress.total}
                              </div>
                              {progress.percentage === 100 && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Competency cells */}
                        {COMPETENCIES.map((comp) => {
                          const k = keyFor(learner.id, comp.id);
                          const evKey = evidenceKeyFor(learner.id, comp.id);
                          const value = assessments[k] || "";
                          const evidence = localEvidence[evKey] || "";
                          const tierBadge = getTierBadge(value);
                          const isOpen = openEvidenceKey === k;

                          return (
                            <td
                              key={comp.id}
                              className="relative px-3 py-3 text-center border-r border-slate-200 last:border-r-0 align-middle"
                            >
                              <div className="inline-flex flex-col gap-1 items-stretch min-w-[160px]">
                                {/* Tier selection / badge */}
                                {value ? (
                                  <button
                                    data-evidence-trigger
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenEvidenceKey(isOpen ? null : k);
                                      if (!isOpen) focusTextareaSoon(k);
                                    }}
                                    className={cx(
                                      "inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 font-bold text-sm transition-all",
                                      tierBadge?.color || "border-slate-300"
                                    )}
                                  >
                                    <span>{tierBadge?.fullLabel}</span>
                                    <ChevronDown className="w-4 h-4 opacity-70" />
                                  </button>
                                ) : (
                                  <select
                                    value={value}
                                    onChange={(e) => {
                                      updateAssessment(
                                        learner.id,
                                        comp.id,
                                        e.target.value
                                      );
                                      // If a score was chosen, open evidence immediately
                                      if (e.target.value) {
                                        setOpenEvidenceKey(k);
                                        focusTextareaSoon(k);
                                      }
                                    }}
                                    className="px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 cursor-pointer transition-all"
                                  >
                                    {TIERS.map((t) => (
                                      <option key={t.value} value={t.value}>
                                        {t.value ? t.fullLabel : t.label}
                                      </option>
                                    ))}
                                  </select>
                                )}

                                {/* Evidence preview + icon */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    data-evidence-trigger
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenEvidenceKey(isOpen ? null : k);
                                      if (!isOpen) focusTextareaSoon(k);
                                    }}
                                    className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition"
                                    title={
                                      evidence
                                        ? "Edit evidence"
                                        : "Add evidence"
                                    }
                                  >
                                    <FileText
                                      className={cx(
                                        "w-4 h-4",
                                        evidence
                                          ? "text-emerald-500"
                                          : "text-slate-400"
                                      )}
                                    />
                                    <span className="hidden xl:inline">
                                      {evidence ? "Edit note" : "Add note"}
                                    </span>
                                  </button>

                                  {evidence && (
                                    <p className="text-[11px] text-slate-500 mt-1 truncate max-w-[200px] mx-auto">
                                      “{evidence}”
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Evidence Popover */}
                              {isOpen && (
                                <div
                                  data-evidence-popover
                                  className="absolute z-30 top-full left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-left"
                                >
                                  <p className="text-[11px] text-slate-500 mb-1">
                                    Evidence for{" "}
                                    <span className="font-semibold">
                                      {comp.name}
                                    </span>
                                  </p>
                                  <textarea
                                    ref={(el) => {
                                      textareasRef.current[k] = el;
                                    }}
                                    rows={3}
                                    placeholder="Add short evidence or observation…"
                                    value={evidence}
                                    onChange={(e) =>
                                      setEvidence(
                                        learner.id,
                                        comp.id,
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Escape")
                                        setOpenEvidenceKey(null);
                                    }}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-slate-200 focus:border-slate-800 placeholder:text-slate-400"
                                  />
                                  <div className="mt-2 flex justify-end gap-2">
                                    <button
                                      onClick={() => setOpenEvidenceKey(null)}
                                      className="text-xs px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet (cards) */}
            <div className="md:hidden space-y-3">
              {phaseLearners.map((learner) => {
                const progress = getLearnerProgress(learner.id);

                return (
                  <details
                    key={learner.id}
                    className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
                  >
                    <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {learner.name}
                        </div>
                        <div className="text-xs text-slate-600">
                          {learner.grade}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-600">
                          {progress.assessed}/{progress.total}
                        </span>
                        {progress.percentage === 100 && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                    </summary>

                    <div className="px-4 pb-4 pt-0">
                      {COMPETENCIES.map((comp) => {
                        const k = keyFor(learner.id, comp.id);
                        const evKey = evidenceKeyFor(learner.id, comp.id);
                        const value = assessments[k] || "";
                        const evidence = localEvidence[evKey] || "";
                        const tierBadge = getTierBadge(value);
                        const isOpen = openEvidenceKey === k;

                        return (
                          <div
                            key={comp.id}
                            className="mt-3 border border-slate-200 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleRubric(phase, comp.id)}
                              className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-left"
                            >
                              <span className="text-sm font-semibold">
                                {comp.name}
                              </span>
                              <Info className="w-4 h-4 text-slate-500" />
                            </button>

                            <div
                              className="p-3 space-y-2"
                              data-evidence-popover
                            >
                              {value ? (
                                <button
                                  data-evidence-trigger
                                  onClick={() => {
                                    setOpenEvidenceKey(isOpen ? null : k);
                                    if (!isOpen) focusTextareaSoon(k);
                                  }}
                                  className={cx(
                                    "w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 font-bold text-sm transition-all",
                                    tierBadge?.color || "border-slate-300"
                                  )}
                                >
                                  <span>{tierBadge?.fullLabel}</span>
                                  <ChevronDown className="w-4 h-4 opacity-70" />
                                </button>
                              ) : (
                                <select
                                  value={value}
                                  onChange={(e) => {
                                    updateAssessment(
                                      learner.id,
                                      comp.id,
                                      e.target.value
                                    );
                                    if (e.target.value) {
                                      setOpenEvidenceKey(k);
                                      focusTextareaSoon(k);
                                    }
                                  }}
                                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 cursor-pointer transition-all"
                                >
                                  {TIERS.map((t) => (
                                    <option key={t.value} value={t.value}>
                                      {t.value ? t.fullLabel : t.label}
                                    </option>
                                  ))}
                                </select>
                              )}

                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  data-evidence-trigger
                                  onClick={() => {
                                    setOpenEvidenceKey(isOpen ? null : k);
                                    if (!isOpen) focusTextareaSoon(k);
                                  }}
                                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                                >
                                  <FileText
                                    className={cx(
                                      "w-4 h-4",
                                      evidence
                                        ? "text-emerald-500"
                                        : "text-slate-400"
                                    )}
                                  />
                                  <span>
                                    {evidence ? "Edit note" : "Add note"}
                                  </span>
                                </button>

                                {evidence && (
                                  <span className="text-[11px] text-slate-500 truncate max-w-[55%]">
                                    “{evidence}”
                                  </span>
                                )}
                              </div>

                              {isOpen && (
                                <div className="mt-2">
                                  <textarea
                                    ref={(el) => {
                                      textareasRef.current[k] = el;
                                    }}
                                    rows={3}
                                    placeholder="Add short evidence or observation…"
                                    value={evidence}
                                    onChange={(e) =>
                                      setEvidence(
                                        learner.id,
                                        comp.id,
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Escape")
                                        setOpenEvidenceKey(null);
                                    }}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-slate-200 focus:border-slate-800 placeholder:text-slate-400"
                                  />
                                  <div className="mt-2 flex justify-end">
                                    <button
                                      onClick={() => setOpenEvidenceKey(null)}
                                      className="text-xs px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
