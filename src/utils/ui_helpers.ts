import { TIERS } from '@/types/rubric.types';

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */
export const getTierColor = (tierScore: 1 | 2 | 3) =>
  TIERS.find((t) => t.level === tierScore)?.color || '';
