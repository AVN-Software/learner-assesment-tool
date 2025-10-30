import { Grade, Phase } from './core';

export interface Learner {
  learnerId: string;
  learnerName: string;
  assessmentCompleted: boolean;
  assessmentId?: string;
  dateCreated?: string;
  dateModified?: string;
}

// ============================================================================
// COACH
// ============================================================================

export interface Coach {
  coachId: string;
  coachName: string;
  email: string;
}

// ============================================================================
// FELLOW
// ============================================================================

export interface Fellow {
  fellowId: string;
  fellowName: string;
  coachName: string;
  email: string;
  grade: Grade;
  phase: Phase;
  learners: Learner[];
}
