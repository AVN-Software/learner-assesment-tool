import { z } from "zod";

// Session schema
export const SessionSchema = z.object({
  term: z.string().min(1, "Term is required"),
  fellowId: z.string().min(1),
  fellowName: z.string().min(1),
  coachName: z.string().min(1),
  schoolName: z.string().min(1),
  schoolLevel: z.string().min(1),
});
export type Session = z.infer<typeof SessionSchema>;

// Learner schema
export const LearnerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  grade: z.string().min(1),
  phase: z.enum(["foundation", "intermediate", "senior", "fet"]),
  fellowId: z.string(),
});
export type Learner = z.infer<typeof LearnerSchema>;

// Assessment schema (one score entry)
export const AssessmentSchema = z.object({
  learnerId: z.string(),
  competencyId: z.string(),
  value: z.enum(["", "tier1", "tier2", "tier3"]),
});
export type Assessment = z.infer<typeof AssessmentSchema>;
