// src/config/config.ts

/**
 * Global tool configuration for the app.
 * Contains version info, term definitions, and date helpers.
 *
 * All runtime logic (e.g., current term detection) should rely on this module.
 */

export type TermName = "Term 1" | "Term 2" | "Term 3" | "Term 4";

export interface TermDefinition {
  name: TermName;
  start_date: string; // ISO format
  end_date: string; // ISO format
  submission_close_date: string; // ISO format
}

/**
 * Define all terms for the fellowship cycle.
 * These can be adjusted yearly without code changes elsewhere.
 */
export const TERMS: TermDefinition[] = [
  {
    name: "Term 1",
    start_date: "2025-01-01",
    end_date: "2025-03-31",
    submission_close_date: "2025-04-05",
  },
  {
    name: "Term 2",
    start_date: "2025-04-01",
    end_date: "2025-06-30",
    submission_close_date: "2025-07-05",
  },
  {
    name: "Term 3",
    start_date: "2025-07-01",
    end_date: "2025-09-30",
    submission_close_date: "2025-10-05",
  },
  {
    name: "Term 4",
    start_date: "2025-10-01",
    end_date: "2025-12-31",
    submission_close_date: "2026-01-05",
  },
];

/**
 * Derive current term from a given date.
 * Falls back to "Term 4" if date is beyond defined range.
 */
export function getCurrentTerm(date: Date = new Date()): TermName {
  const iso = date.toISOString().split("T")[0];
  const term = TERMS.find((t) => iso >= t.start_date && iso <= t.end_date);
  return term ? term.name : "Term 4";
}

/**
 * Get all submission cutoff dates for use in dashboards or sync logic.
 */
export const TERM_SUBMISSION_DATES = TERMS.map((t) => ({
  term: t.name,
  submission_close_date: t.submission_close_date,
}));

/**
 * Base tool state configuration.
 * The current term is derived dynamically but stored for consistency.
 */
export const TOOL_STATE = {
  version: 2,
  current_term: getCurrentTerm(),
  term_submission_close_date: TERM_SUBMISSION_DATES.find(
    (t) => t.term === getCurrentTerm()
  )?.submission_close_date,
  tool_mode: "official", // "pilot" | "official"
} as const;

/**
 * Example usage:
 *  import { TOOL_STATE, getCurrentTerm, TERM_SUBMISSION_DATES } from "@/config/config";
 *
 *  console.log(TOOL_STATE.current_term); // "Term 3"
 *  console.log(getCurrentTerm(new Date("2025-05-10"))); // "Term 2"
 *  console.log(TERM_SUBMISSION_DATES);
 */
