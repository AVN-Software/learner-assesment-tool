// assessment.schema.ts
import { z, ZodError, ZodIssue } from "zod";

/* ---------------- Constants & Configuration ---------------- */
export const COMPETENCY_IDS = [
  "motivation",
  "teamwork",
  "analytical",
  "curiosity",
  "leadership",
] as const;

export const TIER_VALUES = ["", "tier1", "tier2", "tier3"] as const;
export const PHASES = ["Foundation", "Intermediate", "Senior", "FET"] as const;

export const CompetencyIdZ = z.enum(COMPETENCY_IDS);
export type CompetencyId = z.infer<typeof CompetencyIdZ>;

export const TierValueZ = z.enum(TIER_VALUES);
export type TierValue = z.infer<typeof TierValueZ>;

export const PhaseZ = z.enum(PHASES);
export type Phase = z.infer<typeof PhaseZ>;

export const TermZ = z.string().min(1, "Term is required");
export type Term = z.infer<typeof TermZ>;

/* ---------------- Validation Config ---------------- */
const VALIDATION_CONFIG = {
  evidence: {
    maxLength: 500,
    requiredWhenTierSelected: true,
  },
  competencies: { min: 1, max: 10 },
  learners: { min: 1, max: 100 },
} as const;

/* ---------------- Core Schemas ---------------- */
export const CompetencyAssessmentZ = z.object({
  competencyId: CompetencyIdZ,
  tier: TierValueZ,
  evidence: z
    .string()
    .trim()
    .max(VALIDATION_CONFIG.evidence.maxLength, {
      message: `Evidence must be less than ${VALIDATION_CONFIG.evidence.maxLength} characters`,
    })
    .optional()
    .default(""),
});

// Optional: enforce evidence when a tier is selected
export const CompetencyAssessmentWithEvidenceZ = CompetencyAssessmentZ.refine(
  (data) => {
    if (!VALIDATION_CONFIG.evidence.requiredWhenTierSelected) return true;
    return data.tier === "" || (data.evidence?.trim().length ?? 0) > 0;
  },
  {
    message: "Evidence is required when a tier is selected",
    path: ["evidence"],
  }
);

/* ---------------- Optimized Array Validations ---------------- */
export const CompetencyAssessmentArrayZ = z
  .array(CompetencyAssessmentZ)
  .min(VALIDATION_CONFIG.competencies.min, "At least one competency is required")
  .max(
    VALIDATION_CONFIG.competencies.max,
    `Maximum ${VALIDATION_CONFIG.competencies.max} competencies allowed`
  )
  .refine(
    (items) => {
      const competencyIds = items.map((item) => item.competencyId);
      return new Set(competencyIds).size === competencyIds.length;
    },
    { message: "Duplicate competency IDs are not allowed" }
  );

export const LearnerAssessmentZ = z
  .object({
    learnerId: z.string().min(1, "Learner ID is required"),
    phase: PhaseZ.optional().describe("Learning phase for contextual validation"),
    items: CompetencyAssessmentArrayZ,
  })
  .refine(
    (data) => {
      const ids = data.items.map((item) => item.competencyId);
      return new Set(ids).size === ids.length;
    },
    {
      message: "A learner cannot have duplicate competency assessments",
      path: ["items"],
    }
  );

export const LearnerAssessmentArrayZ = z
  .array(LearnerAssessmentZ)
  .min(
    VALIDATION_CONFIG.learners.min,
    "At least one learner assessment is required"
  )
  .max(
    VALIDATION_CONFIG.learners.max,
    `Maximum ${VALIDATION_CONFIG.learners.max} learners per submission`
  )
  .refine(
    (learners) => {
      const learnerIds = learners.map((l) => l.learnerId);
      return new Set(learnerIds).size === learnerIds.length;
    },
    { message: "Duplicate learner IDs are not allowed" }
  );

export const AssessmentSubmissionZ = z
  .object({
    term: TermZ,
    fellowId: z.string().min(1, "Fellow ID is required"),
    learners: LearnerAssessmentArrayZ,
    metadata: z
      .object({
        submittedAt: z.string().datetime().optional(),
        version: z.string().optional().default("1.0.0"),
      })
      .optional()
  })
  .refine(
    (data) => {
      const allAssessments = data.learners.flatMap((learner) =>
        learner.items.map((item) => `${learner.learnerId}_${item.competencyId}`)
      );
      return new Set(allAssessments).size === allAssessments.length;
    },
    {
      message: "Duplicate competency assessments for the same learner are not allowed",
    }
  );

/* ---------------- Partial Schemas for Updates ---------------- */
export const PartialCompetencyAssessmentZ = CompetencyAssessmentZ.partial();
export const PartialLearnerAssessmentZ = LearnerAssessmentZ.partial();
export const PartialAssessmentSubmissionZ = AssessmentSubmissionZ.partial();

/* ---------------- Types ---------------- */
export type CompetencyAssessment = z.infer<typeof CompetencyAssessmentZ>;
export type LearnerAssessment = z.infer<typeof LearnerAssessmentZ>;
export type AssessmentSubmission = z.infer<typeof AssessmentSubmissionZ>;

/* ---------------- Form Helpers ---------------- */
export type AssessmentFormData = {
  term: string;
  fellowId: string;
  learners: Array<{
    learnerId: string;
    phase?: Phase;
    items: Array<{
      competencyId: CompetencyId;
      tier: TierValue;
      evidence: string;
    }>;
  }>;
};

export const validateCompetencyAssessment = (data: unknown) =>
  CompetencyAssessmentZ.safeParse(data);
export const validateLearnerAssessment = (data: unknown) =>
  LearnerAssessmentZ.safeParse(data);
export const validateAssessmentSubmission = (data: unknown) =>
  AssessmentSubmissionZ.safeParse(data);

export const transformToSubmission = (data: AssessmentFormData): AssessmentSubmission =>
  AssessmentSubmissionZ.parse(data);

export const createEmptyCompetencyAssessment = (
  competencyId: CompetencyId
): CompetencyAssessment => ({
  competencyId,
  tier: "",
  evidence: "",
});

export const createEmptyLearnerAssessment = (
  learnerId: string,
  phase?: Phase
): LearnerAssessment => ({
  learnerId,
  phase,
  items: COMPETENCY_IDS.map((id) =>
    createEmptyCompetencyAssessment(id as CompetencyId)
  ),
});

/* ---------------- Evidence completion helpers ---------------- */
export function countEvidenceCompletionForLearner(learner: LearnerAssessment) {
  const totalWithTier = learner.items.filter((i) => i.tier !== "").length;
  const withEvidence = learner.items.filter(
    (i) => i.tier !== "" && (i.evidence?.trim().length ?? 0) > 0
  ).length;
  return { withEvidence, totalWithTier, label: `${withEvidence}/${totalWithTier}` };
}

export function countEvidenceCompletionForSubmission(sub: AssessmentSubmission) {
  const totals = sub.learners.map(countEvidenceCompletionForLearner);
  const withEvidence = totals.reduce((a, b) => a + b.withEvidence, 0);
  const totalWithTier = totals.reduce((a, b) => a + b.totalWithTier, 0);
  return { withEvidence, totalWithTier, label: `${withEvidence}/${totalWithTier}` };
}

/* ---------------- Error Types & helpers ---------------- */
export type ValidationError = {
  code: ZodIssue["code"];
  message: string;
  path: (string | number)[];
};

export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
};

function formatZodErrors(err: ZodError): ValidationError[] {
  return err.issues.map((i) => ({
    code: i.code,
    message: i.message,
    path: i.path as (string | number)[],
  }));
}

export function safeParseWithErrors<T>(
  schema: z.ZodType<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: formatZodErrors(result.error) };
  }
  return { success: true, data: result.data };
}

export function assertParse<T>(
  schema: z.ZodType<T>,
  data: unknown,
  errPrefix = "Validation failed"
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = formatZodErrors(result.error);
    const msg =
      errPrefix +
      ":\n" +
      errors
        .map(
          (e) =>
            `- ${e.message} (path: ${e.path.join(".") || "<root>"}, code: ${e.code})`
        )
        .join("\n");
    const error = new Error(msg);
    (error as any).errors = errors;
    throw error;
  }
  return result.data;
}

/* ---------------- Optional UUID variants ---------------- */
export const UuidZ = z.string().uuid({ message: "Invalid UUID format" });

export const LearnerAssessmentWithUuidZ = LearnerAssessmentZ.extend({
  learnerId: UuidZ,
});
export type LearnerAssessmentWithUuid = z.infer<typeof LearnerAssessmentWithUuidZ>;

export const AssessmentSubmissionWithUuidZ = AssessmentSubmissionZ.extend({
  fellowId: UuidZ,
});
export type AssessmentSubmissionWithUuid = z.infer<typeof AssessmentSubmissionWithUuidZ>;
