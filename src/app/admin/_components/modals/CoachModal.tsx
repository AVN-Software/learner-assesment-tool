'use client';

import { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { useAdminData } from '../../../../providers/AdminDataProvider';
import { Coach, CoachInsertPayload, CoachUpdatePayload } from '../../types';

interface CoachModalProps {
  mode: 'add' | 'edit';
  coach?: Coach;
  onClose: () => void;
}

export function CoachModal({ mode, coach, onClose }: CoachModalProps) {
  const { createCoach, updateCoach, loading } = useAdminData();

  const [coachName, setCoachName] = useState(coach?.coach_name || '');
  const [email, setEmail] = useState(coach?.email || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'add') {
      const payload: CoachInsertPayload = {
        coach_name: coachName,
        email,
      };
      await createCoach(payload);
    } else {
      const payload: CoachUpdatePayload = {
        coach_name: coachName,
        email,
      };
      await updateCoach(coach!.id, payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{mode === 'add' ? 'Add Coach' : 'Edit Coach'}</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="text-sm font-medium">Coach Name</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded border py-2">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded bg-[#005a6a] py-2 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
