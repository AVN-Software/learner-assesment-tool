"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { LucideIcon } from "lucide-react";

/* ============================================================================
   TYPES (single source of truth)
=========================================================================== */

/* 📘 PHASES & TERMS */
export type Phase = "Foundation" | "Intermediate" | "Senior" | "FET";
export type Term = "Term 1" | "Term 2" | "Term 3" | "Term 4";

/* 👩‍🏫 FELLOWS / LEARNERS */
export interface Fellow {
  id: string;
  name: string;
  email: string;
  coachName: string;
  yearOfFellowship: number;
}
export interface Learner {
  id: string;
  fellowId: string;
  name: string;
  grade: string;
  subject: string;
  phase: Phase;
}

/* 🧩 COMPETENCIES */
export type CompetencyId =
  | "motivation"
  | "teamwork"
  | "analytical"
  | "curiosity"
  | "leadership";

export interface Competency {
  id: CompetencyId;
  name: string;
  icon: LucideIcon;
}

/* 🎯 TIERS */
export type TierValue = "" | "tier1" | "tier2" | "tier3";
export type TierKey = Exclude<TierValue, "">;

export const TIER_META: Record<TierKey, { label: string; color: string }> = {
  tier1: { label: "Emerging", color: "amber" },
  tier2: { label: "Developing", color: "blue" },
  tier3: { label: "Advanced", color: "emerald" },
};

/* 🧮 ASSESSMENT STRUCTURE */
export type AssessmentMap = Record<string, TierValue>;
export type EvidenceMap = Record<string, string>;

/** Consistent keys used across the app */
export const keyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}`;
export const eKeyFor = (learnerId: string, compId: CompetencyId) =>
  `${learnerId}_${compId}_evidence`;

/* 🧭 APP FLOW STEPS */
export const STEPS = ["intro", "select", "assess", "summary"] as const;
export type Step = (typeof STEPS)[number];

/* ============================================================================
   CONTEXT CONTRACT
=========================================================================== */
export interface CompletionStats {
  totalCells: number; // learners * competencies
  completedCells: number; // cells with a tier selected
  missingEvidence: number; // cells with tier but no evidence
}

export interface AssessmentContextType {
  // flow
  currentStep: Step;
  goToStep: (s: Step) => void;
  nextStep: () => void;
  previousStep: () => void;

  // selection
  term: Term | "";
  setTerm: (t: Term | "") => void;

  selectedCoach: string;
  setSelectedCoach: (name: string) => void;

  selectedFellow: Fellow | null;
  setSelectedFellow: (f: Fellow | null) => void;

  selectedLearners: Learner[];
  setSelectedLearners: (l: Learner[]) => void;

  // assessment data
  assessments: AssessmentMap;
  setAssessments: (a: AssessmentMap) => void;

  evidences: EvidenceMap;
  setEvidences: (e: EvidenceMap) => void;

  // ergonomic updaters
  updateAssessment: (
    learnerId: string,
    compId: CompetencyId,
    tier: TierValue
  ) => void;

  updateEvidence: (
    learnerId: string,
    compId: CompetencyId,
    text: string
  ) => void;

  // derived
  completion: CompletionStats;

  // utils
  resetAssessmentState: () => void;
}

/* ============================================================================
   CONTEXT + PROVIDER + HOOK
=========================================================================== */
const AssessmentContext = createContext<AssessmentContextType | null>(null);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /* ---------------- Step Navigation ---------------- */
  const [currentStep, setCurrentStep] = useState<Step>("intro");
  const stepIndex = STEPS.indexOf(currentStep);

  const goToStep = useCallback((s: Step) => setCurrentStep(s), []);
  const nextStep = useCallback(() => {
    if (stepIndex < STEPS.length - 1) setCurrentStep(STEPS[stepIndex + 1]);
  }, [stepIndex]);
  const previousStep = useCallback(() => {
    if (stepIndex > 0) setCurrentStep(STEPS[stepIndex - 1]);
  }, [stepIndex]);

  /* ---------------- Selection ---------------- */
  const [term, setTerm] = useState<Term | "">("");
  const [selectedCoach, setSelectedCoach] = useState<string>("");
  const [selectedFellow, setSelectedFellow] = useState<Fellow | null>(null);
  const [selectedLearners, setSelectedLearners] = useState<Learner[]>([]);

  /* ---------------- Assessment Data ---------------- */
  const [assessments, setAssessments] = useState<AssessmentMap>({});
  const [evidences, setEvidences] = useState<EvidenceMap>({});

  /* ---------------- Ergonomic Updaters ---------------- */
  const updateAssessment = useCallback(
    (learnerId: string, compId: CompetencyId, tier: TierValue) => {
      setAssessments((prev) => ({
        ...prev,
        [keyFor(learnerId, compId)]: tier,
      }));
    },
    []
  );

  const updateEvidence = useCallback(
    (learnerId: string, compId: CompetencyId, text: string) => {
      setEvidences((prev) => ({ ...prev, [eKeyFor(learnerId, compId)]: text }));
    },
    []
  );

  const resetAssessmentState = useCallback(() => {
    setAssessments({});
    setEvidences({});
  }, []);

  /* ---------------- Derived: Completion Stats ----------------
     totalCells = learners * 5 (competencies)
     completedCells = count of non-empty tiers
     missingEvidence = hasTier && noEvidence
  ------------------------------------------------------------ */
  const completion = useMemo<CompletionStats>(() => {
    const COMP_COUNT = 5; // motivation, teamwork, analytical, curiosity, leadership
    const totalCells = selectedLearners.length * COMP_COUNT;

    let completedCells = 0;
    let missingEvidence = 0;

    for (const l of selectedLearners) {
      for (const compId of [
        "motivation",
        "teamwork",
        "analytical",
        "curiosity",
        "leadership",
      ] as CompetencyId[]) {
        const k = keyFor(l.id, compId);
        const ek = eKeyFor(l.id, compId);
        const tier = assessments[k];
        if (tier) {
          completedCells += 1;
          if (!evidences[ek]) missingEvidence += 1;
        }
      }
    }

    return { totalCells, completedCells, missingEvidence };
  }, [selectedLearners, assessments, evidences]);

  /* ---------------- Context Value ---------------- */
  const value: AssessmentContextType = {
    // flow
    currentStep,
    goToStep,
    nextStep,
    previousStep,

    // selection
    term,
    setTerm,
    selectedCoach,
    setSelectedCoach,
    selectedFellow,
    setSelectedFellow,
    selectedLearners,
    setSelectedLearners,

    // data
    assessments,
    setAssessments,
    evidences,
    setEvidences,

    // helpers
    updateAssessment,
    updateEvidence,

    // derived
    completion,

    // utils
    resetAssessmentState,
  };

  /* ---------------- Optional global progress bar ---------------- */
  const progressPct = useMemo(() => {
    if (STEPS.length <= 1) return 0;
    return Math.round((stepIndex / (STEPS.length - 1)) * 100);
  }, [stepIndex]);

  return (
    <AssessmentContext.Provider value={value}>
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 z-50">
        <div
          className="h-full bg-[#304767] transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = (): AssessmentContextType => {
  const ctx = useContext(AssessmentContext);
  if (!ctx)
    throw new Error("useAssessment() must be used within <AssessmentProvider>");
  return ctx;
};
