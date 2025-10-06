// types/learner.ts
// types/learner.ts
// types/fellow.ts
export interface Fellow {
  id: string;
  name: string;
  coachName: string;
  schoolName: string;
  schoolLevel: string;
}

// types/learner.ts
export interface Learner {
  id: string;
  name: string;
  grade: string;
  phase: "foundation" | "intermediate" | "senior" | "fet";
  fellowId: string; // relation
}

export interface Assessment {
  learnerId: string | number;
  phase: "foundation" | "intermediate" | "senior" | "fet";
  scores: {
    [competencyId: string]: "tier1" | "tier2" | "tier3" | ""; // empty = not yet selected
  };
  assessedAt?: Date; // timestamp for the whole assessment session
  assessedBy?: string; // who conducted the assessment
}
export type AssessmentData = Record<string, string>;
