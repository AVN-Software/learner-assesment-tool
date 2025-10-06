"use client";

import { useState, useMemo } from "react";
import { useAssessment } from "@/context/AssessmentProvider";
import {
  ChevronRight,
  CheckCircle2,
  Users,
  Mail,
  GraduationCap,
} from "lucide-react";

export default function FellowSelection() {
  const { fellows, selectFellow } = useAssessment();

  const [term, setTerm] = useState("");
  const [coach, setCoach] = useState("");
  const [fellowId, setFellowId] = useState("");
  const [email, setEmail] = useState("");

  // ---------------------------
  // 🔹 Filter and Selection Logic
  // ---------------------------
  const filteredFellows = useMemo(() => {
    if (!coach) return [];
    return fellows.filter((f) => f.coachName === coach);
  }, [coach, fellows]);

  const selectedFellow = fellows.find((f) => f.id === fellowId);

  const emailMatches =
    selectedFellow &&
    email.trim().toLowerCase() ===
      selectedFellow.coachEmail.trim().toLowerCase();

  const isComplete = !!term && !!coach && !!selectedFellow && emailMatches;

  const handleConfirm = () => {
    if (!isComplete || !selectedFellow) return;
    selectFellow(selectedFellow, term);
  };

  // ---------------------------
  // 💅 UI
  // ---------------------------
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Fellow Information
      </h2>
      <p className="text-slate-600 mb-8">
        Please verify your details below to begin learner assessments.
      </p>

      {/* Term Selection */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-1">
          Academic Term
        </label>
        <select
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg bg-white text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Select a term...</option>
          <option value="Term 1">Term 1</option>
          <option value="Term 2">Term 2</option>
          <option value="Term 3">Term 3</option>
          <option value="Term 4">Term 4</option>
        </select>
      </div>

      {/* Coach Selection */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-1">Coach Name</label>
        <select
          value={coach}
          onChange={(e) => {
            setCoach(e.target.value);
            setFellowId("");
          }}
          className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg bg-white text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Select coach...</option>
          {[...new Set(fellows.map((f) => f.coachName))].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Fellow Dropdown */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-1">
          Fellow (Teacher)
        </label>
        <select
          value={fellowId}
          onChange={(e) => setFellowId(e.target.value)}
          disabled={!coach}
          className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg bg-white text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
        >
          <option value="">Select fellow...</option>
          {filteredFellows.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Email Verification */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-1">
          Coach Email Verification
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter coach email"
            className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-200"
          />
        </div>
        {email && selectedFellow && !emailMatches && (
          <p className="text-sm text-red-600 mt-2">
            Email does not match the registered coach for this fellow.
          </p>
        )}
        {emailMatches && (
          <p className="text-sm text-emerald-700 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Verified:{" "}
            {selectedFellow.coachEmail}
          </p>
        )}
      </div>

      {/* Selected Fellow Summary */}
      {selectedFellow && emailMatches && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-6 h-6 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">
              {selectedFellow.name}
            </h3>
          </div>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Coach:</span>{" "}
            {selectedFellow.coachName}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Year of Fellowship:</span>{" "}
            {selectedFellow.yearOfFellowship}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Coach Email:</span>{" "}
            {selectedFellow.coachEmail}
          </p>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleConfirm}
        disabled={!isComplete}
        className={`w-full flex items-center justify-center gap-3 px-8 py-3 rounded-lg font-bold text-lg transition-all ${
          isComplete
            ? "bg-slate-800 text-white hover:bg-slate-900"
            : "bg-slate-200 text-slate-500 cursor-not-allowed"
        }`}
      >
        Continue to Assessment
        <ChevronRight className="w-5 h-5" />
      </button>

      {!isComplete && (
        <div className="flex items-center justify-center text-slate-500 text-sm mt-4">
          <Users className="w-4 h-4 mr-1" /> Complete all fields to continue.
        </div>
      )}
    </div>
  );
}
