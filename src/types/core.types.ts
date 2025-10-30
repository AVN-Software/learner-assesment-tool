// ---------------------------------------------------------------------------
// 📘 Core Domain Types
// ---------------------------------------------------------------------------

/* ---------------------------------------------------------------------------
   Phases
--------------------------------------------------------------------------- */

/**
 * Represents the major learning phases of the program.
 */
export type Phase = 'Foundation' | 'Intermediate' | 'Senior' | 'FET' | 'Post-School';

/**
 * All available phases (for select menus, etc.)
 */
export const PHASES: readonly Phase[] = [
  'Foundation',
  'Intermediate',
  'Senior',
  'FET',
  'Post-School',
] as const;

/* ---------------------------------------------------------------------------
   Grades
--------------------------------------------------------------------------- */

/**
 * Valid numeric grade levels.
 * 0 corresponds to "Grade R" (Reception).
 */
export type GradeNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Ordered list of all grade numbers.
 */
export const GRADE_NUMBERS: readonly GradeNumber[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
] as const;

/**
 * Corresponding list of human-readable grade labels.
 * Matches the order of `GRADE_NUMBERS`.
 */
export const GRADE_LABELS: readonly string[] = [
  'Grade R',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
] as const;

/**
 * Helper: get the display label for a grade number.
 */
export const getGradeLabel = (grade: GradeNumber): string =>
  GRADE_LABELS[GRADE_NUMBERS.indexOf(grade)] ?? `Grade ${grade}`;
