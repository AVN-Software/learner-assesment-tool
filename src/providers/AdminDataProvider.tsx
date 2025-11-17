'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';

import {
  Coach,
  CoachInsertPayload,
  CoachUpdatePayload,
  Fellow,
  FellowInsertPayload,
  FellowUpdatePayload,
  Learner,
  LearnerInsertPayload,
  LearnerUpdatePayload,
  ModalType,
  LearnerAssessment,
} from '../app/admin/types';

import { ModalManager } from '../app/admin/_components/modals/ModalManager';

export interface AdminDataContextType {
  coaches: Coach[];
  fellows: Fellow[];
  learners: Learner[];

  selectedCoach: Coach | null;
  selectedFellow: Fellow | null;

  latestAssessment: LearnerAssessment | null;

  loading: boolean;
  error: string | null;

  setModal: (modal: ModalType) => void;

  fetchCoaches: () => Promise<void>;
  fetchFellows: (coachId: string) => Promise<void>;
  fetchLearners: (fellowId: string) => Promise<void>;
  fetchAssessment: (learnerId: string) => Promise<void>;

  selectCoach: (coach: Coach) => void;
  selectFellow: (fellow: Fellow) => void;

  createCoach: (data: CoachInsertPayload) => Promise<void>;
  updateCoach: (id: string, data: CoachUpdatePayload) => Promise<void>;
  deleteCoach: (id: string) => Promise<void>;

  createFellow: (data: FellowInsertPayload) => Promise<void>;
  updateFellow: (id: string, data: FellowUpdatePayload) => Promise<void>;
  deleteFellow: (id: string) => Promise<void>;

  createLearner: (data: LearnerInsertPayload) => Promise<void>;
  updateLearner: (id: string, data: LearnerUpdatePayload) => Promise<void>;
  deleteLearner: (id: string) => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used inside AdminDataProvider');
  return ctx;
};

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [fellows, setFellows] = useState<Fellow[]>([]);
  const [learners, setLearners] = useState<Learner[]>([]);

  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedFellow, setSelectedFellow] = useState<Fellow | null>(null);

  const [latestAssessment, setLatestAssessment] = useState<LearnerAssessment | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<ModalType>(null);

  /* ---------------- FETCH COACHES ---------------- */
  const fetchCoaches = async () => {
    setLoading(true);

    const { data, error } = await supabase.from('ll_tool_coaches').select('*').order('coach_name');

    if (error) setError(error.message);
    else setCoaches(data || []);

    setLoading(false);
  };

  /* ---------------- FETCH FELLOWS ---------------- */
  const fetchFellows = async (coachId: string) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('ll_tool_fellows')
      .select('*')
      .eq('coach_id', coachId)
      .order('fellow_name');

    if (error) setError(error.message);
    else setFellows(data || []);

    setLoading(false);
  };

  /* ---------------- FETCH LEARNERS (typed) ---------------- */
  const fetchLearners = async (fellowId: string) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('ll_tool_learners')
      .select(
        `
        id,
        learner_name,
        fellow_id,
        created_at,
        latest_assessment_id,
        assessment_status,
        assessment_date
      `,
      )
      .eq('fellow_id', fellowId)
      .order('learner_name');

    if (error) setError(error.message);
    else setLearners(data || []);

    setLoading(false);
  };

  /* ---------------- FETCH LATEST ASSESSMENT ---------------- */
  const fetchAssessment = async (learnerId: string) => {
    // ❗ NO global loading here — avoid UI freeze
    const { data, error } = await supabase
      .from('ll_tool_assessments')
      .select('*')
      .eq('learner_id', learnerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single<LearnerAssessment>();

    if (error) {
      setError(error.message);
      setLatestAssessment(null);
    } else {
      setLatestAssessment(data);
    }
  };

  /* ---------------- SELECT COACH ---------------- */
  const selectCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setSelectedFellow(null);
    setFellows([]);
    setLearners([]);
    setLatestAssessment(null);

    fetchFellows(coach.id);
  };

  /* ---------------- SELECT FELLOW ---------------- */
  const selectFellow = (fellow: Fellow) => {
    setSelectedFellow(fellow);
    setLearners([]);
    setLatestAssessment(null);

    fetchLearners(fellow.id);
  };

  /* ---------------- CRUD: COACH ---------------- */
  const createCoach = async (payload: CoachInsertPayload) => {
    setLoading(true);
    await supabase.from('ll_tool_coaches').insert(payload);
    await fetchCoaches();
    setLoading(false);
  };

  const updateCoach = async (id: string, payload: CoachUpdatePayload) => {
    setLoading(true);
    await supabase.from('ll_tool_coaches').update(payload).eq('id', id);
    await fetchCoaches();
    setLoading(false);
  };

  const deleteCoach = async (id: string) => {
    setLoading(true);
    await supabase.from('ll_tool_coaches').delete().eq('id', id);
    await fetchCoaches();
    setLoading(false);
  };

  /* ---------------- CRUD: FELLOW ---------------- */
  const createFellow = async (payload: FellowInsertPayload) => {
    setLoading(true);
    await supabase.from('ll_tool_fellows').insert(payload);
    if (selectedCoach) await fetchFellows(selectedCoach.id);
    setLoading(false);
  };

  const updateFellow = async (id: string, payload: FellowUpdatePayload) => {
    setLoading(true);
    await supabase.from('ll_tool_fellows').update(payload).eq('id', id);
    if (selectedCoach) await fetchFellows(selectedCoach.id);
    setLoading(false);
  };

  const deleteFellow = async (id: string) => {
    setLoading(true);
    await supabase.from('ll_tool_fellows').delete().eq('id', id);
    if (selectedCoach) await fetchFellows(selectedCoach.id);
    setLoading(false);
  };

  /* ---------------- CRUD: LEARNER ---------------- */
  const createLearner = async (payload: LearnerInsertPayload) => {
    setLoading(true);
    await supabase.from('ll_tool_learners').insert(payload);
    if (selectedFellow) await fetchLearners(selectedFellow.id);
    setLoading(false);
  };

  const updateLearner = async (id: string, payload: LearnerUpdatePayload) => {
    setLoading(true);
    await supabase.from('ll_tool_learners').update(payload).eq('id', id);
    if (selectedFellow) await fetchLearners(selectedFellow.id);
    setLoading(false);
  };

  const deleteLearner = async (id: string) => {
    setLoading(true);
    await supabase.from('ll_tool_learners').delete().eq('id', id);
    if (selectedFellow) await fetchLearners(selectedFellow.id);
    setLoading(false);
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        coaches,
        fellows,
        learners,

        selectedCoach,
        selectedFellow,

        latestAssessment,

        loading,
        error,
        setModal,

        fetchCoaches,
        fetchFellows,
        fetchLearners,
        fetchAssessment,

        selectCoach,
        selectFellow,

        createCoach,
        updateCoach,
        deleteCoach,

        createFellow,
        updateFellow,
        deleteFellow,

        createLearner,
        updateLearner,
        deleteLearner,
      }}
    >
      {children}
      <ModalManager modal={modal} setModal={setModal} />
    </AdminDataContext.Provider>
  );
}
