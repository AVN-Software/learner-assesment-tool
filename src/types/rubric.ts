// ================================
// Core Static Types
// ================================

export type Phase = "Foundation" | "Intermediate" | "Senior" | "FET";

export type TierLevel = 1 | 2 | 3;

export interface Competency {
  competency_id: string; // e.g. "motivation"
  competency_name: string; // e.g. "Motivation & Self-Awareness"
  description: string; // static description
}

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
