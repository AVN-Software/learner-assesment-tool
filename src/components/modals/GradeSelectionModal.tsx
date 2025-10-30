"use client";

import React from "react";
import { X, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export type Grade =
  | "Grade R"
  | "Grade 1"
  | "Grade 2"
  | "Grade 3"
  | "Grade 4"
  | "Grade 5"
  | "Grade 6"
  | "Grade 7"
  | "Grade 8"
  | "Grade 9"
  | "Grade 10"
  | "Grade 11"
  | "Grade 12";

interface GradeSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectGrade: (grade: Grade) => void;
  fellowId: string;
}

const GRADES: Grade[] = [
  "Grade R",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

export default function GradeSelectionModal({
  open,
  onClose,
  onSelectGrade,
  fellowId,
}: GradeSelectionModalProps) {
  const supabase = createClient();
  const [selectedGrade, setSelectedGrade] = React.useState<Grade | "">("");
  const [confirmMode, setConfirmMode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setSelectedGrade("");
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
        .from("ll_tool_fellows")
        .update({ grade: selectedGrade })
        .eq("id", fellowId);

      if (error) {
        console.error("Error updating grade:", error);
        setError("Failed to save grade. Please try again.");
        setLoading(false);
        return;
      }

      onSelectGrade(selectedGrade as Grade);
      setLoading(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedGrade) return;
    setConfirmMode(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {confirmMode ? "Confirm Your Grade" : "Select Grade Level"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* STEP 1: Grade Selection */}
        {!confirmMode && (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Your grade information is missing. Please select the grade you
              will be assessing.
            </p>

            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4">
              ⚠️ Once you confirm your grade, it will be permanently saved and
              cannot be changed later.
            </p>

            {error && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="grade-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Choose your grade:
              </label>
              <select
                id="grade-select"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as Grade)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select a grade</option>
                {GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedGrade}
              className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2: Confirmation */}
        {confirmMode && (
          <div className="text-center">
            <CheckCircle className="mx-auto text-blue-600 w-12 h-12 mb-3" />
            <p className="text-base font-medium text-gray-700 mb-1">
              You have selected:
            </p>
            <p className="text-lg font-bold text-blue-700 mb-4">
              {selectedGrade}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Please confirm this is correct — once saved, your grade cannot be
              changed later.
            </p>

            {error && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveGrade}
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
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
                  "Confirm and Save"
                )}
              </button>

              <button
                onClick={() => setConfirmMode(false)}
                disabled={loading}
                className="w-full border border-gray-300 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-50 transition-all"
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
