'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Trash2,
  Search,
  Mail,
  UserCog,
  Loader2,
  Edit2,
  X,
  Save,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

/* ---------------------------------------------------------------------------
   Types from Database Schema
--------------------------------------------------------------------------- */

interface Coach {
  id: string;
  coach_name: string;
  email: string;
  created_at?: string;
}

interface Fellow {
  id: string;
  fellow_name: string;
  email: string;
  grade: string | null;
  coach_id: string;
  coach_name?: string;
  created_at?: string;
}

interface Learner {
  id: string;
  learner_name: string;
  fellow_id: string;
  created_at?: string;
}

/* ---------------------------------------------------------------------------
   Modal Types
--------------------------------------------------------------------------- */

type ModalType =
  | { type: 'add-coach' }
  | { type: 'edit-coach'; coach: Coach }
  | { type: 'add-fellow'; coachId: string }
  | { type: 'edit-fellow'; fellow: Fellow }
  | { type: 'add-learner'; fellowId: string }
  | { type: 'edit-learner'; learner: Learner }
  | null;

/* ---------------------------------------------------------------------------
   Main Component
--------------------------------------------------------------------------- */

export default function AdminPanel() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [fellows, setFellows] = useState<Fellow[]>([]);
  const [learners, setLearners] = useState<Learner[]>([]);

  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedFellow, setSelectedFellow] = useState<Fellow | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<ModalType>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const supabase = createClient();

  /* ---------------------------------------------------------------------------
     Fetch Coaches
  --------------------------------------------------------------------------- */
  const fetchCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from('ll_tool_coaches')
        .select('*')
        .order('coach_name', { ascending: true });

      if (error) throw error;
      setCoaches(data || []);
    } catch (err) {
      console.error('Error fetching coaches:', err);
      setError('Failed to load coaches');
    }
  };

  /* ---------------------------------------------------------------------------
     Fetch Fellows for Selected Coach
  --------------------------------------------------------------------------- */
  const fetchFellows = async (coachId: string) => {
    try {
      const { data, error } = await supabase
        .from('ll_tool_fellows')
        .select(
          `
          *,
          ll_tool_coaches!ll_tool_fellows_coach_id_fkey (
            coach_name
          )
        `,
        )
        .eq('coach_id', coachId)
        .order('fellow_name', { ascending: true });

      if (error) throw error;

      const formattedFellows = (data || []).map((fellow: any) => ({
        ...fellow,
        coach_name: fellow.ll_tool_coaches?.coach_name,
      }));

      setFellows(formattedFellows);
    } catch (err) {
      console.error('Error fetching fellows:', err);
      setError('Failed to load fellows');
    }
  };

  /* ---------------------------------------------------------------------------
     Fetch Learners for Selected Fellow
  --------------------------------------------------------------------------- */
  const fetchLearners = async (fellowId: string) => {
    try {
      const { data, error } = await supabase
        .from('ll_tool_learners')
        .select('*')
        .eq('fellow_id', fellowId)
        .order('learner_name', { ascending: true });

      if (error) throw error;
      setLearners(data || []);
    } catch (err) {
      console.error('Error fetching learners:', err);
      setError('Failed to load learners');
    }
  };

  /* ---------------------------------------------------------------------------
     Delete Handlers
  --------------------------------------------------------------------------- */
  const handleDeleteCoach = async (coachId: string) => {
    if (!confirm('Are you sure? This will delete all associated fellows and learners.')) return;

    try {
      const { error } = await supabase.from('ll_tool_coaches').delete().eq('id', coachId);
      if (error) throw error;

      await fetchCoaches();
      if (selectedCoach?.id === coachId) {
        setSelectedCoach(null);
        setSelectedFellow(null);
        setFellows([]);
        setLearners([]);
      }
    } catch (err) {
      console.error('Error deleting coach:', err);
      alert('Failed to delete coach');
    }
  };

  const handleDeleteFellow = async (fellowId: string) => {
    if (!confirm('Are you sure? This will delete all associated learners.')) return;

    try {
      const { error } = await supabase.from('ll_tool_fellows').delete().eq('id', fellowId);
      if (error) throw error;

      if (selectedCoach) await fetchFellows(selectedCoach.id);
      if (selectedFellow?.id === fellowId) {
        setSelectedFellow(null);
        setLearners([]);
      }
    } catch (err) {
      console.error('Error deleting fellow:', err);
      alert('Failed to delete fellow');
    }
  };

  const handleDeleteLearner = async (learnerId: string) => {
    if (!confirm('Are you sure you want to delete this learner?')) return;

    try {
      const { error } = await supabase.from('ll_tool_learners').delete().eq('id', learnerId);
      if (error) throw error;

      if (selectedFellow) await fetchLearners(selectedFellow.id);
    } catch (err) {
      console.error('Error deleting learner:', err);
      alert('Failed to delete learner');
    }
  };

  /* ---------------------------------------------------------------------------
     Selection Handlers
  --------------------------------------------------------------------------- */
  const handleCoachSelect = async (coach: Coach) => {
    setSelectedCoach(coach);
    setSelectedFellow(null);
    setLearners([]);
    await fetchFellows(coach.id);
  };

  const handleFellowSelect = async (fellow: Fellow) => {
    setSelectedFellow(fellow);
    await fetchLearners(fellow.id);
  };

  /* ---------------------------------------------------------------------------
     Initial Load
  --------------------------------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCoaches();
      setLoading(false);
    };
    loadData();
  }, []);

  /* ---------------------------------------------------------------------------
     Filtered Coaches
  --------------------------------------------------------------------------- */
  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.coach_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ---------------------------------------------------------------------------
     Loading State
  --------------------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#005a6a]" />
          <p className="text-sm text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------------
     Error State
  --------------------------------------------------------------------------- */
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-red-600 underline"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------------
     Main UI
  --------------------------------------------------------------------------- */
  return (
    <>
      <div className="flex h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005a6a] to-[#007786] px-6 py-4 shadow-md">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="mt-0.5 text-sm text-white/80">Manage Coaches, Fellows & Learners</p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-3">
          {/* Column 1: Coaches */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="mb-3 flex items-center gap-2">
                <UserCog className="h-5 w-5 text-[#005a6a]" />
                <h2 className="font-semibold text-slate-800">Coaches</h2>
                <span className="ml-auto text-xs text-slate-500">
                  {filteredCoaches.length} total
                </span>
              </div>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search coaches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-[#005a6a]/20 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {filteredCoaches.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <UserCog className="mb-3 h-12 w-12 text-slate-300" />
                  <p className="text-sm text-slate-500">
                    {searchQuery ? 'No coaches found' : 'No coaches yet'}
                  </p>
                </div>
              ) : (
                filteredCoaches.map((coach) => (
                  <div
                    key={coach.id}
                    className={`w-full rounded-lg border p-3 transition-all ${
                      selectedCoach?.id === coach.id
                        ? 'border-[#005a6a] bg-[#005a6a]/10 ring-2 ring-[#005a6a]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button onClick={() => handleCoachSelect(coach)} className="flex-1 text-left">
                        <div className="truncate text-sm font-medium text-slate-900">
                          {coach.coach_name}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{coach.email}</span>
                        </div>
                      </button>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setModal({ type: 'edit-coach', coach })}
                          className="rounded p-1.5 transition hover:bg-blue-50"
                          title="Edit coach"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoach(coach.id)}
                          className="rounded p-1.5 transition hover:bg-red-50"
                          title="Delete coach"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-200 p-3">
              <button
                onClick={() => setModal({ type: 'add-coach' })}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#005a6a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#007786]"
              >
                <Plus className="h-4 w-4" />
                Add Coach
              </button>
            </div>
          </div>

          {/* Column 2: Fellows */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#005a6a]" />
                <h2 className="font-semibold text-slate-800">Fellows</h2>
                {selectedCoach && (
                  <span className="ml-auto text-xs text-slate-500">
                    {fellows.length} under {selectedCoach.coach_name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {!selectedCoach ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <GraduationCap className="mb-3 h-12 w-12 text-slate-300" />
                  <p className="text-sm text-slate-500">Select a coach to view fellows</p>
                </div>
              ) : fellows.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <GraduationCap className="mb-3 h-12 w-12 text-slate-300" />
                  <p className="text-sm text-slate-500">No fellows assigned to this coach</p>
                </div>
              ) : (
                fellows.map((fellow) => (
                  <div
                    key={fellow.id}
                    className={`w-full rounded-lg border p-3 transition-all ${
                      selectedFellow?.id === fellow.id
                        ? 'border-[#005a6a] bg-[#005a6a]/10 ring-2 ring-[#005a6a]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => handleFellowSelect(fellow)}
                        className="flex-1 text-left"
                      >
                        <div className="truncate text-sm font-medium text-slate-900">
                          {fellow.fellow_name}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{fellow.email}</span>
                        </div>
                        {fellow.grade && (
                          <div className="mt-1.5 text-xs font-medium text-[#005a6a]">
                            {fellow.grade}
                          </div>
                        )}
                      </button>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setModal({ type: 'edit-fellow', fellow })}
                          className="rounded p-1.5 transition hover:bg-blue-50"
                          title="Edit fellow"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteFellow(fellow.id)}
                          className="rounded p-1.5 transition hover:bg-red-50"
                          title="Delete fellow"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedCoach && (
              <div className="border-t border-slate-200 p-3">
                <button
                  onClick={() => setModal({ type: 'add-fellow', coachId: selectedCoach.id })}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#005a6a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#007786]"
                >
                  <Plus className="h-4 w-4" />
                  Add Fellow
                </button>
              </div>
            )}
          </div>

          {/* Column 3: Learners */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#005a6a]" />
                <h2 className="font-semibold text-slate-800">Learners</h2>
                {selectedFellow && (
                  <span className="ml-auto text-xs text-slate-500">
                    {learners.length} under {selectedFellow.fellow_name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {!selectedFellow ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <BookOpen className="mb-3 h-12 w-12 text-slate-300" />
                  <p className="text-sm text-slate-500">Select a fellow to view learners</p>
                </div>
              ) : learners.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <BookOpen className="mb-3 h-12 w-12 text-slate-300" />
                  <p className="text-sm text-slate-500">No learners assigned to this fellow</p>
                </div>
              ) : (
                learners.map((learner) => (
                  <div
                    key={learner.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-900">
                        {learner.learner_name}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setModal({ type: 'edit-learner', learner })}
                        className="flex-shrink-0 rounded p-1.5 transition hover:bg-blue-50"
                        title="Edit learner"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteLearner(learner.id)}
                        className="flex-shrink-0 rounded p-1.5 transition hover:bg-red-50"
                        title="Delete learner"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedFellow && (
              <div className="border-t border-slate-200 p-3">
                <button
                  onClick={() => setModal({ type: 'add-learner', fellowId: selectedFellow.id })}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#005a6a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#007786]"
                >
                  <Plus className="h-4 w-4" />
                  Add Learner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <ModalManager
          modal={modal}
          onClose={() => setModal(null)}
          onSuccess={async () => {
            setModal(null);
            await fetchCoaches();
            if (selectedCoach) await fetchFellows(selectedCoach.id);
            if (selectedFellow) await fetchLearners(selectedFellow.id);
          }}
          supabase={supabase}
          loading={modalLoading}
          setLoading={setModalLoading}
        />
      )}
    </>
  );
}

/* ---------------------------------------------------------------------------
   Modal Manager Component
--------------------------------------------------------------------------- */

interface ModalManagerProps {
  modal: ModalType;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  supabase: ReturnType<typeof createClient>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function ModalManager({
  modal,
  onClose,
  onSuccess,
  supabase,
  loading,
  setLoading,
}: ModalManagerProps) {
  if (!modal) return null;

  if (modal.type === 'add-coach' || modal.type === 'edit-coach') {
    return (
      <CoachModal
        mode={modal.type === 'add-coach' ? 'add' : 'edit'}
        coach={modal.type === 'edit-coach' ? modal.coach : undefined}
        onClose={onClose}
        onSuccess={onSuccess}
        supabase={supabase}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  if (modal.type === 'add-fellow' || modal.type === 'edit-fellow') {
    return (
      <FellowModal
        mode={modal.type === 'add-fellow' ? 'add' : 'edit'}
        fellow={modal.type === 'edit-fellow' ? modal.fellow : undefined}
        coachId={modal.type === 'add-fellow' ? modal.coachId : undefined}
        onClose={onClose}
        onSuccess={onSuccess}
        supabase={supabase}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  if (modal.type === 'add-learner' || modal.type === 'edit-learner') {
    return (
      <LearnerModal
        mode={modal.type === 'add-learner' ? 'add' : 'edit'}
        learner={modal.type === 'edit-learner' ? modal.learner : undefined}
        fellowId={modal.type === 'add-learner' ? modal.fellowId : undefined}
        onClose={onClose}
        onSuccess={onSuccess}
        supabase={supabase}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  return null;
}

/* ---------------------------------------------------------------------------
   Coach Modal
--------------------------------------------------------------------------- */

interface CoachModalProps {
  mode: 'add' | 'edit';
  coach?: Coach;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  supabase: ReturnType<typeof createClient>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function CoachModal({
  mode,
  coach,
  onClose,
  onSuccess,
  supabase,
  loading,
  setLoading,
}: CoachModalProps) {
  const [coachName, setCoachName] = useState(coach?.coach_name || '');
  const [email, setEmail] = useState(coach?.email || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('ll_tool_coaches')
          .insert({ coach_name: coachName, email });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ll_tool_coaches')
          .update({ coach_name: coachName, email })
          .eq('id', coach!.id);
        if (error) throw error;
      }
      await onSuccess();
    } catch (err) {
      console.error('Error saving coach:', err);
      alert('Failed to save coach');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {mode === 'add' ? 'Add Coach' : 'Edit Coach'}
          </h3>
          <button onClick={onClose} className="rounded p-1 transition hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Coach Name</label>
            <input
              type="text"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#005a6a]/20 focus:outline-none"
              placeholder="Enter coach name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#005a6a]/20 focus:outline-none"
              placeholder="coach@teachthenation.org"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#005a6a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#007786] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Fellow Modal
--------------------------------------------------------------------------- */

interface FellowModalProps {
  mode: 'add' | 'edit';
  fellow?: Fellow;
  coachId?: string;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  supabase: ReturnType<typeof createClient>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function FellowModal({
  mode,
  fellow,
  coachId,
  onClose,
  onSuccess,
  supabase,
  loading,
  setLoading,
}: FellowModalProps) {
  const [fellowName, setFellowName] = useState(fellow?.fellow_name || '');
  const [email, setEmail] = useState(fellow?.email || '');
  const [grade, setGrade] = useState(fellow?.grade || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        const { error } = await supabase.from('ll_tool_fellows').insert({
          fellow_name: fellowName,
          email,
          grade: grade || null,
          coach_id: coachId!,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ll_tool_fellows')
          .update({
            fellow_name: fellowName,
            email,
            grade: grade || null,
          })
          .eq('id', fellow!.id);
        if (error) throw error;
      }
      await onSuccess();
    } catch (err) {
      console.error('Error saving fellow:', err);
      alert('Failed to save fellow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {mode === 'add' ? 'Add Fellow' : 'Edit Fellow'}
          </h3>
          <button onClick={onClose} className="rounded p-1 transition hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Fellow Name</label>
            <input
              type="text"
              value={fellowName}
              onChange={(e) => setFellowName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#005a6a]/20 focus:outline-none"
              placeholder="Enter fellow name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#005a6a]/20 focus:outline-none"
              placeholder="fellow@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Grade (Optional)
            </label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#005a6a]/20 focus:outline-none"
              placeholder="e.g., Grade 4"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#005a6a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#007786] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Learner Modal
--------------------------------------------------------------------------- */

interface LearnerModalProps {
  mode: 'add' | 'edit';
  learner?: Learner;
  fellowId?: string;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  supabase: ReturnType<typeof createClient>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function LearnerModal({
  mode,
  learner,
  fellowId,
  onClose,
  onSuccess,
  supabase,
  loading,
  setLoading,
}: LearnerModalProps) {
  const [learnerName, setLearnerName] = useState(learner?.learner_name || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        const { error } = await supabase.from('ll_tool_learners').insert({
          learner_name: learnerName,
          fellow_id: fellowId!,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ll_tool_learners')
          .update({ learner_name: learnerName })
          .eq('id', learner!.id);
        if (error) throw error;
      }
      await onSuccess();
    } catch (err) {
      console.error('Error saving learner:', err);
      alert('Failed to save learner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {mode === 'add' ? 'Add Learner' : 'Edit Learner'}
          </h3>
          <button onClick={onClose} className="rounded p-1 transition hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Learner Name</label>
            <input
              type="text"
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#005a6a]/20 focus:outline-none"
              placeholder="Enter learner name"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#005a6a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#007786] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
