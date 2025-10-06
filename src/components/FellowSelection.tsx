"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import { CheckCircle2, Mail, GraduationCap, X } from "lucide-react";
import { useAssessment } from "@/context/AssessmentProvider";

import { MOCK_FELLOWS, MOCK_LEARNERS } from "@/data/SAMPLE_DATA";
import { Phase, Term } from "@/types/core";
import { Fellow, Learner } from "@/types/people";
import { EmailConfirmModal } from "./EmailConfirmModal";
import { FormSelect } from "./form";



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
