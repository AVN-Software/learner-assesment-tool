// -------------------------------
// TEMPACCOUNTS (fellows)

// -------------------------------
export interface TempAccount {
  id: string;
  fellowname: string;
  email: string;
  coachname?: string | null;
  yearoffellowship?: number | null;
  grade: string; // Added: fellow's grade
  phase: string; // Added: fellow's phase
  created_at?: string | null;
  onboarding_complete?: boolean | null;
  onboarding_term?: number | null; // 1–4
  term1_complete?: boolean | null;
  term2_complete?: boolean | null;
  term3_complete?: boolean | null;
  term4_complete?: boolean | null;
}

// -------------------------------
// COMPETENCY_ASSESSMENTS
// -------------------------------

// -------------------------------
// ASSESSMENTS (main assessment record)
// -------------------------------
export interface Assessment {
  id: string;
  learner_id: string; // FK → learners.id
  fellow_id: string; // FK → tempaccounts.id
  term: number; // 1-4
  grade: string;
  phase: string;
  created_at?: string | null;
  submitted_at?: string | null;
}

// -------------------------------
// LEARNERS
// -------------------------------
export interface Learner {
  id: string;
  fellow_id: string; // FK → tempaccounts.id
  learner_name: string;
  created_at?: string | null;
}
// -------------------------------
// RELATIONSHIP HELPERS
// -------------------------------
export interface AssessmentWithCompetencies extends Assessment {
  motivation?: CompetencyAssessment;
  teamwork?: CompetencyAssessment;
  analytical?: CompetencyAssessment;
  curiosity?: CompetencyAssessment;
  leadership?: CompetencyAssessment;
}

export interface LearnerWithAssessments extends Learner {
  term1_assessment?: AssessmentWithCompetencies | null;
  term2_assessment?: AssessmentWithCompetencies | null;
  term3_assessment?: AssessmentWithCompetencies | null;
  term4_assessment?: AssessmentWithCompetencies | null;
}

export interface FellowWithLearners extends TempAccount {
  learners?: LearnerWithAssessments[];
}

/* ----------------------------------------------------------------------------
   Types
---------------------------------------------------------------------------- */
export type Phase = "Foundation" | "Intermediate" | "Senior" | "FET";
export type Grade =
  | "Grade R"
  | "Grade 1"
  | "Grade 2"
  | "Grade 3"
  | "Grade 4"
  | "Grade 5"
  | "Grade 6"
  | "Grade 7"
  | "Grade 8"
  | "Grade 9"
  | "Grade 10"
  | "Grade 11"
  | "Grade 12";

export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

export type CompetencyAssessment = {
  tier_score: 1 | 2 | 3;
  evidence: string;
};

/* ----------------------------------------------------------------------------
   Constants
---------------------------------------------------------------------------- */
export const COMPETENCIES = [
  { id: "motivation" as const, name: "Motivation & Self-Awareness" },
  { id: "teamwork" as const, name: "Teamwork" },
  { id: "analytical" as const, name: "Analytical Thinking" },
  { id: "curiosity" as const, name: "Curiosity & Creativity" },
  { id: "leadership" as const, name: "Leadership & Social Influence" },
] as const;

export const TIERS = [
  {
    value: 1,
    label: "Tier 1",
    fullLabel: "Tier 1: Emerging",
    color: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    value: 2,
    label: "Tier 2",
    fullLabel: "Tier 2: Progressing",
    color: "bg-blue-100 text-blue-900 border-blue-300",
  },
  {
    value: 3,
    label: "Tier 3",
    fullLabel: "Tier 3: Advanced",
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
] as const;

export const GRADE_LABELS: Record<string, string> = {
  "Grade R": "Grade R",
  "Grade 1": "Grade 1",
  "Grade 2": "Grade 2",
  "Grade 3": "Grade 3",
  "Grade 4": "Grade 4",
  "Grade 5": "Grade 5",
  "Grade 6": "Grade 6",
  "Grade 7": "Grade 7",
  "Grade 8": "Grade 8",
  "Grade 9": "Grade 9",
  "Grade 10": "Grade 10",
  "Grade 11": "Grade 11",
  "Grade 12": "Grade 12",
} as const;

/* ----------------------------------------------------------------------------
   Helper Functions
---------------------------------------------------------------------------- */
export const getTierColor = (tierScore: 1 | 2 | 3): string => {
  return TIERS.find((t) => t.value === tierScore)?.color || "";
};

export const getCompetencyName = (id: CompetencyId): string => {
  return COMPETENCIES.find((c) => c.id === id)?.name || "";
};

export interface StepConfig {
  stepNumber: number;
  title: string;
  description: string;
  primaryButton: string;
  showBackButton: boolean;
  isSubmitStep: boolean;
  icon: React.ComponentType<{ className?: string }>;
  meta: {
    label: string;
    desc: string;
    shortLabel: string;
  };
}
export interface StepInfo {
  config: StepConfig;
  isFirst: boolean;
  isLast: boolean;
}
export interface CompletionStats {
  totalCells: number;
  completedCells: number;
  missingEvidence: number;
  completionPercentage: number;
}

export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  canSubmit: boolean;
  nextLabel: string;
  statusMessage: string;
}
