import { createClient } from '@/utils/supabase/client';

/* ────────────────────────────────
   COACH
──────────────────────────────── */
export interface Coach {
  id: string;
  coach_name: string;
  email: string;
  created_at?: string;
}

export interface CoachInsertPayload {
  coach_name: string;
  email: string;
}

export interface CoachUpdatePayload {
  coach_name?: string;
  email?: string;
}

/* ────────────────────────────────
   FELLOW
──────────────────────────────── */
export interface Fellow {
  id: string;
  fellow_name: string;
  email: string;
  grade: string | null;
  coach_id: string;
  coach_name?: string;
  created_at?: string;
}

export interface FellowInsertPayload {
  fellow_name: string;
  email: string;
  grade: string | null;
  coach_id: string;
}

export interface FellowUpdatePayload {
  fellow_name?: string;
  email?: string;
  grade?: string | null;
}

/* ────────────────────────────────
   LEARNER
   (UPDATED WITH NEW COLUMNS)
──────────────────────────────── */
export interface Learner {
  id: string;
  learner_name: string;
  fellow_id: string;
  created_at?: string;

  // NEW FIELDS
  latest_assessment_id: string | null;
  assessment_status: 'completed' | 'incomplete';
  assessment_date: string | null;
}

export interface LearnerInsertPayload {
  learner_name: string;
  fellow_id: string;

  // These are optional on insert (default handled in DB)
  latest_assessment_id?: string | null;
  assessment_status?: 'completed' | 'incomplete';
  assessment_date?: string | null;
}

export interface LearnerUpdatePayload {
  learner_name?: string;

  // Allow updating new fields
  latest_assessment_id?: string | null;
  assessment_status?: 'completed' | 'incomplete';
  assessment_date?: string | null;
}

/* ────────────────────────────────
   LEARNER ASSESSMENT TYPE
   Matches ll_tool_assessments EXACTLY
──────────────────────────────── */
export interface LearnerAssessment {
  id: string;
  fellow_id: string | null;
  learner_id: string | null;
  fellow_name: string | null;
  learner_name: string | null;
  grade: string | null;
  phase: string | null;

  date_created: string | null;
  date_modified: string | null;

  motivation_tier: number | null;
  motivation_evidence: string | null;

  teamwork_tier: number | null;
  teamwork_evidence: string | null;

  analytical_tier: number | null;
  analytical_evidence: string | null;

  curiosity_tier: number | null;
  curiosity_evidence: string | null;

  leadership_tier: number | null;
  leadership_evidence: string | null;

  created_at: string | null;
}

/* ────────────────────────────────
   MODAL TYPES
──────────────────────────────── */
export type ModalType =
  | { type: 'add-coach' }
  | { type: 'edit-coach'; coach: Coach }
  | { type: 'add-fellow'; coachId: string }
  | { type: 'edit-fellow'; fellow: Fellow }
  | { type: 'add-learner'; fellowId: string }
  | { type: 'edit-learner'; learner: Learner }
  | null;
