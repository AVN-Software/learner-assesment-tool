"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { GraduationCap, CheckCircle2, Trash2 } from "lucide-react";
import { TempAccount } from "@/types";

type Learner = {
  id: string;
  learner_name: string;
};

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();

  // Fellow info from localStorage
  const fellow = useMemo<TempAccount | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tempUser");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }, []);

  // Form state
  const [grade, setGrade] = useState("");
  const [phase, setPhase] = useState("");
  const [onboardingTerm, setOnboardingTerm] = useState<number>(1);
  const [learnerNames, setLearnerNames] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Auto-derive phase from grade
  useEffect(() => {
    const g = grade.toLowerCase();
    if (["grade r", "grade 1", "grade 2", "grade 3"].includes(g)) {
      setPhase("Foundation");
    } else if (["grade 4", "grade 5", "grade 6"].includes(g)) {
      setPhase("Intermediate");
    } else if (["grade 7", "grade 8", "grade 9"].includes(g)) {
      setPhase("Senior");
    } else if (["grade 10", "grade 11", "grade 12"].includes(g)) {
      setPhase("FET");
    }
  }, [grade]);

  // Load existing data if fellow has started onboarding
  useEffect(() => {
    const loadData = async () => {
      if (!fellow) return;
      setLoading(true);

      try {
        // Load fellow's grade/phase if already set
        if (fellow.grade) setGrade(fellow.grade);
        if (fellow.phase) setPhase(fellow.phase);
        if (fellow.onboarding_term) setOnboardingTerm(fellow.onboarding_term);

        // Load existing learners
        const { data: learnersData, error: learnersError } = await supabase
          .from("learners")
          .select("id, learner_name")
          .eq("fellow_id", fellow.id)
          .order("learner_name");

        if (learnersError) throw learnersError;

        if (learnersData && learnersData.length > 0) {
          const names = learnersData.map((l: Learner) => l.learner_name);
          // Fill to 5 learners
          while (names.length < 5) names.push("");
          setLearnerNames(names);
        }
      } catch (err: unknown) {
        console.error("Error loading data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fellow, supabase]);

  const handleLearnerNameChange = (index: number, value: string) => {
    const updated = [...learnerNames];
    updated[index] = value;
    setLearnerNames(updated);
  };

  const handleAddLearner = () => {
    setLearnerNames([...learnerNames, ""]);
  };

  const handleRemoveLearner = (index: number) => {
    if (learnerNames.length <= 5) return; // Keep minimum 5
    const updated = learnerNames.filter((_, i) => i !== index);
    setLearnerNames(updated);
  };

  const handleSubmit = async () => {
    if (!fellow) return;

    // Validation
    if (!grade) {
      setError("Please select a grade");
      return;
    }

    const validLearners = learnerNames.filter((name) => name.trim() !== "");
    if (validLearners.length < 5) {
      setError("Please enter at least 5 learner names");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // 1. Update fellow with grade, phase, and onboarding_term
      const { error: fellowError } = await supabase
        .from("tempaccounts")
        .update({
          grade,
          phase,
          onboarding_term: onboardingTerm,
          onboarding_complete: true,
        })
        .eq("id", fellow.id);

      if (fellowError) throw fellowError;

      // 2. Delete existing learners for this fellow
      const { error: deleteError } = await supabase
        .from("learners")
        .delete()
        .eq("fellow_id", fellow.id);

      if (deleteError) throw deleteError;

      // 3. Insert new learners
      const learnersToInsert = validLearners.map((name) => ({
        fellow_id: fellow.id,
        learner_name: name.trim(),
      }));

      const { error: insertError } = await supabase
        .from("learners")
        .insert(learnersToInsert);

      if (insertError) throw insertError;

      // 4. Update localStorage
      const updatedFellow = {
        ...fellow,
        grade,
        phase,
        onboarding_term: onboardingTerm,
        onboarding_complete: true,
      };
      localStorage.setItem("tempUser", JSON.stringify(updatedFellow));

      // 5. Redirect to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Error saving onboarding:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-slate-300 border-t-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Welcome, {fellow?.fellowname}!
              </h2>
              <p className="text-sm text-slate-500">
                Lets set up your assessment profile
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                What grade do you teach? *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select grade...</option>
                <option value="Grade R">Grade R</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={`Grade ${i + 1}`}>
                    Grade {i + 1}
                  </option>
                ))}
              </select>
              {phase && (
                <p className="text-xs text-slate-500 mt-1.5">
                  Phase: <span className="font-semibold">{phase}</span>
                </p>
              )}
            </div>

            {/* Onboarding Term */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Which term are you starting in? *
              </label>
              <select
                value={onboardingTerm}
                onChange={(e) => setOnboardingTerm(Number(e.target.value))}
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Term 1</option>
                <option value={2}>Term 2</option>
                <option value={3}>Term 3</option>
                <option value={4}>Term 4</option>
              </select>
              <p className="text-xs text-slate-500 mt-1.5">
                Youll only assess learners from this term onwards
              </p>
            </div>

            {/* Focus Learners */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-700">
                  Focus Learners (minimum 5) *
                </label>
                {learnerNames.length < 10 && (
                  <button
                    onClick={handleAddLearner}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add learner
                  </button>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 text-xs text-slate-700">
                <p>
                  These are the learners youll assess throughout the year.
                  Choose a diverse group to get a good picture of your class.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {learnerNames.map((name, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={name}
                      onChange={(e) =>
                        handleLearnerNameChange(i, e.target.value)
                      }
                      placeholder={`Learner ${i + 1}`}
                      className="flex-1 border-2 border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {learnerNames.length > 5 && (
                      <button
                        onClick={() => handleRemoveLearner(i)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Complete Setup
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 mt-4">
        You can update your learners later from your dashboard
      </p>
    </div>
  );
}
