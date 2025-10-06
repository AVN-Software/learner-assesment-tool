// steps.ts
export const STEPS = ["intro", "select", "assess", "summary"] as const;
export type Step = typeof STEPS[number];
