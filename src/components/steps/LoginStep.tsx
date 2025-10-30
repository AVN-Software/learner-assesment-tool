"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useData } from "@/providers/DataProvider";
import { useAssessment } from "@/providers/AssessmentProvider";
import GradeSelectionModal, {
  Grade,
} from "@/components/modals/GradeSelectionModal";

// ============================================================================
// TYPES
// ============================================================================

type Phase = "Foundation" | "Intermediate" | "Senior" | "FET";

interface Learner {
  learnerId: string;
  learnerName: string;
  assessmentCompleted: boolean;
  assessmentId?: string;
  dateCreated?: string;
  dateModified?: string;
}

interface DbLearner {
  id: string;
  learner_name: string;
}

interface DbAssessment {
  id: string;
  learner_id: string;
  learner_name: string;
  date_created: string;
  date_modified: string | null;
}

interface DbFellow {
  id: string;
  fellow_name: string;
  coach_name: string;
  email: string;
  grade: string | null;
}

interface PendingData {
  fellowData: DbFellow;
  learnersData: DbLearner[];
  assessmentsData: DbAssessment[];
}

// ============================================================================
// HELPERS
// ============================================================================

const derivePhaseFromGrade = (grade: Grade): Phase => {
  if (["Grade R", "Grade 1", "Grade 2", "Grade 3"].includes(grade))
    return "Foundation";
  if (["Grade 4", "Grade 5", "Grade 6"].includes(grade)) return "Intermediate";
  if (["Grade 7", "Grade 8", "Grade 9"].includes(grade)) return "Senior";
  if (["Grade 10", "Grade 11", "Grade 12"].includes(grade)) return "FET";
  return "Foundation";
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function LoginStep() {
  const supabase = createClient();
  const { setFellowData } = useData();
  const { goToStep } = useAssessment();

  // State
  const [coaches, setCoaches] = useState<string[]>([]);
  const [fellows, setFellows] = useState<string[]>([]);
  const [coachname, setCoachname] = useState("");
  const [fellowname, setFellowname] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [pendingFellowData, setPendingFellowData] =
    useState<PendingData | null>(null);

  // ========================================================================
  // LOAD COACHES
  // ========================================================================
  useEffect(() => {
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from("ll_tool_fellows")
        .select("coach_name")
        .not("coach_name", "is", null);

      if (!active) return;

      if (error) {
        console.error("Failed to load coaches:", error);
        setError("Failed to load coach names. Please refresh.");
      } else {
        const unique = Array.from(
          new Set(data.map((d) => d.coach_name))
        ) as string[];
        setCoaches(unique);
      }
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  // ========================================================================
  // LOAD FELLOWS WHEN COACH SELECTED
  // ========================================================================
  useEffect(() => {
    let active = true;
    if (!coachname) {
      setFellows([]);
      setFellowname("");
      return;
    }

    (async () => {
      const { data, error } = await supabase
        .from("ll_tool_fellows")
        .select("fellow_name")
        .eq("coach_name", coachname);

      if (!active) return;

      if (error) {
        console.error("Failed to load fellows:", error);
        setError("Failed to load fellows. Please try again.");
      } else {
        setFellows(data.map((d) => d.fellow_name));
      }
    })();

    return () => {
      active = false;
    };
  }, [coachname, supabase]);

  // ========================================================================
  // LOGIN HANDLER
  // ========================================================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: fellowData, error: fellowError } = await supabase
        .from("ll_tool_fellows")
        .select("id, fellow_name, coach_name, email, grade")
        .eq("coach_name", coachname)
        .eq("fellow_name", fellowname)
        .eq("email", email)
        .single();

      if (fellowError || !fellowData) {
        setError("Invalid credentials. Please check your information.");
        setLoading(false);
        return;
      }

      // Fetch learners
      const { data: learnersData, error: learnersError } = await supabase
        .from("ll_tool_learners")
        .select("id, learner_name")
        .eq("fellow_id", fellowData.id);

      if (learnersError) throw learnersError;

      // Fetch assessments
      const { data: assessmentsData } = await supabase
        .from("ll_tool_assessments")
        .select("id, learner_id, learner_name, date_created, date_modified")
        .eq("fellow_id", fellowData.id);

      const grade = fellowData.grade as Grade | null;

      if (!grade) {
        // Grade missing → show modal
        setPendingFellowData({
          fellowData,
          learnersData: learnersData || [],
          assessmentsData: assessmentsData || [],
        });
        setShowGradeModal(true);
        setLoading(false);
        return;
      }

      // Grade exists → continue login
      completeLogin(
        fellowData,
        learnersData || [],
        assessmentsData || [],
        grade
      );

      // Save login info to localStorage for persistence
      localStorage.setItem(
        "fellowLogin",
        JSON.stringify({ coachname, fellowname, email })
      );
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // COMPLETE LOGIN
  // ========================================================================
  const completeLogin = (
    fellowData: DbFellow,
    learnersData: DbLearner[],
    assessmentsData: DbAssessment[],
    grade: Grade
  ) => {
    const phase = derivePhaseFromGrade(grade);

    const learnersWithStatus: Learner[] = learnersData.map((learner) => {
      const assessment = assessmentsData.find(
        (a) => a.learner_id === learner.id
      );
      return {
        learnerId: learner.id,
        learnerName: learner.learner_name,
        assessmentCompleted: !!assessment,
        assessmentId: assessment?.id,
        dateCreated: assessment?.date_created,
        dateModified: assessment?.date_modified || undefined,
      };
    });

    setFellowData({
      fellowId: fellowData.id,
      fellowName: fellowData.fellow_name,
      coachName: fellowData.coach_name,
      email: fellowData.email,
      grade,
      phase,
      learners: learnersWithStatus,
    });

    goToStep("intro");
  };

  // ========================================================================
  // AUTO-LOGIN IF PREVIOUSLY SAVED
  // ========================================================================
  useEffect(() => {
    const saved = localStorage.getItem("fellowLogin");
    if (saved) {
      const { coachname, fellowname, email } = JSON.parse(saved);
      setCoachname(coachname);
      setFellowname(fellowname);
      setEmail(email);
    }
  }, []);

  // ========================================================================
  // COMPLETE LOGIN WITH GRADE MODAL SELECTION
  // ========================================================================
  const completeLoginWithGrade = (grade: Grade) => {
    if (!pendingFellowData) return;
    const { fellowData, learnersData, assessmentsData } = pendingFellowData;

    completeLogin(fellowData, learnersData, assessmentsData, grade);
    setPendingFellowData(null);
    setShowGradeModal(false);
  };

  // ========================================================================
  // UI
  // ========================================================================
  return (
    <>
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Fellow Login
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Coach select */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Coach Name
            </label>
            <select
              value={coachname}
              onChange={(e) => setCoachname(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a coach</option>
              {coaches.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Fellow select */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Fellow Name
            </label>
            <select
              value={fellowname}
              onChange={(e) => setFellowname(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={!coachname}
              required
            >
              <option value="">
                {coachname ? "Select a fellow" : "Select a coach first"}
              </option>
              {fellows.map((f, i) => (
                <option key={i} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Email input */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !coachname || !fellowname || !email}
            className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Grade Selection Modal */}
      <GradeSelectionModal
        open={showGradeModal}
        onClose={() => {
          setShowGradeModal(false);
          setPendingFellowData(null);
          setLoading(false);
        }}
        onSelectGrade={completeLoginWithGrade}
        fellowId={pendingFellowData?.fellowData.id || ""}
      />
    </>
  );
}
