// steps.ts

// ============================================================================
// NAVIGATION
// ============================================================================

export type Step = "login" | "intro" | "selection" | "assessment" | "review";

export const STEPS = [
  "login",
  "intro",
  "selection",
  "assessment",
  "review",
] as const;
