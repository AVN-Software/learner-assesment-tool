'use client';

import { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { useAdminData } from '../../../../providers/AdminDataProvider';
import { Learner, LearnerInsertPayload, LearnerUpdatePayload } from '../../types';

interface LearnerModalProps {
  mode: 'add' | 'edit';
  learner?: Learner;
  onClose: () => void;
}

export function LearnerModal({ mode, learner, onClose }: LearnerModalProps) {
  const { selectedFellow, createLearner, updateLearner, loading } = useAdminData();

  const [name, setName] = useState(learner?.learner_name || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'add') {
      const payload: LearnerInsertPayload = {
        learner_name: name,
        fellow_id: selectedFellow!.id,
      };
      await createLearner(payload);
    } else {
      const payload: LearnerUpdatePayload = {
        learner_name: name,
      };
      await updateLearner(learner!.id, payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">
            {mode === 'add' ? 'Add Learner' : 'Edit Learner'}
          </h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Learner Name</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
