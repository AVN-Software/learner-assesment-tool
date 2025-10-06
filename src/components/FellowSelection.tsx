"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Mail, GraduationCap, User, X } from "lucide-react";
import { Fellow, Learner } from "@/app/page";

/* ------------------------------------------------------------------
   PROPS
-------------------------------------------------------------------*/
interface FellowSelectionProps {
  fellows: Fellow[];
  allLearners: Learner[];
  coaches: string[];
  onConfirm: (fellow: Fellow, learners: Learner[]) => void;
}

/* ------------------------------------------------------------------
   COMPONENT
-------------------------------------------------------------------*/
export default function FellowSelection({
  fellows,
  allLearners,
  coaches,
  onConfirm,
}: FellowSelectionProps) {
  const [term, setTerm] = useState("");
  const [coach, setCoach] = useState("");
  const [fellowId, setFellowId] = useState("");
  const [verified, setVerified] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedLearnerIds, setSelectedLearnerIds] = useState<string[]>([]);

  /* ---------------------------- Derived Data ---------------------------- */
  const filteredFellows = useMemo(() => {
    return coach ? fellows.filter((f) => f.coachName === coach) : [];
  }, [coach, fellows]);

  const selectedFellow = fellows.find((f) => f.id === fellowId) || null;

  const fellowLearners = useMemo(
    () => allLearners.filter((l) => l.fellowId === fellowId),
    [fellowId, allLearners]
  );

  const learnersByPhase = useMemo(() => {
    return fellowLearners.reduce<Record<string, Learner[]>>((acc, l) => {
      const key = l.phase || "Unassigned";
      if (!acc[key]) acc[key] = [];
      acc[key].push(l);
      return acc;
    }, {});
  }, [fellowLearners]);

  const selectedLearners = fellowLearners.filter((l) =>
    selectedLearnerIds.includes(l.id)
  );

  const toggleLearner = (id: string) => {
    setSelectedLearnerIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isReady = term && coach && selectedFellow && verified;

  /* ---------------------------- UI ---------------------------- */
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-10 relative">
      {/* Header */}
      <header className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Fellow Selection
        </h2>
        <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-[600px] mx-auto">
          Select your term, coach, and fellow to verify before continuing to
          learner assessment.
        </p>
      </header>

      {/* Selection Form */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        {/* Term */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Academic Term
          </label>
          <select
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setVerified(false);
            }}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:border-[#304767] focus:ring-2 focus:ring-[#304767]/20 transition"
          >
            <option value="">Select a term...</option>
            {["Term 1", "Term 2", "Term 3", "Term 4"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Coach */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Coach Name
          </label>
          <select
            value={coach}
            onChange={(e) => {
              setCoach(e.target.value);
              setFellowId("");
              setVerified(false);
              setSelectedLearnerIds([]);
            }}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:border-[#304767] focus:ring-2 focus:ring-[#304767]/20 transition"
          >
            <option value="">Select coach...</option>
            {coaches.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Fellow */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Fellow (Teacher)
          </label>
          <select
            value={fellowId}
            onChange={(e) => {
              const newId = e.target.value;
              setFellowId(newId);
              setVerified(false);
              setSelectedLearnerIds([]);
              if (newId) {
                // small delay ensures React updates fellowId before modal appears
                setTimeout(() => setShowEmailModal(true), 50);
              }
            }}
            disabled={!coach}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:border-[#304767] focus:ring-2 focus:ring-[#304767]/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition"
          >
            <option value="">Select fellow...</option>
            {filteredFellows.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verified Fellow Section */}
      {verified && selectedFellow && (
        <>
          <div className="mt-10 bg-[#f9fafb] border border-emerald-400 rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="w-6 h-6 text-[#304767]" />
              <h3 className="text-lg font-bold text-slate-900">
                {selectedFellow.name}
              </h3>
            </div>
            <dl className="space-y-1 text-sm text-slate-700">
              <div>
                <dt className="font-medium inline">Coach: </dt>
                <dd className="inline">{selectedFellow.coachName}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Email: </dt>
                <dd className="inline">{selectedFellow.email}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Year: </dt>
                <dd className="inline">{selectedFellow.yearOfFellowship}</dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center gap-2 text-emerald-700 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Fellow verified — now select learners below.
            </div>
          </div>

          {/* Learners */}
          <section className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#304767]" /> Select Learners to
              Observe
            </h3>

            {fellowLearners.length === 0 ? (
              <p className="text-sm text-slate-500">
                No learners found for this fellow.
              </p>
            ) : (
              Object.entries(learnersByPhase).map(([phase, group]) => (
                <div key={phase} className="mb-6">
                  <div className="font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-md mb-2">
                    {phase} Phase
                  </div>
                  <ul className="pl-3 space-y-1">
                    {group.map((learner) => (
                      <label
                        key={learner.id}
                        className="flex items-center justify-between bg-white border border-slate-100 rounded-md px-3 py-2 hover:bg-slate-50 text-sm text-slate-700"
                      >
                        <span>
                          {learner.name}{" "}
                          <span className="text-xs text-slate-500">
                            ({learner.grade} — {learner.subject})
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedLearnerIds.includes(learner.id)}
                          onChange={() => toggleLearner(learner.id)}
                          className="accent-[#304767]"
                        />
                      </label>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </section>

          {/* Debug helper (optional) */}
          <pre className="text-xs text-slate-500 mt-3">
            fellowId: {fellowId}{"\n"}learners found: {fellowLearners.length}
          </pre>

          {/* Confirm Button */}
          {selectedLearners.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => onConfirm(selectedFellow, selectedLearners)}
                className="px-8 py-3 bg-[#304767] text-white rounded-md font-semibold hover:bg-[#22334a] transition"
              >
                Continue to Assessment ({selectedLearners.length} learners)
              </button>
            </div>
          )}
        </>
      )}

      {/* Email Verification Modal */}
      {showEmailModal && selectedFellow && (
        <EmailConfirmModal
          fellow={selectedFellow}
          onConfirm={() => {
            setVerified(true);
            setShowEmailModal(false);
            console.log("✅ Verified fellow:", selectedFellow.id);
          }}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   EMAIL CONFIRM MODAL
-------------------------------------------------------------------*/
interface EmailConfirmModalProps {
  fellow: Fellow;
  onConfirm: () => void;
  onClose: () => void;
}

function EmailConfirmModal({
  fellow,
  onConfirm,
  onClose,
}: EmailConfirmModalProps) {
  const [emailInput, setEmailInput] = useState("");

  const emailMatch =
    fellow.email &&
    emailInput.trim().toLowerCase() === fellow.email.trim().toLowerCase();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Confirm Fellow Email
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Please enter <span className="font-semibold">{fellow.name}</span>’s
          registered email address to continue.
        </p>

        <div className="relative mb-3">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter fellow email"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:border-[#304767] focus:ring-2 focus:ring-[#304767]/20 text-slate-900"
          />
        </div>

        {emailInput && !emailMatch && (
          <p className="text-sm text-red-600 mb-3">
            Email does not match this fellow’s record.
          </p>
        )}
        {emailMatch && (
          <p className="text-sm text-emerald-700 mb-3 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Verified successfully!
          </p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!emailMatch}
            className={`px-5 py-2 text-sm rounded-md font-semibold transition ${
              emailMatch
                ? "bg-[#304767] text-white hover:bg-[#22334a]"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
