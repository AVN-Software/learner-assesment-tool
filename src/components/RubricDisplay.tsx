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
  ListChecks,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { CompetencyId as CompetencyIdType } from "@/types/rubric";
import { normalizeCompetency, normalizePhase } from "@/utils/normalizers";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/* ------------------ Types ------------------ */
interface RubricDisplayProps {
  phase: string;
  competencyId: string;
  trigger?: React.ReactNode;
  asSheet?: boolean;
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

/* ------------------ Tier presentation styles ------------------ */
export const tierStyles = [
  {
    tier: 1 as const,
    label: "Emerging",
    bg: "bg-amber-50",
    border: "border-amber-200",
    headBg: "bg-amber-100",
    headText: "text-amber-900",
    iconBg: "bg-amber-500",
    badge: "bg-amber-100 text-amber-900 border-amber-300",
    indicatorBg: "bg-amber-500/10",
    indicatorBorder: "border-amber-200",
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
    indicatorBg: "bg-blue-500/10",
    indicatorBorder: "border-blue-200",
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
    indicatorBg: "bg-emerald-500/10",
    indicatorBorder: "border-emerald-200",
  },
] as const;

const TierIcon: React.FC<{ tier: TierNumber; className?: string }> = ({
  tier,
  className,
}) => {
  if (tier === 1) return <TrendingUp className={className} />;
  if (tier === 2) return <Zap className={className} />;
  return <Award className={className} />;
};

/* ------------------ Mobile Tier Card ------------------ */
const MobileTierCard: React.FC<{
  group: TierGroup;
  style: (typeof tierStyles)[number];
}> = ({ group, style }) => (
  <AccordionItem
    value={`tier-${group.tier}`}
    className={`border-2 ${style.border} ${style.bg} rounded-2xl overflow-hidden shadow-sm`}
  >
    <AccordionTrigger
      className={`p-4 hover:no-underline ${style.headBg} hover:${style.headBg}/80`}
    >
      <div className="flex items-center gap-3 w-full text-left">
        <div
          className={`w-10 h-10 ${style.iconBg} rounded-lg flex items-center justify-center shadow flex-shrink-0`}
        >
          <TierIcon tier={group.tier} className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-base ${style.headText}`}>
              Tier {group.tier}
            </h3>
            <Badge variant="outline" className={style.badge}>
              {style.label}
            </Badge>
          </div>
          <p
            className={`text-xs ${style.headText} opacity-75 mt-1 line-clamp-2`}
          >
            {group.description}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="secondary" className="text-xs">
            {group.items.length}
          </Badge>
          <ChevronDown className="w-4 h-4 text-slate-500 transition-transform duration-200" />
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="p-0">
      <div className="p-4 space-y-3">
        {group.items.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-3">
            No indicators defined.
          </p>
        ) : (
          group.items.map((ind) => (
            <div
              key={ind.indicator_id}
              className={`rounded-xl p-3 border ${style.indicatorBorder} ${style.indicatorBg}`}
            >
              <p className="font-medium text-slate-800 text-sm leading-snug">
                {ind.question}
              </p>
              {ind.hint && (
                <div className="mt-2 flex items-start gap-2 text-xs text-slate-600">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="flex-1">{ind.hint}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AccordionContent>
  </AccordionItem>
);

/* ------------------ Desktop Tier Card ------------------ */
const DesktopTierCard: React.FC<{
  group: TierGroup;
  style: (typeof tierStyles)[number];
}> = ({ group, style }) => (
  <section
    className={`rounded-2xl overflow-hidden border-2 ${style.border} ${style.bg} shadow-sm h-fit`}
  >
    <header className={`${style.headBg} border-b-2 ${style.border} p-5`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${style.iconBg} rounded-lg flex items-center justify-center shadow`}
          >
            <TierIcon tier={group.tier} className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${style.headText}`}>
              Tier {group.tier}
            </h3>
            <p className={`text-xs font-medium ${style.headText} opacity-75`}>
              {style.label}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={style.badge}>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {group.items.length}
        </Badge>
      </div>
      <p className="text-sm text-slate-700 mt-3 leading-relaxed">
        {group.description}
      </p>
    </header>

    <div className="p-5">
      {group.items.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-3">
          No indicators defined.
        </p>
      ) : (
        <ul className="space-y-3">
          {group.items.map((ind) => (
            <li
              key={ind.indicator_id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0 mt-2" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 text-sm leading-relaxed">
                    {ind.question}
                  </p>
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
  trigger,
  asSheet = false,
}: RubricDisplayProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  // Error state
  if (!normalizedPhase || !normalizedComp || !data || !competency) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700 font-medium text-sm">
          No rubric data found for {competencyId} ({phase}).
        </p>
        <p className="text-red-700 text-xs mt-1">
          Ensure phase is one of: Foundation, Intermediate, Senior, FET
        </p>
      </div>
    );
  }

  const IconComponent = iconMap[normalizedComp as CompetencyIdType] ?? Info;

  // Content to render
  const rubricContent = (
    <div className={asSheet ? "p-1" : "my-4 sm:my-6"}>
      {/* Header */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg sm:rounded-xl flex items-center justify-center shadow">
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                {competency.competency_name}
              </h2>
              <Badge variant="secondary" className="text-xs">
                <Info className="w-3 h-3 mr-1" />
                {normalizedPhase} Phase
              </Badge>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {competency.description}
            </p>

            {/* How to score */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold mb-2">
                <ListChecks className="w-4 h-4" />
                How to assess
              </div>
              <ol className="text-xs sm:text-sm text-slate-700 space-y-2 list-decimal list-inside">
                <li className="leading-relaxed">
                  <span className="font-medium text-emerald-700">Tier 3:</span>{" "}
                  Most indicators observed consistently
                </li>
                <li className="leading-relaxed">
                  <span className="font-medium text-blue-700">Tier 2:</span>{" "}
                  Regular evidence of key indicators
                </li>
                <li className="leading-relaxed">
                  <span className="font-medium text-amber-700">Tier 1:</span>{" "}
                  Emerging or inconsistent evidence
                </li>
                <li className="italic text-slate-600 mt-1">
                  Use hints for classroom examples
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Tiers */}
      {isMobile ? (
        <Accordion type="single" collapsible className="space-y-3">
          {grouped.map((group, index) => {
            const style = tierStyles[group.tier - 1];
            return (
              <MobileTierCard key={`${group.tier}-${index}`} group={group} style={style} />
            );
          })}
        </Accordion>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {grouped.map((group, index) => {
            const style = tierStyles[group.tier - 1];
            return (
              <DesktopTierCard
                key={`${group.tier}-${index}`}
                group={group}
                style={style}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  // Render as sheet if triggered
  if (asSheet && trigger) {
    return (
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent className="sm:max-w-2xl lg:max-w-4xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              Assessment Rubric
            </SheetTitle>
          </SheetHeader>
          {rubricContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Standard render
  return rubricContent;
}
