// learner-tool-types.ts

/* ---------------------------------------------------------------------------
   Core Entities
--------------------------------------------------------------------------- */

export interface Fellow {
  id: string;
  name: string;
  email: string;
  classroom: Classroom;
  learnerToolOnboarding: LearnerToolOnboarding | null;
}

export interface Classroom {
  id: string;
  fellowId: string;
  gradeLevel: string; // e.g. "Grade 4"
  phase: string; // e.g. "Intermediate Phase"
  subject: string; // e.g. "Mathematics"
  classSize: number;
  academicYear: string; // e.g. "2025"
  learners: Learner[];
}

/* ---------------------------------------------------------------------------
   Learners and Assessments
--------------------------------------------------------------------------- */

export interface Learner {
  id: string;
  classroomId: string;
  fellowId: string;
  name: string;
  assessments: {
    term1: string;
    term2: string;
    term3: string;
    term4: string;
  };
}

export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

export interface CompetencyEvaluation {
  tier: 1 | 2 | 3 | null;
  evidence: string | null;
}

export interface Assessment {
  id: string;
  learnerId: string;
  fellowId: string;
  term: "Term 1" | "Term 2" | "Term 3" | "Term 4";
  competencies: Record<CompetencyId, CompetencyEvaluation>;
  status: "incomplete" | "complete" | "Not Relevant – Onboarded Term 4";
  completedAt?: string;
}

/* ---------------------------------------------------------------------------
   Onboarding & Tool State
--------------------------------------------------------------------------- */

export interface LearnerToolOnboarding {
  id: string;
  fellowId: string;
  classroomDefined: boolean;
  learnersChosen: boolean;
  termOnboarded: "Term 1" | "Term 2" | "Term 3" | "Term 4";
  createdAt: string;
}

/**
 * Global admin-level state that defines the current running configuration
 * of the Learner Tool for all fellows.
 */
export interface LearnerToolState {
  id: string;
  currentTerm: "Term 1" | "Term 2" | "Term 3" | "Term 4";
  academicYear: string;
  termCutoffDate?: string;
}

/**
 * Admin-only configuration record controlling the tool rollout and behaviour.
 * - currentTerm: the active term
 * - state: rollout mode ("pilot" or "live")
 * - academicYear: ensures context stays tied to a year
 * - termCutoffDate: deadline for current term’s assessments
 * - allowOnboarding: toggle onboarding availability
 * - version: config version or schema tag
 * - updatedAt: last modified timestamp
 */
export interface LearnerToolSettings {
  id: string;
  currentTerm: "Term 1" | "Term 2" | "Term 3" | "Term 4";
  state: "pilot" | "live";
  academicYear: string;
  termCutoffDate?: string;
  allowOnboarding: boolean;
  version: string;
  updatedAt: string;
}
