'use client';

import { Loader2 } from 'lucide-react';

// Panels
import { CoachesPanel } from './_components/panels/CoachesPanel';
import { FellowsPanel } from './_components/panels/FellowsPanel';
import { LearnersPanel } from './_components/panels/LearnersPanel';
import { useAdminData } from '../../providers/AdminDataProvider';

// Modal Manager (rendered globally via provider, not here)

export default function AdminPanel() {
  const {
    loading,
    error,

    // data
    coaches,
    fellows,
    learners,

    // selections
    selectedCoach,
    selectedFellow,
    selectCoach,
    selectFellow,

    // fetch
    fetchCoaches,
    fetchFellows,
    fetchLearners,

    // modal
    setModal,
  } = useAdminData();

  /* ────────────────────────────────
     LOADING UI
     ──────────────────────────────── */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#005a6a]" />
      </div>
    );
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-600">{error}</div>;
  }

  /* ────────────────────────────────
     RENDER UI
     ──────────────────────────────── */
  return (
    <div className="flex h-screen flex-col">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#005a6a] to-[#007786] px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>

          <button
            onClick={() => {
              fetchCoaches();
              if (selectedCoach) fetchFellows(selectedCoach.id);
              if (selectedFellow) fetchLearners(selectedFellow.id);
            }}
            className="rounded bg-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/30"
          >
            Refresh
          </button>
        </div>

        {/* SEARCH BAR */}
      </div>

      {/* MAIN GRID */}
      <div className="grid flex-1 grid-cols-1 gap-4 p-4 md:grid-cols-3">
        {/* ◼ COACHES */}
        <CoachesPanel />

        {/* ◼ FELLOWS */}
        <FellowsPanel />

        {/* ◼ LEARNERS */}
        <LearnersPanel />
      </div>
    </div>
  );
}
