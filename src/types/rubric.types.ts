// ---------------------------------------------------------------------------
// 📘 Rubric Domain Types
// ---------------------------------------------------------------------------

import type { CompetencyId } from '@/types';

/* ---------------------------------------------------------------------------
   Competencies
--------------------------------------------------------------------------- */

/**
 * Represents a single competency definition in the rubric.
 */
export interface Competency {
  id: CompetencyId;
  name: string;
}

/**
 * Core set of competencies used across rubric assessments.
 * Ensure these align with your assessment schema and Supabase data model.
 */
export const COMPETENCIES = [
  { id: 'motivation', name: 'Motivation & Self-Awareness' },
  { id: 'teamwork', name: 'Teamwork' },
  { id: 'analytical', name: 'Analytical Thinking' },
  { id: 'curiosity', name: 'Curiosity & Creativity' },
  { id: 'leadership', name: 'Leadership & Social Influence' },
] as const;

/**
 * Literal union type of all competency keys.
 */
export type CompetencyKey = (typeof COMPETENCIES)[number]['id'];

/* ---------------------------------------------------------------------------
   Tiers
--------------------------------------------------------------------------- */

/**
 * Represents a rubric tier (Emerging → Progressing → Advanced).
 */
export interface Tier {
  value: 1 | 2 | 3;
  fullLabel: string;
  color: string;
}

/**
 * Human-readable tier definitions for rubric scoring.
 */
export const TIERS: readonly Tier[] = [
  {
    value: 1,
    fullLabel: 'Tier 1: Emerging',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    value: 2,
    fullLabel: 'Tier 2: Progressing',
    color: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  {
    value: 3,
    fullLabel: 'Tier 3: Advanced',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
];

/**
 * Extracted literal type of valid tier scores.
 */
export type TierScore = (typeof TIERS)[number]['value'];

/**
 * Returns the color classes for a given tier value.
 */
export const getTierColor = (tierScore: TierScore): string =>
  TIERS.find((t) => t.value === tierScore)?.color || '';
