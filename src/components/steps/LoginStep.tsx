'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useData } from '@/providers/DataProvider';
import { useAssessment } from '@/providers/AssessmentProvider';
import { Grade } from '@/types/core.types';
import { derivePhaseFromGrade } from '@/utils/mappers';
import { Learner } from '@/types/people';
import GradeSelectionModal from '../modals/GradeSelectionModal';

// ============================================================================
// TYPES
// ============================================================================

interface DbLearner {
  id: string;
  learner_name: string;
}

interface DbAssessment {
  id: string;
  learner_id: string;
  learner_name: string;
  date_created: string;
  date_modified: string | null;
}

interface DbFellow {
  id: string;
  fellow_name: string;
  coach_id: string;
  email: string;
  grade: string | null;
}

interface DbCoach {
  id: string;
  coach_name: string;
  email: string;
}

interface PendingData {
  fellowData: DbFellow;
  learnersData: DbLearner[];
  assessmentsData: DbAssessment[];
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function LoginStep() {
  const supabase = createClient();
  const { setFellowData } = useData();
  const { goToStep } = useAssessment();

  // State
  const [coaches, setCoaches] = useState<DbCoach[]>([]);
  const [fellows, setFellows] = useState<string[]>([]);
  const [coachId, setCoachId] = useState('');
  const [fellowname, setFellowname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [pendingFellowData, setPendingFellowData] = useState<PendingData | null>(null);

  // ========================================================================
  // LOAD COACHES (from ll_tool_coaches)
  // ========================================================================
  useEffect(() => {
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from('ll_tool_coaches')
        .select('id, coach_name, email')
        .order('coach_name', { ascending: true });

      if (!active) return;
      if (error) {
        console.error('Failed to load coaches:', error);
        setError('Failed to load coaches. Please refresh.');
      } else {
        setCoaches(data || []);
      }
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  // ========================================================================
  // LOAD FELLOWS WHEN COACH SELECTED
  // ========================================================================
  useEffect(() => {
    let active = true;
    if (!coachId) {
      setFellows([]);
      setFellowname('');
      return;
    }

    (async () => {
      const { data, error } = await supabase
        .from('ll_tool_fellows')
        .select('fellow_name')
        .eq('coach_id', coachId)
        .order('fellow_name', { ascending: true });

      if (!active) return;
      if (error) {
        console.error('Failed to load fellows:', error);
        setError('Failed to load fellows. Please try again.');
      } else {
        setFellows((data || []).map((d) => d.fellow_name));
      }
    })();

    return () => {
      active = false;
    };
  }, [coachId, supabase]);

  // ========================================================================
  // LOGIN HANDLER
  // ========================================================================
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: fellowData, error: fellowError } = await supabase
        .from('ll_tool_fellows')
        .select('id, fellow_name, coach_id, email, grade')
        .eq('coach_id', coachId)
        .eq('fellow_name', fellowname)
        .eq('email', email)
        .single();

      if (fellowError || !fellowData) {
        setError('Invalid credentials. Please check your information.');
        setLoading(false);
        return;
      }

      // Fetch learners
      const { data: learnersData, error: learnersError } = await supabase
        .from('ll_tool_learners')
        .select('id, learner_name')
        .eq('fellow_id', fellowData.id);

      if (learnersError) throw learnersError;

      // Fetch assessments
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('ll_tool_assessments')
        .select('id, learner_id, learner_name, date_created, date_modified')
        .eq('fellow_id', fellowData.id);

      if (assessmentsError) throw assessmentsError;

      const grade = fellowData.grade as Grade | null;

      if (!grade) {
        // Grade missing → show modal
        setPendingFellowData({
          fellowData,
          learnersData: learnersData || [],
          assessmentsData: assessmentsData || [],
        });
        setShowGradeModal(true);
        setLoading(false);
        return;
      }

      // Grade exists → continue login
      completeLogin(fellowData, learnersData || [], assessmentsData || [], grade);

      // Save login info to localStorage
      localStorage.setItem('fellowLogin', JSON.stringify({ coachId, fellowname, email }));
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // COMPLETE LOGIN
  // ========================================================================
  const completeLogin = (
    fellowData: DbFellow,
    learnersData: DbLearner[],
    assessmentsData: DbAssessment[],
    grade: Grade,
  ) => {
    const phase = derivePhaseFromGrade(grade);
    const coach = coaches.find((c) => c.id === fellowData.coach_id);

    const learnersWithStatus: Learner[] = learnersData.map((learner) => {
      const assessment = assessmentsData.find((a) => a.learner_id === learner.id);
      return {
        learnerId: learner.id,
        learnerName: learner.learner_name,
        assessmentCompleted: !!assessment,
        assessmentId: assessment?.id,
        dateCreated: assessment?.date_created,
        dateModified: assessment?.date_modified || undefined,
      };
    });

    setFellowData({
      fellowId: fellowData.id,
      fellowName: fellowData.fellow_name,
      coachName: coach ? coach.coach_name : 'Unknown Coach',
      email: fellowData.email,
      grade,
      phase,
      learners: learnersWithStatus,
    });

    goToStep('intro');
  };

  // ========================================================================
  // AUTO-LOGIN IF PREVIOUSLY SAVED
  // ========================================================================
  useEffect(() => {
    const saved = localStorage.getItem('fellowLogin');
    if (saved) {
      const { coachId, fellowname, email } = JSON.parse(saved);
      setCoachId(coachId);
      setFellowname(fellowname);
      setEmail(email);
    }
  }, []);

  // ========================================================================
  // COMPLETE LOGIN WITH GRADE MODAL SELECTION
  // ========================================================================
  const completeLoginWithGrade = (grade: Grade) => {
    if (!pendingFellowData) return;
    const { fellowData, learnersData, assessmentsData } = pendingFellowData;

    completeLogin(fellowData, learnersData, assessmentsData, grade);
    setPendingFellowData(null);
    setShowGradeModal(false);
  };

  // ========================================================================
  // UI
  // ========================================================================
  return (
    <>
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Fellow Login</h1>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Coach select */}
          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-700">Coach Name</label>
            <select
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a coach</option>
              {coaches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.coach_name}
                </option>
              ))}
            </select>
          </div>

          {/* Fellow select */}
          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-700">Fellow Name</label>
            <select
              value={fellowname}
              onChange={(e) => setFellowname(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={!coachId}
              required
            >
              <option value="">{coachId ? 'Select a fellow' : 'Select a coach first'}</option>
              {fellows.map((f, i) => (
                <option key={i} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Email input */}
          <div className="mb-6">
            <label className="mb-2 block font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !coachId || !fellowname || !email}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Grade Selection Modal */}
      <GradeSelectionModal
        open={showGradeModal}
        onClose={() => {
          setShowGradeModal(false);
          setPendingFellowData(null);
          setLoading(false);
        }}
        onSelectGrade={completeLoginWithGrade}
        fellowId={pendingFellowData?.fellowData.id || ''}
      />
    </>
  );
}
