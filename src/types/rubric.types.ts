// ---------------------------------------------------------------------------
// 📘 Rubric & Competency Types (Consolidated)
// ---------------------------------------------------------------------------

import { PhaseCode } from './core.types';

/* ---------------------------------------------------------------------------
   COMPETENCIES
--------------------------------------------------------------------------- */

/**
 * Competency ID (short code).
 */
export type CompetencyId = 'motivation' | 'teamwork' | 'analytical' | 'curiosity' | 'leadership';

/**
 * Competency area (full name used in rubric).
 */
export type CompetencyArea =
  | 'Academic Outcomes'
  | 'Teamwork'
  | 'Curiosity and Creativity'
  | 'Analytic Thinking'
  | 'Leadership'
  | 'Motivation and Self-Awareness';

/**
 * Competency category (analytics/DB code).
 */
export type CompetencyCategory = 'overall' | 'SE' | 'AII' | 'KPC' | 'IA' | 'LE';

/**
 * Unified competency definition with all properties.
 */
export interface Competency {
  id: CompetencyId;
  name: CompetencyArea;
  label: string;
  category: CompetencyCategory;
}

/**
 * Complete competency definitions (single source of truth).
 */
export const COMPETENCIES: readonly Competency[] = [
  {
    id: 'motivation',
    name: 'Motivation and Self-Awareness',
    label: 'Motivation',
    category: 'SE',
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    label: 'Teamwork',
    category: 'AII',
  },
  {
    id: 'analytical',
    name: 'Analytic Thinking',
    label: 'Analytical',
    category: 'KPC',
  },
  {
    id: 'curiosity',
    name: 'Curiosity and Creativity',
    label: 'Curiosity',
    category: 'IA',
  },
  {
    id: 'leadership',
    name: 'Leadership',
    label: 'Leadership',
    category: 'LE',
  },
] as const;

/**
 * Helper — get competency by ID.
 */
export const getCompetencyById = (id: CompetencyId): Competency | undefined =>
  COMPETENCIES.find((c) => c.id === id);

/**
 * Helper — get competency by category.
 */
export const getCompetencyByCategory = (category: CompetencyCategory): Competency | undefined =>
  COMPETENCIES.find((c) => c.category === category);

/* ---------------------------------------------------------------------------
   TIERS
--------------------------------------------------------------------------- */

/**
 * Tier numeric level (1-3).
 */
export type TierLevel = 1 | 2 | 3;

/**
 * Tier string key format.
 */
export type TierKey = 'tier1' | 'tier2' | 'tier3';

/**
 * Unified tier definition with all properties.
 */
export interface Tier {
  key: TierKey;
  level: TierLevel;
  label: string;
  fullLabel: string;
  color: string;
  // Display styles
  bg: string;
  border: string;
  headerBg: string;
  textColor: string;
  dotColor: string;
}

/**
 * Complete tier definitions (single source of truth).
 */
export const TIERS: readonly Tier[] = [
  {
    key: 'tier1',
    level: 1,
    label: 'T1',
    fullLabel: 'Tier 1: Emerging',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    headerBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    textColor: 'text-amber-900',
    dotColor: 'bg-amber-500',
  },
  {
    key: 'tier2',
    level: 2,
    label: 'T2',
    fullLabel: 'Tier 2: Developing',
    color: 'bg-blue-100 text-blue-900 border-blue-300',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    headerBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    textColor: 'text-blue-900',
    dotColor: 'bg-blue-500',
  },
  {
    key: 'tier3',
    level: 3,
    label: 'T3',
    fullLabel: 'Tier 3: Advanced',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    headerBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    textColor: 'text-emerald-900',
    dotColor: 'bg-emerald-500',
  },
] as const;

/**
 * Helper — get tier by level.
 */
export const getTierByLevel = (level: TierLevel): Tier | undefined =>
  TIERS.find((t) => t.level === level);

/**
 * Helper — get tier by key.
 */
export const getTierByKey = (key: TierKey): Tier | undefined => TIERS.find((t) => t.key === key);

/**
 * Human-readable tier names for metadata.
 */
export type TierName =
  | 'Tier 1: Emerging Learner'
  | 'Tier 2: Progressing Learner'
  | 'Tier 3: Advancing Learner';

/* ---------------------------------------------------------------------------
   ASSESSMENTS & RUBRIC ITEMS
--------------------------------------------------------------------------- */

/**
 * Assessment record for a learner's competency.
 */
export interface CompetencyAssessment {
  tier_score: TierLevel;
  evidence: string;
}

/**
 * A single rubric item (indicator/question).
 */
export type RubricItem = {
  indicator_id: string | number;
  question: string;
  hint?: string;
};

/**
 * Group of rubric items at a specific tier.
 */
export type TierGroup = {
  tier: TierLevel;
  description: string;
  items: RubricItem[];
};

/**
 * Content for a competency at a specific tier.
 */
export type CompetencyTierData = {
  description: string;
  learnerPhrase: string;
};

/**
 * Structure of a competency's data across its tiers.
 */
export type CompetencyData = {
  category: CompetencyCategory;
  tiers: Record<TierKey, CompetencyTierData>;
};

/* ---------------------------------------------------------------------------
   RUBRIC PHASES
--------------------------------------------------------------------------- */

/**
 * A single phase's rubric definition.
 */
export type RubricPhase = {
  phaseName: string;
  phaseCode: PhaseCode;
  description?: string;
  competencies: Record<CompetencyArea, CompetencyData>;
};

/**
 * The full rubric system (all phases + metadata).
 */
export type LearnerRubricSystem = {
  phases: Record<PhaseCode, RubricPhase>;
  metadata: {
    version: string;
    academicYear: string;
    tiers: Record<TierKey, TierName>;
  };
};
