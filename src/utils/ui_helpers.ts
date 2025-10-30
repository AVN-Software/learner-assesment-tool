import { TIERS } from '@/types/rubric.types';

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */
const getTierColor = (tierScore: 1 | 2 | 3) =>
  TIERS.find((t) => t.value === tierScore)?.color || '';
