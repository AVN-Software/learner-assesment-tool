'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Fellow, Learner, Coach } from '@/types/people';
import { derivePhaseFromGrade } from '@/utils/mappers';

// Context Type
interface DataContextType {
  fellowData: Fellow | null;
  loading: boolean;
  error: string | null;
  setFellowData: (data: Fellow) => void;
  logout: () => void;
  refreshLearnerStatus: () => Promise<void>;
}

// Context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Provider Component
interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const supabase = createClient();

  const [fellowData, setFellowDataState] = useState<Fellow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh learner completion status (called after submission)
  const refreshLearnerStatus = async () => {
    if (!fellowData) return;

    try {
      setLoading(true);
      setError(null);

      // ===============================
      // 1️⃣ Fetch Learners
      // ===============================
      const { data: learnersData, error: learnersError } = await supabase
        .from('ll_tool_learners')
        .select('id, learner_name')
        .eq('fellow_id', fellowData.fellowId);

      if (learnersError) throw learnersError;

      // ===============================
      // 2️⃣ Fetch Assessments
      // ===============================
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('ll_tool_assessments')
        .select('id, learner_id, learner_name, date_created, date_modified')
        .eq('fellow_id', fellowData.fellowId);

      if (assessmentsError) throw assessmentsError;

      // ===============================
      // 3️⃣ Fetch Coaches
      // ===============================
      const { data: coachesData, error: coachesError } = await supabase
        .from('ll_tool_coaches')
        .select('id, coach_name, email');

      if (coachesError) throw coachesError;

      // Try to find the coach linked to this fellow
      const coach = (coachesData || []).find(
        (c) => c.coach_name === fellowData.coachName || c.id === fellowData.fellowId, // adjust this condition if you have a proper coach_id field
      );

      // ===============================
      // 4️⃣ Merge learner data with completion status
      // ===============================
      const updatedLearners: Learner[] = (learnersData || []).map((learner) => {
        const assessment = (assessmentsData || []).find((a) => a.learner_id === learner.id);

        return {
          learnerId: learner.id,
          learnerName: learner.learner_name,
          assessmentCompleted: !!assessment,
          assessmentId: assessment?.id,
          dateCreated: assessment?.date_created,
          dateModified: assessment?.date_modified,
        };
      });

      // ===============================
      // 5️⃣ Update fellow data with refreshed learners + coach
      // ===============================
      setFellowDataState({
        ...fellowData,
        learners: updatedLearners,
        coachName: coach ? coach.coach_name : fellowData.coachName,
      });

      setLoading(false);
    } catch (err) {
      console.error('Error refreshing learner status:', err);
      setError('Failed to refresh learner data');
      setLoading(false);
    }
  };

  // Set fellow data (called from login)
  const setFellowData = (data: Fellow) => {
    // Auto-derive phase if not provided
    if (!data.phase && data.grade) {
      data.phase = derivePhaseFromGrade(data.grade);
    }

    setFellowDataState(data);
    setError(null);
  };

  // Logout function
  const logout = () => {
    setFellowDataState(null);
    setError(null);
    localStorage.removeItem('fellowSession');
  };

  // Clear session on mount (no persistence)
  useEffect(() => {
    localStorage.removeItem('fellowSession');
    setFellowDataState(null);
    setLoading(false);
  }, []);

  const value: DataContextType = {
    fellowData,
    loading,
    error,
    setFellowData,
    logout,
    refreshLearnerStatus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
