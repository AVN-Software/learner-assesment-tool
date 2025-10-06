// ================================
// Core Static Types
// ================================

import {
  Target,
  Users,
  Lightbulb,
  Search,
  Star,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { LucideIcon } from "lucide-react";
import { Phase } from "./core";
import { TierKey } from "@/context/AssessmentProvider";
import { Competency } from "@/components/AssesmentTable";



export type TierLevel = 1 | 2 | 3;



// ================================
// Tier Descriptors
// ================================

export interface CompetencyTierDescriptor {
  phase: Phase; // e.g. "FET"
  competency_id: string; // links to Competency
  tier: TierLevel; // 1, 2, or 3
  description: string; // e.g. "Leads or contributes to group interactions..."
}

// ================================
// Rubric Indicators
// ================================

export interface RubricIndicator {
  indicator_id: string; // unique, e.g. "motivation_reflection"
  phase: Phase; // e.g. "Foundation"
  competency_id: string; // links to Competency
  tier: TierLevel; // 1, 2, or 3
  question: string; // "Behaviour Reflection – Do they reflect..."
  hint: string; // supporting hint
}

// ================================
// Aggregates (Optional Helpers)
// ================================

export interface PhaseRubric {
  phase: Phase;
  competencies: {
    competency: Competency;
    tiers: CompetencyTierDescriptor[];
    indicators: RubricIndicator[];
  }[];
}

// types/rubric.ts

export interface PhaseCompetencyTierDescriptor {
  phase: string; // e.g. "Foundation", "Intermediate", "Senior", "FET"
  competency_id: string; // links to Competency.competency_id
  tier: 1 | 2 | 3; // which tier the description applies to
  description: string; // the actual tier description
}


/* ---------------------------------------------------------------------------
   🧩 COMPETENCIES
--------------------------------------------------------------------------- */



export const TIER_META: Record<TierKey, { label: string; color: string }> = {
  tier1: { label: "Emerging", color: "amber" },
  tier2: { label: "Developing", color: "blue" },
  tier3: { label: "Advanced", color: "emerald" },
};



/* 🧩 COMPETENCIES */
export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";


