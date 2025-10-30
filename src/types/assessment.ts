// ============================================================================
// ASSESSMENT TYPES
// ============================================================================

// ============================================================================
// COMPETENCY TYPES
// ============================================================================
export type Step = "login" | "intro" | "selection" | "assessment" | "review";
export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

export type TierScore = 1 | 2 | 3;

export interface CompetencyDraft {
  tierScore: TierScore | null;
  evidence: string;
}

// ============================================================================
// ASSESSMENT DRAFT
// ============================================================================

export interface AssessmentDraft {
  learnerId: string;
  learnerName: string;
  motivation: CompetencyDraft;
  teamwork: CompetencyDraft;
  analytical: CompetencyDraft;
  curiosity: CompetencyDraft;
  leadership: CompetencyDraft;
}

// ============================================================================
// ASSESSMENT MODE
// ============================================================================

export type AssessmentMode =
  | { type: "new"; learnerIds: string[] }
  | { type: "edit"; learnerId: string; assessmentId: string }
  | null;

// ============================================================================
// COMPLETION STATS
// ============================================================================

export interface CompletionStats {
  totalLearners: number;
  completedLearners: number;
  completionPercentage: number;
  totalCells: number;
  completedCells: number;
  missingEvidence: number;
}
