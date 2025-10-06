// /types/assessment.ts
import { LucideIcon } from "lucide-react";
import { CompetencyId } from "./rubric";




/* ---------------------------------------------------------------------------
   🧮 ASSESSMENT STRUCTURE
--------------------------------------------------------------------------- */

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

export interface Assessment {
  learnerId: string | number;
  phase: "foundation" | "intermediate" | "senior" | "fet";
  scores: {
    [competencyId: string]: "tier1" | "tier2" | "tier3" | ""; // empty = not yet selected
  };
  assessedAt?: Date; // timestamp for the whole assessment session
  assessedBy?: string; // who conducted the assessment
}
export type AssessmentData = Record<string, string>;
