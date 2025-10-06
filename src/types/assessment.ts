// types/assessment.ts

// Per-learner assessment inside a session
export interface LearnerAssessment {
  learnerName: string;
  grade: string;
  phase: "foundation" | "intermediate" | "senior" | "fet";
  scores: {
    [competencyId: string]: "tier1" | "tier2" | "tier3" | "";
  };
}

// Parent session wrapping multiple learners
export interface AssessmentSession {
  sessionId: string; // unique string ID for the session
  coachName: string; // coach doing the observation
  fellowName: string; // teacher being observed
  term: "Term 1" | "Term 2" | "Term 3" | "Term 4";
  startTime: string; // ISO string: when session started
  endTime?: string; // ISO string: when session ended
  submittedAt?: string; // ISO string: when final submission happened
  numberLearnersAssessed: number;
  assessments: LearnerAssessment[];
}
