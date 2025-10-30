'use client';

import * as React from 'react';
import { getPhaseCompetencyRubric } from '@/utils/competencyUtils';
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
} from 'lucide-react';
import { normalizeCompetency, normalizePhase } from '@/utils/normalizers';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Import typed rubric definitions from consolidated types
import {
  CompetencyId,
  TierLevel,
  TierGroup,
  TIERS,
  getTierByLevel,
  Tier,
} from '@/types/rubric.types';

/* ---------------------------------------------------------------------------
   Types
--------------------------------------------------------------------------- */
interface RubricDisplayProps {
  phase: string;
  competencyId: string;
  compact?: boolean; // inline mode (above table)
  focusTier?: TierLevel; // for mobile display
  className?: string;
}

type IconComponentType = React.ComponentType<{ className?: string }>;

/* ---------------------------------------------------------------------------
   Icon Mapping (competency → icon)
--------------------------------------------------------------------------- */
const iconMap: Record<CompetencyId, IconComponentType> = {
  motivation: Target,
  teamwork: Users,
  analytical: Lightbulb,
  curiosity: Search,
  leadership: Star,
};

/* ---------------------------------------------------------------------------
   Tier Icon Component
--------------------------------------------------------------------------- */
const TierIcon: React.FC<{ tier: TierLevel; className?: string }> = ({ tier, className }) => {
  if (tier === 1) return <TrendingUp className={className} />;
  if (tier === 2) return <Zap className={className} />;
  return <Award className={className} />;
};

/* ---------------------------------------------------------------------------
   Compact Tier Card (inline version)
--------------------------------------------------------------------------- */
const CompactTierCard: React.FC<{
  group: TierGroup;
  tierStyle: Tier;
}> = ({ group, tierStyle }) => (
  <div className={cn('overflow-hidden rounded-lg border-2', tierStyle.border)}>
    {/* Header */}
    <div className={cn('p-3', tierStyle.headerBg)}>
      <div className="flex items-center gap-2">
        <TierIcon tier={group.tier} className="h-4 w-4 text-white" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">{tierStyle.fullLabel}</h4>
            <Badge variant="secondary" className="border-0 bg-white/20 text-xs text-white">
              {group.items.length}
            </Badge>
          </div>
        </div>
      </div>
      <p className="mt-1 text-xs leading-snug text-white/90">{group.description}</p>
    </div>

    {/* Indicators */}
    <div className={cn('p-3', tierStyle.bg)}>
      {group.items.length === 0 ? (
        <p className="py-2 text-center text-xs text-slate-500">No indicators defined</p>
      ) : (
        <ul className="space-y-2">
          {group.items.map((ind) => (
            <li key={ind.indicator_id} className="rounded-md bg-white/80 p-2 text-xs">
              <div className="flex gap-2">
                <div
                  className={cn(
                    'mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full',
                    tierStyle.dotColor,
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="leading-snug font-medium text-slate-800">{ind.question}</p>
                  {ind.hint && (
                    <div className="mt-1 flex items-start gap-1.5 text-slate-600">
                      <HelpCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-500" />
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

/* ---------------------------------------------------------------------------
   Full Tier Card (modal/full layout)
--------------------------------------------------------------------------- */
const FullTierCard: React.FC<{
  group: TierGroup;
  tierStyle: Tier;
}> = ({ group, tierStyle }) => (
  <section
    className={cn('overflow-hidden rounded-xl border-2 shadow-sm', tierStyle.border, tierStyle.bg)}
  >
    <header className={cn('p-5', tierStyle.headerBg)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <TierIcon tier={group.tier} className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Tier {group.tier}</h3>
            <p className="text-xs font-medium text-white/90">
              {tierStyle.fullLabel.split(': ')[1]}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="border-0 bg-white/20 text-white">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          {group.items.length}
        </Badge>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/95">{group.description}</p>
    </header>

    <div className="p-5">
      {group.items.length === 0 ? (
        <p className="py-3 text-center text-sm text-slate-500">No indicators defined</p>
      ) : (
        <ul className="space-y-3">
          {group.items.map((ind) => (
            <li
              key={ind.indicator_id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn('mt-2 h-2 w-2 flex-shrink-0 rounded-full', tierStyle.dotColor)}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed font-medium text-slate-800">
                    {ind.question}
                  </p>
                  {ind.hint && (
                    <div className="mt-2 border-l-2 border-slate-200 pl-3">
                      <div className="flex items-start gap-2 text-xs text-slate-600">
                        <HelpCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
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

/* ---------------------------------------------------------------------------
   Main Component — RubricDisplay
--------------------------------------------------------------------------- */
export default function RubricDisplay({
  phase,
  competencyId,
  compact = false,
  focusTier,
  className,
}: RubricDisplayProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect mobile view safely (SSR compatible)
  React.useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Normalize phase + competency input
  const normalizedPhase = normalizePhase(phase);
  const normalizedComp = normalizeCompetency(competencyId);

  // Fetch rubric data
  const data =
    normalizedPhase && normalizedComp
      ? getPhaseCompetencyRubric(normalizedPhase, normalizedComp)
      : null;

  const competency = data?.competency;
  const grouped = (data?.grouped ?? []) as TierGroup[];

  // For mobile view, show focused tier only
  const displayGroups =
    isMobile && focusTier ? grouped.filter((g) => g.tier === focusTier) : grouped;

  // Handle invalid or missing rubric data
  if (!normalizedPhase || !normalizedComp || !data || !competency) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">
          No rubric data found for <span className="font-semibold">{competencyId}</span> ({phase})
        </p>
      </div>
    );
  }

  const IconComponent = iconMap[normalizedComp as CompetencyId] ?? Info;

  // -------------------------------------------------------------------------
  // Compact Mode (inline above table)
  // -------------------------------------------------------------------------
  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-[#004854]/15 pb-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#004854] to-[#0a5e6c]">
            <IconComponent className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-[#004854]">{competency.competency_name}</h3>
            <p className="mt-0.5 text-xs leading-snug text-[#32353C]/80">
              {competency.description}
            </p>
          </div>
        </div>

        {/* Tier Cards */}
        {displayGroups.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">No tier data available</div>
        ) : (
          <>
            {isMobile && focusTier && (
              <div className="flex items-center gap-2 rounded-md border border-[#004854]/15 bg-[#8ED1C1]/15 p-2 text-xs text-[#004854]">
                <span className="font-medium">Viewing Tier {focusTier} only.</span>
                <span className="text-[#32353C]/80">Use the header to switch tiers.</span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {displayGroups.map((group, i) => {
                const tierStyle = getTierByLevel(group.tier);
                if (!tierStyle) return null;
                return (
                  <CompactTierCard key={`${group.tier}-${i}`} group={group} tierStyle={tierStyle} />
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Full Mode (Modal / Dedicated Display)
  // -------------------------------------------------------------------------
  return (
    <div className={cn('py-4', className)}>
      {/* Header */}
      <div className="mb-6 rounded-xl border border-[#004854]/12 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#004854] to-[#0a5e6c] shadow">
            <IconComponent className="h-6 w-6 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-[#004854]">{competency.competency_name}</h2>
              <Badge variant="secondary" className="border-[#004854]/20 text-xs">
                <Info className="mr-1 h-3 w-3" />
                {normalizedPhase} Phase
              </Badge>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-[#32353C]/85">
              {competency.description}
            </p>

            {/* Assessment Guide */}
            <div className="rounded-lg border border-[#004854]/12 bg-[#8ED1C1]/10 p-4">
              <h4 className="mb-2 text-sm font-semibold text-[#004854]">Assessment Guide</h4>
              <div className="space-y-2 text-xs text-[#32353C]/85">
                {TIERS.slice()
                  .reverse()
                  .map((tier) => (
                    <div key={tier.key} className="flex items-start gap-2">
                      <div className={cn('mt-1.5 h-1.5 w-1.5 rounded-full', tier.dotColor)} />
                      <p>
                        <span className={cn('font-semibold', tier.textColor)}>
                          {tier.fullLabel}:
                        </span>{' '}
                        {tier.level === 3 && 'Consistently demonstrates most indicators'}
                        {tier.level === 2 && 'Regular evidence of key indicators'}
                        {tier.level === 1 && 'Beginning to show indicators'}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Groups */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {grouped.map((group, i) => {
          const tierStyle = getTierByLevel(group.tier);
          if (!tierStyle) return null;
          return <FullTierCard key={`${group.tier}-${i}`} group={group} tierStyle={tierStyle} />;
        })}
      </div>
    </div>
  );
}
