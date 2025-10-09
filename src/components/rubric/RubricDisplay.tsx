"use client";

import * as React from "react";
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
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { CompetencyId as CompetencyIdType, TierLevel } from "@/types/rubric";
import { normalizeCompetency, normalizePhase } from "@/utils/normalizers";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ------------------ Types ------------------ */
interface RubricDisplayProps {
  phase: string;
  competencyId: string;
  compact?: boolean; // inline above table
  focusTier?: TierLevel; // mobile focus
  className?: string;
}

type TierNumber = 1 | 2 | 3;

type RubricItem = {
  indicator_id: string | number;
  question: string;
  hint?: string;
};

type TierGroup = {
  tier: TierNumber;
  description: string;
  items: RubricItem[];
};

type IconComponentType = React.ComponentType<{ className?: string }>;

/* ------------------ Icon mapping ------------------ */
const iconMap: Record<CompetencyIdType, IconComponentType> = {
  motivation: Target,
  teamwork: Users,
  analytical: Lightbulb,
  curiosity: Search,
  leadership: Star,
};

/* ------------------ Tier presentation styles (brand) ------------------ */
export const tierStyles = [
  {
    tier: 1 as const,
    label: "Emerging",
    bg: "bg-amber-50",
    border: "border-amber-300",
    headerBg: "bg-gradient-to-br from-amber-500 to-amber-600",
    textColor: "text-amber-900",
    dotColor: "bg-amber-500",
  },
  {
    tier: 2 as const,
    label: "Developing",
    bg: "bg-blue-50",
    border: "border-blue-300",
    headerBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    textColor: "text-blue-900",
    dotColor: "bg-blue-500",
  },
  {
    tier: 3 as const,
    label: "Advanced",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    headerBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    textColor: "text-emerald-900",
    dotColor: "bg-emerald-500",
  },
] as const;

const TierIcon: React.FC<{ tier: TierNumber; className?: string }> = ({ tier, className }) => {
  if (tier === 1) return <TrendingUp className={className} />;
  if (tier === 2) return <Zap className={className} />;
  return <Award className={className} />;
};

/* ------------------ Compact Tier Card (inline) ------------------ */
const CompactTierCard: React.FC<{
  group: TierGroup;
  style: (typeof tierStyles)[number];
}> = ({ group, style }) => (
  <div className={cn("rounded-lg overflow-hidden border-2", style.border)}>
    {/* Tier Header */}
    <div className={cn("p-3", style.headerBg)}>
      <div className="flex items-center gap-2">
        <TierIcon tier={group.tier} className="w-4 h-4 text-white" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-white">
              Tier {group.tier}: {style.label}
            </h4>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
              {group.items.length}
            </Badge>
          </div>
        </div>
      </div>
      <p className="text-xs text-white/90 mt-1 leading-snug">{group.description}</p>
    </div>

    {/* Indicators */}
    <div className={cn("p-3", style.bg)}>
      {group.items.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-2">No indicators defined</p>
      ) : (
        <ul className="space-y-2">
          {group.items.map((ind) => (
            <li key={ind.indicator_id} className="bg-white/80 rounded-md p-2 text-xs">
              <div className="flex gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5", style.dotColor)} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-medium leading-snug">{ind.question}</p>
                  {ind.hint && (
                    <div className="mt-1 flex items-start gap-1.5 text-slate-600">
                      <HelpCircle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-snug">{ind.hint}</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

/* ------------------ Full Tier Card (modal/full) ------------------ */
const FullTierCard: React.FC<{
  group: TierGroup;
  style: (typeof tierStyles)[number];
}> = ({ group, style }) => (
  <section className={cn("rounded-xl overflow-hidden border-2 shadow-sm", style.border, style.bg)}>
    <header className={cn("p-5", style.headerBg)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <TierIcon tier={group.tier} className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Tier {group.tier}</h3>
            <p className="text-xs font-medium text-white/90">{style.label}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-white border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {group.items.length}
        </Badge>
      </div>
      <p className="text-sm text-white/95 mt-3 leading-relaxed">{group.description}</p>
    </header>

    <div className="p-5">
      {group.items.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-3">No indicators defined</p>
      ) : (
        <ul className="space-y-3">
          {group.items.map((ind) => (
            <li
              key={ind.indicator_id}
              className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-2", style.dotColor)} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 text-sm leading-relaxed">{ind.question}</p>
                  {ind.hint && (
                    <div className="mt-2 pl-3 border-l-2 border-slate-200">
                      <div className="flex items-start gap-2 text-xs text-slate-600">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{ind.hint}</p>
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

/* ------------------ Main Component ------------------ */
export default function RubricDisplay({
  phase,
  competencyId,
  compact = false,
  focusTier,
  className,
}: RubricDisplayProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  // Robust mobile detection with matchMedia, SSR-safe
  React.useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Normalize inputs
  const normalizedPhase = normalizePhase(phase);
  const normalizedComp = normalizeCompetency(competencyId);

  // Fetch rubric data
  const data =
    normalizedPhase && normalizedComp
      ? getPhaseCompetencyRubric(normalizedPhase, normalizedComp)
      : null;

  const competency = data?.competency;
  const grouped = (data?.grouped ?? []) as TierGroup[];

  // Filter to focused tier on mobile if specified
  const displayGroups = isMobile && focusTier ? grouped.filter((g) => g.tier === focusTier) : grouped;

  // Error state
  if (!normalizedPhase || !normalizedComp || !data || !competency) {
    return (
      <div className="p-4 rounded-lg border border-red-200 bg-red-50">
        <p className="text-sm font-medium text-red-700">
          No rubric data found for <span className="font-semibold">{competencyId}</span> ({phase})
        </p>
      </div>
    );
  }

  const IconComponent = iconMap[normalizedComp as CompetencyIdType] ?? Info;

  // Compact mode (inline above table)
  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Compact Header (brand dark) */}
        <div className="flex items-start gap-3 pb-3 border-b border-[#004854]/15">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004854] to-[#0a5e6c] flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-[#004854]">{competency.competency_name}</h3>
            <p className="text-xs text-[#32353C]/80 mt-0.5 leading-snug">{competency.description}</p>
          </div>
        </div>

        {/* Mobile: Show only focused tier, Desktop: Show all tiers */}
        {displayGroups.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No tier data available</div>
        ) : (
          <>
            {isMobile && focusTier && (
              <div className="text-xs text-[#004854] bg-[#8ED1C1]/15 border border-[#004854]/15 rounded-md p-2 flex items-center gap-2">
                <span className="font-medium">Viewing Tier {focusTier} only.</span>
                <span className="text-[#32353C]/80">Use the header to switch tiers.</span>
              </div>
            )}

            {/* Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {displayGroups.map((group, index) => {
                const style = tierStyles[group.tier - 1];
                return <CompactTierCard key={`${group.tier}-${index}`} group={group} style={style} />;
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full mode (modal / dedicated)
  return (
    <div className={cn("py-4", className)}>
      {/* Full Header (brand card) */}
      <div className="bg-white rounded-xl border border-[#004854]/12 p-6 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004854] to-[#0a5e6c] flex items-center justify-center shadow flex-shrink-0">
            <IconComponent className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h2 className="text-xl font-bold text-[#004854]">{competency.competency_name}</h2>
              <Badge variant="secondary" className="text-xs border-[#004854]/20">
                <Info className="w-3 h-3 mr-1" />
                {normalizedPhase} Phase
              </Badge>
            </div>
            <p className="text-sm text-[#32353C]/85 leading-relaxed mb-4">{competency.description}</p>

            {/* Assessment Guide */}
            <div className="rounded-lg border border-[#004854]/12 bg-[#8ED1C1]/10 p-4">
              <h4 className="text-sm font-semibold text-[#004854] mb-2">Assessment Guide</h4>
              <div className="space-y-2 text-xs text-[#32353C]/85">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <p>
                    <span className="font-semibold text-emerald-700">Tier 3 (Advanced):</span> Consistently
                    demonstrates most indicators
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                  <p>
                    <span className="font-semibold text-blue-700">Tier 2 (Developing):</span> Regular evidence of key
                    indicators
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                  <p>
                    <span className="font-semibold text-amber-700">Tier 1 (Emerging):</span> Beginning to show
                    indicators
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Cards - Full Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {grouped.map((group, index) => {
          const style = tierStyles[group.tier - 1];
          return <FullTierCard key={`${group.tier}-${index}`} group={group} style={style} />;
        })}
      </div>
    </div>
  );
}
