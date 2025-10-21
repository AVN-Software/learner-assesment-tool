"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useData } from "@/providers/DataProvider"; // Use DataProvider for auth
import { useAssessment } from "@/providers/AssessmentProvider"; // Use AssessmentProvider for navigation

export default function LoginStep() {
  const supabase = createClient();
  const { login, loading: authLoading, error: authError } = useData(); // From DataProvider
  const { goToStep } = useAssessment(); // From AssessmentProvider for navigation

  const [coaches, setCoaches] = useState<string[]>([]);
  const [fellows, setFellows] = useState<string[]>([]);
  const [coachname, setCoachname] = useState("");
  const [fellowname, setFellowname] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  /** Load distinct coach names on mount */
  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("tempaccounts")
        .select("coachname")
        .not("coachname", "is", null);

      if (!active) return;
      if (error) {
        console.error(error);
        setLocalError("Failed to load coach names.");
      } else {
        const unique = Array.from(
          new Set(data.map((d) => d.coachname))
        ) as string[];
        setCoaches(unique);
      }
    })();
    return () => {
      active = false;
    };
  }, [supabase]);

  /** Load fellows when a coach is selected */
  useEffect(() => {
    let active = true;
    (async () => {
      if (!coachname) {
        setFellows([]);
        setFellowname("");
        return;
      }

      const { data, error } = await supabase
        .from("tempaccounts")
        .select("fellowname")
        .eq("coachname", coachname);

      if (!active) return;
      if (error) {
        console.error(error);
        setLocalError("Failed to load fellows.");
      } else {
        setFellows(data.map((d) => d.fellowname));
      }
    })();
    return () => {
      active = false;
    };
  }, [coachname, supabase]);

  /** Handle login validation using DataProvider */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setLocalLoading(true);

    const success = await login(coachname, fellowname, email);
    setLocalLoading(false);

    if (success) {
      // Login successful - navigate to next step
      goToStep("intro"); // Or "learners" depending on your flow
    } else {
      // Login failed - show error from DataProvider
      setLocalError(
        authError || "Invalid login details. Please check your info."
      );
    }
  };

  // Combine local and auth loading states
  const isLoading = localLoading || authLoading;
  // Combine local and auth errors
  const error = localError || authError;

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Fellow Selection
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4" role="alert">
            {error}
          </p>
        )}

        {/* Coach selection */}
        <label className="block mb-2 font-medium text-gray-700">
          Coach Name
        </label>
        <select
          value={coachname}
          onChange={(e) => {
            setCoachname(e.target.value);
            setFellowname("");
            setLocalError("");
          }}
          className="w-full border rounded-xl px-3 py-2 mb-4 focus:ring focus:ring-blue-200"
          required
          disabled={isLoading}
        >
          <option value="">Select a coach</option>
          {coaches.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Fellow selection */}
        <label className="block mb-2 font-medium text-gray-700">
          Fellow Name
        </label>
        <select
          value={fellowname}
          onChange={(e) => {
            setFellowname(e.target.value);
            setLocalError("");
          }}
          className="w-full border rounded-xl px-3 py-2 mb-4 focus:ring focus:ring-blue-200"
          disabled={!coachname || isLoading}
          required
        >
          <option value="">Select a fellow</option>
          {fellows.map((f, i) => (
            <option key={i} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Email */}
        <label className="block mb-2 font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setLocalError("");
          }}
          className="w-full border rounded-xl px-3 py-2 mb-6 focus:ring focus:ring-blue-200"
          placeholder="you@example.com"
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white rounded-2xl py-2.5 font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
