// /types/assessment.ts
import { LucideIcon } from "lucide-react";

/* ---------------------------------------------------------------------------
   📘 PHASES & TERMS
--------------------------------------------------------------------------- */
export type Phase = "Foundation" | "Intermediate" | "Senior" | "FET";
export type Term = "Term 1" | "Term 2" | "Term 3" | "Term 4";

/* ---------------------------------------------------------------------------
   👩‍🏫 FELLOWS / LEARNERS
--------------------------------------------------------------------------- */
export interface Fellow {
  id: string;
  name: string;
  email: string;
  coachName: string;
  yearOfFellowship: number;
}

export interface Learner {
  id: string;
  fellowId: string;
  name: string;
  grade: string;
  subject: string;
  phase: Phase;
}

/* ---------------------------------------------------------------------------
   🧩 COMPETENCIES
--------------------------------------------------------------------------- */
export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

export interface Competency {
  id: CompetencyId;
  name: string;
  icon: LucideIcon;
}



/* ---------------------------------------------------------------------------
   🎯 TIERS
--------------------------------------------------------------------------- */
export type TierValue = "" | "tier1" | "tier2" | "tier3";
export type TierKey = Exclude<TierValue, "">;

export const TIER_META: Record<TierKey, { label: string; color: string }> = {
  tier1: { label: "Emerging", color: "amber" },
  tier2: { label: "Developing", color: "blue" },
  tier3: { label: "Advanced", color: "emerald" },
};

/* ---------------------------------------------------------------------------
   🧮 ASSESSMENT STRUCTURE
--------------------------------------------------------------------------- */
export type AssessmentMap = Record<string, TierValue>;
export type EvidenceMap = Record<string, string>;

/** Consistent map keys used across the app */
export const keyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}`;
export const eKeyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}_evidence`;

/* ---------------------------------------------------------------------------
   🧭 APP FLOW STEPS
--------------------------------------------------------------------------- */
export const STEPS = ["intro", "select", "assess", "summary"] as const;
export type Step = (typeof STEPS)[number];
