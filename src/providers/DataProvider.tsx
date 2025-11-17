'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';

import { Fellow, Learner, Coach } from '@/types/people';
import { derivePhaseFromGrade } from '@/utils/mappers';

interface DataContextType {
  /* ──────────────────────
      Fellow (mobile app)
     ────────────────────── */
  fellowData: Fellow | null;
  loading: boolean;
  error: string | null;

  setFellowData: (data: Fellow) => void;
  logout: () => void;
  refreshLearnerStatus: () => Promise<void>;

  /* ──────────────────────
      Admin Data
     ────────────────────── */
  coaches: Coach[];
  fellows: Fellow[];
  learners: Learner[];

  selectedCoach: Coach | null;
  selectedFellow: Fellow | null;

  fetchAllCoaches: () => Promise<void>;
  fetchFellowsForCoach: (coachId: string) => Promise<void>;
  fetchLearnersForFellow: (fellowId: string) => Promise<void>;

  setSelectedCoach: (c: Coach | null) => void;
  setSelectedFellow: (f: Fellow | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();

  /* ───────────────────────────────────────────────
      Fellow (existing app logic)
  ─────────────────────────────────────────────── */
  const [fellowData, setFellowDataState] = useState<Fellow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshLearnerStatus = async () => {
    if (!fellowData) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch learners
      const { data: learnersData } = await supabase
        .from('ll_tool_learners')
        .select('*')
        .eq('fellow_id', fellowData.fellowId);

      // Fetch assessments
      const { data: assessmentsData } = await supabase
        .from('ll_tool_assessments')
        .select('*')
        .eq('fellow_id', fellowData.fellowId);

      const updatedLearners = (learnersData || []).map((l) => {
        const a = (assessmentsData || []).find((as) => as.learner_id === l.id);
        return {
          learnerId: l.id,
          learnerName: l.learner_name,
          assessmentCompleted: !!a,
          assessmentId: a?.id,
          dateCreated: a?.date_created,
          dateModified: a?.date_modified,
        };
      });

      setFellowDataState({
        ...fellowData,
        learners: updatedLearners,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to refresh learner data');
      setLoading(false);
    }
  };

  const setFellowData = (data: Fellow) => {
    if (!data.phase && data.grade) {
      data.phase = derivePhaseFromGrade(data.grade);
    }
    setFellowDataState(data);
    setError(null);
  };

  const logout = () => {
    setFellowDataState(null);
    setError(null);
    localStorage.removeItem('fellowSession');
  };

  /* ───────────────────────────────────────────────
      Admin Data Layer
  ─────────────────────────────────────────────── */

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [fellows, setFellows] = useState<Fellow[]>([]);
  const [learners, setLearners] = useState<Learner[]>([]);

  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedFellow, setSelectedFellow] = useState<Fellow | null>(null);

  /* ---------------------
      Fetch all coaches
     --------------------- */
  const fetchAllCoaches = async () => {
    const { data, error } = await supabase.from('ll_tool_coaches').select('*').order('coach_name');

    if (!error) setCoaches(data || []);
  };

  /* ---------------------
      Fetch fellows for coach
     --------------------- */
  const fetchFellowsForCoach = async (coachId: string) => {
    const { data, error } = await supabase
      .from('ll_tool_fellows')
      .select('*, ll_tool_coaches!ll_tool_fellows_coach_id_fkey(coach_name)')
      .eq('coach_id', coachId)
      .order('fellow_name');

    if (!error) {
      setFellows(
        (data || []).map((f: any) => ({
          ...f,
          coach_name: f.ll_tool_coaches?.coach_name,
        })),
      );
    }
  };

  /* ---------------------
      Fetch learners for fellow
     --------------------- */
  const fetchLearnersForFellow = async (fellowId: string) => {
    const { data, error } = await supabase
      .from('ll_tool_learners')
      .select('*')
      .eq('fellow_id', fellowId)
      .order('learner_name');

    if (!error) setLearners(data || []);
  };

  /* ───────────────────────────────────────────────
      On load (admin)
  ─────────────────────────────────────────────── */
  useEffect(() => {
    fetchAllCoaches();
  }, []);

  const value: DataContextType = {
    /* App */
    fellowData,
    loading,
    error,
    setFellowData,
    logout,
    refreshLearnerStatus,

    /* Admin */
    coaches,
    fellows,
    learners,

    selectedCoach,
    selectedFellow,

    fetchAllCoaches,
    fetchFellowsForCoach,
    fetchLearnersForFellow,

    setSelectedCoach,
    setSelectedFellow,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
