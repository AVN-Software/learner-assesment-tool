// -------------------------------
// TEMPACCOUNTS (fellows)
// -------------------------------
export type TempAccount = {
  id: string;
  fellowname: string;
  email: string;
  coachname: string | null;
  yearoffellowship: number | null;
  grade?: string;
  phase?: string;
  onboarding_complete: boolean;
  onboarding_term: number | null;
};
// -------------------------------
// FELLOW_CLASSROOMS
// -------------------------------
export interface FellowClassroom {
  id: string;
  fellow_id: string; // FK → tempaccounts.id
  name: string; // e.g. "Grade 8B"
  grade: string; // e.g. "Grade 8"
  phase?: string | null; // auto-derived
  numlearners?: number | null; // total learners in the class
  created_at?: string | null;
  is_complete?: boolean | null;
}

// -------------------------------
// CLASSROOM_SUBJECTS (open text per classroom)
// -------------------------------
export interface ClassroomSubject {
  id: string;
  classroom_id: string; // FK → fellow_classrooms.id
  subject: string; // open text (e.g. "Mathematics")
  created_at?: string | null;
}

// -------------------------------
// COMPETENCY_ASSESSMENTS
// -------------------------------
export interface CompetencyAssessment {
  id: string;
  competency_name: string; // e.g. "Motivation", "Teamwork"
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  evidence: string;
  created_at?: string | null;
}

// -------------------------------
// LEARNER_TOOL_ASSESSMENTS
// -------------------------------
export interface LearnerToolAssessment {
  id: string;
  fellow_id: string; // FK → tempaccounts.id
  learner_id: string; // FK → learners.id
  term: "Term 1" | "Term 2" | "Term 3" | "Term 4";
  grade: string;
  phase: string;

  // Competency foreign keys
  motivation_id: string; // FK → competency_assessments.id
  teamwork_id: string;
  analytical_id: string;
  curiosity_id: string;
  leadership_id: string;

  submitted_at?: string | null;
}

// -------------------------------
// LEARNERS
// -------------------------------
export interface Learner {
  id: string;
  fellow_id: string; // FK → tempaccounts.id
  classroom_id: string; // FK → fellow_classrooms.id
  learner_name: string;
  created_at?: string | null;

  // ---- Term completion flags ----
  term1_complete?: boolean | null;
  term2_complete?: boolean | null;
  term3_complete?: boolean | null;
  term4_complete?: boolean | null;

  // ---- Linked term assessment IDs ----
  term1_assessment_id?: string | null; // FK → learner_tool_assessments.id
  term2_assessment_id?: string | null;
  term3_assessment_id?: string | null;
  term4_assessment_id?: string | null;
}

// -------------------------------
// RELATIONSHIP HELPERS
// -------------------------------
export interface LearnerToolAssessmentWithCompetencies
  extends LearnerToolAssessment {
  motivation?: CompetencyAssessment;
  teamwork?: CompetencyAssessment;
  analytical?: CompetencyAssessment;
  curiosity?: CompetencyAssessment;
  leadership?: CompetencyAssessment;
}

export interface LearnerWithTermAssessments extends Learner {
  term1_assessment?: LearnerToolAssessmentWithCompetencies | null;
  term2_assessment?: LearnerToolAssessmentWithCompetencies | null;
  term3_assessment?: LearnerToolAssessmentWithCompetencies | null;
  term4_assessment?: LearnerToolAssessmentWithCompetencies | null;
}

export interface ClassroomWithSubjectsAndLearners extends FellowClassroom {
  subjects?: ClassroomSubject[];
  learners?: LearnerWithTermAssessments[];
}

export interface FellowWithClassrooms extends TempAccount {
  classrooms?: ClassroomWithSubjectsAndLearners[];
}
