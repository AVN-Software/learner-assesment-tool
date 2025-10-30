import React, { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Coach {
  id: string;
  coach_name: string;
  email: string;
  created_at?: string;
}

interface CoachModalProps {
  mode: 'add' | 'edit';
  coach?: Coach;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  supabase: ReturnType<typeof createClient>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function CoachModal({
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
