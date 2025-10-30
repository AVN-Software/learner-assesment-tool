'use client';

import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Grade, GRADE_LABELS } from '@/types/core.types';

interface GradeSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectGrade: (grade: Grade) => void;
  fellowId: string;
}

export default function GradeSelectionModal({
  open,
  onClose,
  onSelectGrade,
  fellowId,
}: GradeSelectionModalProps) {
  const supabase = createClient();
  const [selectedGrade, setSelectedGrade] = React.useState<Grade | ''>('');
  const [confirmMode, setConfirmMode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setSelectedGrade('');
      setError(null);
      setConfirmMode(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSaveGrade = async () => {
    if (!selectedGrade || !fellowId) return;
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('ll_tool_fellows')
        .update({ grade: selectedGrade })
        .eq('id', fellowId);

      if (error) {
        console.error('Error updating grade:', error);
        setError('Failed to save grade. Please try again.');
        setLoading(false);
        return;
      }

      onSelectGrade(selectedGrade as Grade);
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedGrade) return;
    setConfirmMode(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {confirmMode ? 'Confirm Your Grade' : 'Select Grade Level'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* STEP 1: Grade Selection */}
        {!confirmMode && (
          <>
            <p className="mb-3 text-sm text-gray-600">
              Your grade information is missing. Please select the grade you will be assessing.
            </p>

            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
              ⚠️ Once you confirm your grade, it will be permanently saved and cannot be changed
              later.
            </p>

            {error && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="grade-select"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Choose your grade:
              </label>
              <select
                id="grade-select"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as Grade)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a grade</option>
                {GRADE_LABELS.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedGrade}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2: Confirmation */}
        {confirmMode && (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-blue-600" />
            <p className="mb-1 text-base font-medium text-gray-700">You have selected:</p>
            <p className="mb-4 text-lg font-bold text-blue-700">{selectedGrade}</p>
            <p className="mb-4 text-sm text-gray-600">
              Please confirm this is correct — once saved, your grade cannot be changed later.
            </p>

            {error && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveGrade}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0
                        5.373 0 12h4zm2 5.291A7.962 7.962 0
                        014 12H0c0 3.042 1.135 5.824 3
                        7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Confirm and Save'
                )}
              </button>

              <button
                onClick={() => setConfirmMode(false)}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
