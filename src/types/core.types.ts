// ---------------------------------------------------------------------------
// 📘 Core Domain Types
// ---------------------------------------------------------------------------

/**
 * Represents the major learning phases of the program.
 */
export type Phase = 'Foundation' | 'Intermediate' | 'Senior' | 'FET';
export type PhaseCode = 'foundation' | 'intermediate' | 'senior' | 'fet';
/**
 * All available learning phases (for dropdowns, grouping, etc.).
 */
export const PHASES: readonly Phase[] = ['Foundation', 'Intermediate', 'Senior', 'FET'] as const;

/* ---------------------------------------------------------------------------
   GRADES
--------------------------------------------------------------------------- */

/**
 * Literal grade labels.
 */
export type Grade =
  | 'Grade R'
  | 'Grade 1'
  | 'Grade 2'
  | 'Grade 3'
  | 'Grade 4'
  | 'Grade 5'
  | 'Grade 6'
  | 'Grade 7'
  | 'Grade 8'
  | 'Grade 9'
  | 'Grade 10'
  | 'Grade 11'
  | 'Grade 12';

/**
 * Numeric representation of grades.
 * 0 corresponds to "Grade R" (Reception).
 */
export type GradeNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Ordered list of grade numbers.
 */
export const GRADE_NUMBERS: readonly GradeNumber[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
] as const;

/**
 * Ordered list of human-readable grade labels (matches `GRADE_NUMBERS` order).
 */
export const GRADE_LABELS: readonly Grade[] = [
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
 * Helper — returns a readable label for a numeric grade.
 */
export const getGradeLabel = (grade: GradeNumber): Grade =>
  GRADE_LABELS[GRADE_NUMBERS.indexOf(grade)] ?? (`Grade ${grade}` as Grade);
