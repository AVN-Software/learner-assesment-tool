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
  Info,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { CoachModal } from './_components/modals/CoachModal';
import { FellowModal } from './_components/modals/FellowModal';
import { LearnerModal } from './_components/modals/LearnerModal';

// Import the separated modal components

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
   Instructions Component
--------------------------------------------------------------------------- */

function Instructions() {
  const [showInstructions, setShowInstructions] = useState(true);

  if (!showInstructions) return null;

  return (
    <div className="mx-4 mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">How This Works</h3>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-3 text-sm text-blue-800 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium">🏋️ Coaches Section:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Add coaches using the "Add Coach" button</li>
                <li>Edit coach details by clicking the edit icon</li>
                <li>Delete coaches with the trash icon</li>
                <li>Select a coach to view their fellows</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">🎓 Fellows Section:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Select a coach first to see their fellows</li>
                <li>Add fellows to the selected coach</li>
                <li>Edit fellow details and grades</li>
                <li>Select a fellow to view their learners</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">📚 Learners Section:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Select a fellow first to see their learners</li>
                <li>Add learners to the selected fellow</li>
                <li>Edit learner names as needed</li>
                <li>Manage all learners under each fellow</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs text-blue-700">
            💡 <strong>Flow:</strong> Coach → Fellow → Learner. You must select a coach to add/view
            fellows, and select a fellow to add/view learners.
          </p>
        </div>
        <button
          onClick={() => setShowInstructions(false)}
          className="ml-4 rounded p-1 transition hover:bg-blue-200"
          title="Close instructions"
        >
          <X className="h-4 w-4 text-blue-600" />
        </button>
      </div>
    </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="mt-0.5 text-sm text-white/80">Manage Coaches, Fellows & Learners</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/30"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Instructions */}
        <Instructions />

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
                  {!searchQuery && (
                    <button
                      onClick={() => setModal({ type: 'add-coach' })}
                      className="mt-3 text-sm text-[#005a6a] underline"
                    >
                      Add your first coach
                    </button>
                  )}
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
              {!selectedCoach && (
                <p className="mt-2 text-xs text-slate-500">
                  ← Select a coach to view and manage fellows
                </p>
              )}
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
                  <button
                    onClick={() => setModal({ type: 'add-fellow', coachId: selectedCoach.id })}
                    className="mt-3 text-sm text-[#005a6a] underline"
                  >
                    Add first fellow
                  </button>
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
              {!selectedFellow && (
                <p className="mt-2 text-xs text-slate-500">
                  ← Select a fellow to view and manage learners
                </p>
              )}
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
                  <button
                    onClick={() => setModal({ type: 'add-learner', fellowId: selectedFellow.id })}
                    className="mt-3 text-sm text-[#005a6a] underline"
                  >
                    Add first learner
                  </button>
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
