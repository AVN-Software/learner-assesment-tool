"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import { CheckCircle2, Mail, GraduationCap, X } from "lucide-react";
import { useAssessment } from "@/context/AssessmentProvider";
import { Fellow, Learner, Phase } from "@/types/assessment";
import { MOCK_FELLOWS, MOCK_LEARNERS } from "@/data/SAMPLE_DATA";

/* ---------------- Types ---------------- */
type Term = "Term 1" | "Term 2" | "Term 3" | "Term 4";

/* ---------------------------------------------------------------------------
   FellowSelection (declared as a component)
--------------------------------------------------------------------------- */
const FellowSelection: React.FC = () => {
  const { setSelectedFellow, setSelectedLearners, nextStep } = useAssessment();

  // local state
  const [term, setTerm] = useState<Term | "">("");
  const [coach, setCoach] = useState<string>("");
  const [fellowId, setFellowId] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [selectedLearnerIds, setSelectedLearnerIds] = useState<string[]>([]);

  // derived data
  const coaches = useMemo<string[]>(
    () => Array.from(new Set(MOCK_FELLOWS.map((f: Fellow) => f.coachName))),
    []
  );

  const filteredFellows = useMemo<Fellow[]>(
    () =>
      coach ? MOCK_FELLOWS.filter((f: Fellow) => f.coachName === coach) : [],
    [coach]
  );

  const selectedFellow = useMemo<Fellow | null>(
    () => MOCK_FELLOWS.find((f: Fellow) => f.id === fellowId) ?? null,
    [fellowId]
  );

  const fellowLearners = useMemo<Learner[]>(
    () => MOCK_LEARNERS.filter((l: Learner) => l.fellowId === fellowId),
    [fellowId]
  );

  // strict phase map
  const learnersByPhase = useMemo(() => {
    const map: Record<Phase | "Unassigned", Learner[]> = {
      Foundation: [],
      Intermediate: [],
      Senior: [],
      FET: [],
      Unassigned: [],
    };
    for (const learner of fellowLearners) {
      const key: Phase | "Unassigned" = (learner.phase ?? "Unassigned") as
        | Phase
        | "Unassigned";
      map[key].push(learner);
    }
    return map;
  }, [fellowLearners]) satisfies Record<Phase | "Unassigned", Learner[]>;

  // helpers
  const toggleLearner = (id: string) => {
    setSelectedLearnerIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedLearners = useMemo<Learner[]>(
    () => fellowLearners.filter((l) => selectedLearnerIds.includes(l.id)),
    [fellowLearners, selectedLearnerIds]
  );

  const handleConfirm = () => {
    if (selectedFellow && selectedLearners.length > 0) {
      setSelectedFellow(selectedFellow);
      setSelectedLearners(selectedLearners);
      nextStep();
    }
  };

  // render
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-10 relative">
      <header className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Fellow Selection
        </h2>
        <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-[600px] mx-auto">
          Select your term, coach, and fellow to verify before continuing to
          learner assessment.
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        {/* Term */}
        <FormSelect
          label="Academic Term"
          value={term}
          onChange={(e) => setTerm(e.target.value as Term | "")}
          options={["Term 1", "Term 2", "Term 3", "Term 4"]}
        />

        {/* Coach */}
        <FormSelect
          label="Coach Name"
          value={coach}
          onChange={(e) => {
            setCoach(e.target.value);
            setFellowId("");
            setVerified(false);
            setSelectedLearnerIds([]);
          }}
          options={coaches}
        />

        {/* Fellow */}
        <FormSelect
          label="Fellow (Teacher)"
          value={fellowId}
          onChange={(e) => {
            const newId = e.target.value;
            setFellowId(newId);
            setVerified(false);
            setSelectedLearnerIds([]);
            if (newId) setTimeout(() => setShowEmailModal(true), 50);
          }}
          options={filteredFellows.map((f) => ({ label: f.name, value: f.id }))}
          disabled={!coach}
        />
      </div>

      {verified && selectedFellow && (
        <>
          <FellowDetails fellow={selectedFellow} />

          <section className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            {Object.entries(learnersByPhase).map(([phase, learners]) => (
              <div key={phase} className="mb-6">
                <div className="font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-md mb-2">
                  {phase} Phase
                </div>
                <ul className="pl-3 space-y-1">
                  {learners.map((l) => (
                    <label
                      key={l.id}
                      className="flex items-center justify-between bg-white border border-slate-100 rounded-md px-3 py-2 hover:bg-slate-50 text-sm"
                    >
                      <span>
                        {l.name}{" "}
                        <span className="text-xs text-slate-500">
                          ({l.grade} — {l.subject})
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedLearnerIds.includes(l.id)}
                        onChange={() => toggleLearner(l.id)}
                        className="accent-[#304767]"
                      />
                    </label>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {selectedLearners.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleConfirm}
                className="px-8 py-3 bg-[#304767] text-white rounded-md font-semibold hover:bg-[#22334a]"
              >
                Continue to Assessment ({selectedLearners.length} learners)
              </button>
            </div>
          )}
        </>
      )}

      {showEmailModal && selectedFellow && (
        <EmailConfirmModal
          fellow={selectedFellow}
          onConfirm={() => {
            setVerified(true);
            setShowEmailModal(false);
          }}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
};

export default FellowSelection;

/* ---------------------------------------------------------------------------
   Small subcomponents (also declared as components)
--------------------------------------------------------------------------- */

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[] | { label: string; value: string }[];
  disabled?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:border-[#304767] disabled:bg-slate-100 disabled:cursor-not-allowed"
      >
        <option value="">Select...</option>
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
};

const FellowDetails: React.FC<{ fellow: Fellow }> = ({ fellow }) => {
  return (
    <div className="mt-8 bg-[#f9fafb] border border-emerald-400 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <GraduationCap className="w-6 h-6 text-[#304767]" />
        <h3 className="text-lg font-bold text-slate-900">{fellow.name}</h3>
      </div>
      <dl className="space-y-1 text-sm text-slate-700">
        <div>
          <dt className="font-medium inline">Coach: </dt>
          <dd className="inline">{fellow.coachName}</dd>
        </div>
        <div>
          <dt className="font-medium inline">Email: </dt>
          <dd className="inline">{fellow.email}</dd>
        </div>
        <div>
          <dt className="font-medium inline">Year: </dt>
          <dd className="inline">{fellow.yearOfFellowship}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center gap-2 text-emerald-700 text-sm font-medium">
        <CheckCircle2 className="w-5 h-5" />
        Fellow verified — select learners below.
      </div>
    </div>
  );
};

interface EmailConfirmModalProps {
  fellow: Fellow;
  onConfirm: () => void;
  onClose: () => void;
}

const EmailConfirmModal: React.FC<EmailConfirmModalProps> = ({
  fellow,
  onConfirm,
  onClose,
}) => {
  const [emailInput, setEmailInput] = useState<string>("");

  const emailMatch =
    emailInput.trim().toLowerCase() === fellow.email.trim().toLowerCase();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Confirm Fellow Email
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Enter <span className="font-semibold">{fellow.name}</span>’s
          registered email to continue.
        </p>

        <div className="relative mb-3">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter fellow email"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:border-[#304767]"
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
            className={`px-5 py-2 text-sm rounded-md font-semibold ${
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
};
