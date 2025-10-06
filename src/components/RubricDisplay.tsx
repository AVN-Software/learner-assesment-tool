"use client";

import React from "react";
import { getPhaseCompetencyRubric } from "@/utils/competencyUtils";
import {
  Target,
  Users,
  Lightbulb,
  Search,
  Star,
  Award,
  TrendingUp,
  Zap,
  Info,
  ListChecks,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

/* ------------------ Internal strict unions ------------------ */
export type Phase = "Foundation" | "Intermediate" | "Senior" | "FET";
export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

/* ------------------ Props ------------------ */
interface RubricDisplayProps {
  phase: string;
  competencyId: string;
}

/* ------------------ Icon mapping ------------------ */
const iconMap: Record<
  CompetencyId,
  React.ComponentType<{ className?: string }>
> = {
  motivation: Target,
  teamwork: Users,
  analytical: Lightbulb,
  curiosity: Search,
  leadership: Star,
};

/* ------------------ Normalizers ------------------ */
const normalizePhase = (p: string): Phase | null => {
  const s = (p || "").trim().toLowerCase();
  if (s === "foundation") return "Foundation";
  if (s === "intermediate") return "Intermediate";
  if (s === "senior") return "Senior";
  if (s === "fet") return "FET";
  return null;
};

const normalizeCompetency = (c: string): CompetencyId | null => {
  const s = (c || "").trim().toLowerCase();
  if (s === "motivation") return "motivation";
  if (s === "teamwork") return "teamwork";
  if (s === "analytical") return "analytical";
  if (s === "curiosity") return "curiosity";
  if (s === "leadership") return "leadership";
  return null;
};

/* ------------------ Tier presentation styles ------------------ */
const tierStyles = [
  {
    tier: 1 as const,
    label: "Emerging",
    bg: "bg-amber-50",
    border: "border-amber-200",
    headBg: "bg-amber-100",
    headText: "text-amber-900",
    iconBg: "bg-amber-500",
    badge: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    tier: 2 as const,
    label: "Developing",
    bg: "bg-blue-50",
    border: "border-blue-200",
    headBg: "bg-blue-100",
    headText: "text-blue-900",
    iconBg: "bg-blue-500",
    badge: "bg-blue-100 text-blue-900 border-blue-300",
  },
  {
    tier: 3 as const,
    label: "Advanced",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    headBg: "bg-emerald-100",
    headText: "text-emerald-900",
    iconBg: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
] as const;

const TierIcon: React.FC<{ tier: 1 | 2 | 3; className?: string }> = ({
  tier,
  className,
}) => {
  if (tier === 1) return <TrendingUp className={className} />;
  if (tier === 2) return <Zap className={className} />;
  return <Award className={className} />;
};

/* ------------------ Component ------------------ */
export default function RubricDisplay({
  phase,
  competencyId,
}: RubricDisplayProps) {
  // normalize incoming strings to strict types
  const normalizedPhase = normalizePhase(phase);
  const normalizedComp = normalizeCompetency(competencyId);

  // fetch rubric with normalized values (or nulls)
  const data =
    normalizedPhase && normalizedComp
      ? getPhaseCompetencyRubric(normalizedPhase, normalizedComp)
      : null;

  const competency = data?.competency;
  const grouped = data?.grouped ?? [];

  // graceful failure if inputs don't match known enums or data is missing
  if (!normalizedPhase || !normalizedComp || !data || !competency) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700 font-medium">
          No rubric data found for {competencyId} ({phase}).
        </p>
        <p className="text-red-700 text-sm mt-1">
          Ensure phase is one of: Foundation, Intermediate, Senior, FET — and
          competency is: motivation, teamwork, analytical, curiosity,
          leadership.
        </p>
      </div>
    );
  }

  const IconComponent = iconMap[normalizedComp] ?? Info;

  return (
    <div className="my-6 sm:my-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow">
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {competency.competency_name}
              </h2>
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm px-2 py-1 rounded-md border bg-slate-50 text-slate-700 border-slate-200">
                <Info className="w-3.5 h-3.5" />
                {normalizedPhase} Phase
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              {competency.description}
            </p>

            {/* How to score */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                <ListChecks className="w-4 h-4" />
                How to select a tier
              </div>
              <ol className="mt-2 text-[12px] sm:text-sm text-slate-700 space-y-1.5 list-decimal list-inside">
                <li>
                  Scan <span className="font-medium">Tier 3</span> indicators.
                  If most are observed consistently, choose{" "}
                  <span className="font-medium">Tier 3</span>.
                </li>
                <li>
                  If not, check <span className="font-medium">Tier 2</span>{" "}
                  indicators for regular, reliable evidence → choose{" "}
                  <span className="font-medium">Tier 2</span>.
                </li>
                <li>
                  Otherwise, place in{" "}
                  <span className="font-medium">Tier 1</span> (emerging
                  behaviours).
                </li>
                <li className="italic">
                  Use <span className="font-medium">Hints</span> to interpret
                  what each indicator looks like in class.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {grouped.map((group, index) => {
          const style = tierStyles[group.tier - 1];

          return (
            <section
              key={`${group.tier}-${index}`}
              className={`rounded-2xl overflow-hidden border-2 ${style.border} ${style.bg} shadow-sm`}
            >
              <header
                className={`${style.headBg} border-b-2 ${style.border} p-4 sm:p-5`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 ${style.iconBg} rounded-lg flex items-center justify-center shadow`}
                    >
                      <TierIcon
                        tier={group.tier as 1 | 2 | 3}
                        className="w-5 h-5 text-white"
                      />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${style.headText}`}>
                        Tier {group.tier}
                      </h3>
                      <p
                        className={`text-xs font-medium ${style.headText} opacity-75`}
                      >
                        {style.label}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${style.badge}`}
                    title="Indicators in this tier"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {group.items.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-3">
                  {group.description}
                </p>
              </header>

              <div className="p-4 sm:p-5">
                {group.items.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-3">
                    No indicators.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {group.items.map((ind) => (
                      <li
                        key={ind.indicator_id}
                        className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm"
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-sm leading-snug">
                              {ind.question}
                            </p>

                            {ind.hint && (
                              <div className="mt-1.5 ml-0 sm:ml-2 pl-0 sm:pl-3 border-l-0 sm:border-l border-slate-200">
                                <div className="flex items-start gap-2 text-[12px] sm:text-xs text-slate-600">
                                  <HelpCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                  <p>{ind.hint}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}