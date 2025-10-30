import { createClient } from '@/utils/supabase/client';

export interface Coach {
  id: string;
  coach_name: string;
  email: string;
  created_at?: string;
}

export interface Fellow {
  id: string;
  fellow_name: string;
  email: string;
  grade: string | null;
  coach_id: string;
  coach_name?: string;
  created_at?: string;
}

export interface Learner {
  id: string;
  learner_name: string;
  fellow_id: string;
  created_at?: string;
}

export type ModalType =
  | { type: 'add-coach' }
  | { type: 'edit-coach'; coach: Coach }
  | { type: 'add-fellow'; coachId: string }
  | { type: 'edit-fellow'; fellow: Fellow }
  | { type: 'add-learner'; fellowId: string }
  | { type: 'edit-learner'; learner: Learner }
  | null;
