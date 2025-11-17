'use client';

import { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { useAdminData } from '../../../../providers/AdminDataProvider';
import { Fellow, FellowInsertPayload, FellowUpdatePayload } from '../../types';

interface FellowModalProps {
  mode: 'add' | 'edit';
  fellow?: Fellow;
  coachId?: string;
  onClose: () => void;
}

export function FellowModal({ mode, fellow, coachId, onClose }: FellowModalProps) {
  const { createFellow, updateFellow, loading } = useAdminData();

  const [name, setName] = useState(fellow?.fellow_name || '');
  const [email, setEmail] = useState(fellow?.email || '');
  const [grade, setGrade] = useState(fellow?.grade || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'add') {
      const payload: FellowInsertPayload = {
        fellow_name: name,
        email,
        grade: grade || null,
        coach_id: coachId!,
      };
      await createFellow(payload);
    } else {
      const payload: FellowUpdatePayload = {
        fellow_name: name,
        email,
        grade: grade || null,
      };
      await updateFellow(fellow!.id, payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{mode === 'add' ? 'Add Fellow' : 'Edit Fellow'}</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Fellow Name</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Grade */}
          <div>
            <label className="text-sm font-medium">Grade (Optional)</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={grade || ''}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          {/* Actions */}
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
