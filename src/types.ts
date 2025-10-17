/**
 * types.ts
 * ✅ Strict TypeScript types and interfaces for the assessment application
 */

import type { ComponentType } from "react";

/* ===========================================================================
   📘 BASE TYPES
=========================================================================== */

export type UUID = string;

export type Term = "Term 1" | "Term 2" | "Term 3" | "Term 4";

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

export type Phase = "foundation" | "intermediate" | "senior" | "fet";

/* ===========================================================================
   🧑‍🏫 DATA ENTITY TYPES
=========================================================================== */

export interface Coach {
  readonly coach_id: UUID;
  readonly coach_name: string;
  readonly created_at: string;
}

export interface Fellow {
  readonly fellow_id: UUID;
  readonly fellow_name: string;
  readonly email_address: string;
  readonly coach_name: string;
  readonly coach_id?: UUID;
  readonly year_of_fellowship: number;
  readonly temp_pass?: string | null;
  readonly created_at: string;
}

export interface Learner {
  readonly learner_id: UUID;
  readonly fellow_id: UUID;
  readonly learner_name: string;
  readonly grade?: Grade | null;
  readonly phase?: Phase | null;
  readonly created_at: string;
}

/* ===========================================================================
   🎯 COMPETENCY & TIER TYPES
=========================================================================== */

export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

export interface Competency {
  readonly id: CompetencyId;
  readonly name: string;
  readonly icon?: ComponentType<{ className?: string }>;
}

export type TierLevel = 1 | 2 | 3;
export type TierKey = "tier1" | "tier2" | "tier3";
export type TierValue = "" | TierKey;

export interface TierOption {
  readonly value: TierValue;
  readonly label: string;
  readonly fullLabel: string;
  readonly color: string;
}

/* ===========================================================================
   📝 EVIDENCE & ASSESSMENT TYPES
=========================================================================== */

export interface Evidence {
  readonly learnerId: UUID;
  readonly learnerName: string;
  readonly phase: Phase;
  readonly competencyId: CompetencyId;
  readonly competencyName: string;
  readonly tierLevel: TierLevel;
  readonly text: string;
  readonly updatedAt: string;
}

/**
 * Map of competency → tier selection for a single learner
 */
export type AssessmentMap = Record<CompetencyId, TierValue>;

/**
 * Map of competency → free-text evidence for a single learner
 */
export type EvidenceTextMap = Record<CompetencyId, string>;

/**
 * Structure representing an assessment submission payload
 */
export interface AssessmentPayload {
  readonly learner_id: UUID;
  readonly fellow_id: UUID;
  readonly phase: Phase;
  readonly assessments: AssessmentMap;
  readonly evidence: EvidenceTextMap;
  readonly created_at?: string;
}

/* ===========================================================================
   📊 STATS & SUMMARY TYPES
=========================================================================== */

export interface CompletionStats {
  readonly totalLearners: number;
  readonly completedLearners: number;
  readonly missingEvidence: number;
  readonly completionPercentage: number;
  readonly readyToSubmit: boolean;
}

export interface LearnerSummary {
  readonly learner: Learner;
  readonly allTiersSet: boolean;
  readonly allEvidencePresent: boolean;
  readonly missingEvidence: readonly CompetencyId[];
  readonly unsetTiers: readonly CompetencyId[];
}

export interface SubmissionGap {
  readonly learner: Learner;
  readonly type: "missingEvidence" | "unsetTier";
  readonly comp: CompetencyId;
}

export interface SubmissionSummaryData {
  readonly learnerSummaries: readonly LearnerSummary[];
  readonly gaps: readonly SubmissionGap[];
  readonly readyToSubmit: boolean;
  readonly payload: readonly AssessmentPayload[];
}

/* ===========================================================================
   🧭 WIZARD TYPES
=========================================================================== */

export type StepKey = "intro" | "select" | "learners" | "assess" | "summary";

export interface StepConfig {
  readonly stepNumber: number;
  readonly title: string;
  readonly description: string;
  readonly primaryButton: string;
  readonly showBackButton: boolean;
  readonly isSubmitStep: boolean;
  readonly icon: ComponentType<{ className?: string }>;
  readonly meta: {
    readonly label: string;
    readonly desc: string;
    readonly shortLabel: string;
  };
}

export interface StepInfo {
  readonly config: StepConfig;
  readonly isFirst: boolean;
  readonly isLast: boolean;
}

export interface NavigationState {
  readonly canGoBack: boolean;
  readonly canGoNext: boolean;
  readonly canSubmit: boolean;
  readonly nextLabel: string;
  readonly statusMessage: string;
}

export interface UseWizardOptions<Step extends string> {
  readonly steps: readonly Step[];
  readonly initialStep?: Step;
  readonly onStepChange?: (from: Step, to: Step) => void;
}

export interface UseWizardReturn<Step extends string> {
  readonly currentStep: Step;
  readonly stepIndex: number;
  readonly totalSteps: number;
  readonly goToStep: (step: Step) => void;
  readonly goToNext: () => void;
  readonly goToPrevious: () => void;
  readonly reset: () => void;
  readonly getStep: (index: number) => Step | undefined;
  readonly getStepIndex: (step: Step) => number;
  readonly hasStep: (step: Step) => boolean;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly progress: number;
  readonly canGoToStep: (step: Step) => boolean;
  readonly canGoNext: boolean;
  readonly canGoPrevious: boolean;
  readonly accessibleSteps: readonly Step[];
}
