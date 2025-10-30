import React, { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Learner {
  id: string;
  learner_name: string;
  fellow_id: string;
  created_at?: string;
}

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

export function LearnerModal({
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
