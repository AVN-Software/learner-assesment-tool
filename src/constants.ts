/**
 * constants.ts
 * All constant values for the assessment application
 */

import {
  NotebookPen,
  UserRoundSearch,
  Users,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";
import type {
  Grade,
  Competency,
  TierOption,
  TierKey,
  StepKey,
  StepConfig,
} from "./types";

/* ===========================================================================
   📚 GRADE LABELS CONSTANT
=========================================================================== */
export const GRADE_LABELS: Record<Grade, string> = {
  "Grade R": "Grade R",
  "Grade 1": "Grade 1",
  "Grade 2": "Grade 2",
  "Grade 3": "Grade 3",
  "Grade 4": "Grade 4",
  "Grade 5": "Grade 5",
  "Grade 6": "Grade 6",
  "Grade 7": "Grade 7",
  "Grade 8": "Grade 8",
  "Grade 9": "Grade 9",
  "Grade 10": "Grade 10",
  "Grade 11": "Grade 11",
  "Grade 12": "Grade 12",
};

/* ===========================================================================
   🎨 CONSTANTS - COMPETENCIES
=========================================================================== */
export const COMPETENCIES: Competency[] = [
  { id: "motivation", name: "Motivation & Self-Awareness" },
  { id: "teamwork", name: "Teamwork" },
  { id: "analytical", name: "Analytical Thinking" },
  { id: "curiosity", name: "Curiosity & Creativity" },
  { id: "leadership", name: "Leadership & Social Influence" },
];

/* ===========================================================================
   🎨 CONSTANTS - TIERS
=========================================================================== */
export const TIERS: readonly TierOption[] = [
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

export const TIER_META: Record<TierKey, { label: string; color: string }> = {
  tier1: { label: "Emerging", color: "amber" },
  tier2: { label: "Developing", color: "blue" },
  tier3: { label: "Advanced", color: "emerald" },
};

/* ===========================================================================
   🎨 CONSTANTS - WIZARD CONFIGURATION
=========================================================================== */
