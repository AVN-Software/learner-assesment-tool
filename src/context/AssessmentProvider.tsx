"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { Learner } from "@/types/learner";

// -------------------------------------------
// 🔹 Types
// -------------------------------------------
interface Fellow {
  id: string;
  name: string;
  coachName: string;
  coachEmail: string;
  yearOfFellowship: number;
}

interface Session {
  term: string;
  fellowId: string;
  fellowName: string;
  coachName: string;
  coachEmail: string;
  yearOfFellowship: number;
  schoolName: string;
  schoolLevel: string;
}

interface AssessmentContextType {
  // Steps
  steps: { id: string; label: string }[];
  currentStep: string;
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (id: string) => void;

  // Session / Fellow selection
  session: Session | null;
  setSession: (s: Session) => void;
  fellows: Fellow[];
  selectFellow: (fellow: Fellow, term?: string) => void;

  // Learners
  learners: Learner[];
  setLearners: (l: Learner[]) => void;

  // Assessments (tier scores)
  assessments: Record<string, string>;
  updateAssessment: (
    learnerId: string,
    competencyId: string,
    value: string
  ) => void;

  // Evidences (text notes)
  evidences: Record<string, string>;
  updateEvidence: (
    learnerId: string,
    competencyId: string,
    text: string
  ) => void;

  // Progress + summaries
  getProgressPercentage: () => number;
  getLearnerProgress: (learnerId: string) => {
    assessed: number;
    total: number;
    percentage: number;
  };
  getTierDistribution: () => { tier1: number; tier2: number; tier3: number };

  // Reset
  resetAssessment: () => void;
}

// -------------------------------------------
// 🔹 Static Step Config
// -------------------------------------------
const STEP_CONFIG = [
  { id: "intro", label: "Introduction" },
  { id: "select", label: "Select Fellow" },
  { id: "assess", label: "Assess Learners" },
  { id: "summary", label: "Review & Submit" },
];

// -------------------------------------------
// 🔹 Fixed Fellows List
// -------------------------------------------
const FELLOWS: Fellow[] = [
  // Correta
  {
    id: "fellow-001",
    name: "Lufuno Mudau",
    coachName: "Correta",
    coachEmail: "correta@teachthenation.org",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-002",
    name: "Victoria Mokhali",
    coachName: "Correta",
    coachEmail: "correta@teachthenation.org",
    yearOfFellowship: 2025,
  },
  // Robin
  {
    id: "fellow-003",
    name: "Vhuwavho Phophi",
    coachName: "Robin",
    coachEmail: "robin@teachthenation.org",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-004",
    name: "Lailaa Koopman",
    coachName: "Robin",
    coachEmail: "robin@teachthenation.org",
    yearOfFellowship: 2025,
  },
  // Angie
  {
    id: "fellow-005",
    name: "Kauthar Congo",
    coachName: "Angie",
    coachEmail: "angie@teachthenation.org",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-006",
    name: "Siyamthanda Matiwane",
    coachName: "Angie",
    coachEmail: "angie@teachthenation.org",
    yearOfFellowship: 2025,
  },
  // Bruce
  {
    id: "fellow-007",
    name: "Mickayla Cummings",
    coachName: "Bruce",
    coachEmail: "bruce@teachthenation.org",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-008",
    name: "Zikhona Ngcongo",
    coachName: "Bruce",
    coachEmail: "bruce@teachthenation.org",
    yearOfFellowship: 2025,
  },
  // Cindy
  {
    id: "fellow-009",
    name: "Nomsindisi Mbolekwa",
    coachName: "Cindy",
    coachEmail: "cindy@teachthenation.org",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-010",
    name: "Andrew Petersen",
    coachName: "Cindy",
    coachEmail: "cindy@teachthenation.org",
    yearOfFellowship: 2025,
  },
];

// -------------------------------------------
// 🔹 Context Setup
// -------------------------------------------
const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

// -------------------------------------------
// 🔹 Provider Component
// -------------------------------------------
export function AssessmentProvider({ children }: { children: ReactNode }) {
  // Steps
  const [currentStep, setCurrentStep] = useState(STEP_CONFIG[0].id);

  // Core data
  const [session, setSession] = useState<Session | null>(null);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [assessments, setAssessments] = useState<Record<string, string>>({});
  const [evidences, setEvidences] = useState<Record<string, string>>({});

  // -------------------------------------------
  // 🔸 Local Storage Sync
  // -------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("assessment_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentStep(parsed.currentStep || STEP_CONFIG[0].id);
        setSession(parsed.session || null);
        setLearners(parsed.learners || []);
        setAssessments(parsed.assessments || {});
        setEvidences(parsed.evidences || {});
      } catch {
        console.warn("Invalid assessment_state found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    const state = { currentStep, session, learners, assessments, evidences };
    localStorage.setItem("assessment_state", JSON.stringify(state));
  }, [currentStep, session, learners, assessments, evidences]);

  // -------------------------------------------
  // 🔸 Step Navigation
  // -------------------------------------------
  const currentStepIndex = STEP_CONFIG.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEP_CONFIG.length - 1;

  const goToStep = (id: string) => {
    if (STEP_CONFIG.some((s) => s.id === id)) setCurrentStep(id);
  };

  const nextStep = () => {
    if (!isLastStep) setCurrentStep(STEP_CONFIG[currentStepIndex + 1].id);
  };

  const previousStep = () => {
    if (!isFirstStep) setCurrentStep(STEP_CONFIG[currentStepIndex - 1].id);
  };

  // -------------------------------------------
  // 🔸 Fellow Selection
  // -------------------------------------------
  const selectFellow = (fellow: Fellow, term = "Term 3") => {
    setSession({
      term,
      fellowId: fellow.id,
      fellowName: fellow.name,
      coachName: fellow.coachName,
      coachEmail: fellow.coachEmail,
      yearOfFellowship: fellow.yearOfFellowship,
      schoolName: "Not Assigned",
      schoolLevel: "Unknown",
    });
    setCurrentStep("assess");
  };

  // -------------------------------------------
  // 🔸 Assessment Logic
  // -------------------------------------------
  const updateAssessment = (
    learnerId: string,
    competencyId: string,
    value: string
  ) => {
    setAssessments((prev) => ({
      ...prev,
      [`${learnerId}_${competencyId}`]: value,
    }));
  };

  const updateEvidence = (
    learnerId: string,
    competencyId: string,
    text: string
  ) => {
    const key = `${learnerId}_${competencyId}_evidence`;
    setEvidences((prev) => ({ ...prev, [key]: text }));
  };

  // -------------------------------------------
  // 🔸 Progress + Stats
  // -------------------------------------------
  const getLearnerProgress = (learnerId: string) => {
    const keys = Object.keys(assessments).filter((k) =>
      k.startsWith(`${learnerId}_`)
    );
    const assessed = keys.filter((k) => assessments[k] !== "").length;
    const total = keys.length || 5;
    return {
      assessed,
      total,
      percentage: total ? Math.round((assessed / total) * 100) : 0,
    };
  };

  const getProgressPercentage = () => {
    const total = Object.keys(assessments).length || learners.length * 5;
    const assessed = Object.values(assessments).filter((v) => v !== "").length;
    return total ? Math.round((assessed / total) * 100) : 0;
  };

  const getTierDistribution = () => ({
    tier1: Object.values(assessments).filter((v) => v === "tier1").length,
    tier2: Object.values(assessments).filter((v) => v === "tier2").length,
    tier3: Object.values(assessments).filter((v) => v === "tier3").length,
  });

  // -------------------------------------------
  // 🔸 Reset
  // -------------------------------------------
  const resetAssessment = () => {
    setAssessments({});
    setEvidences({});
    setSession(null);
    setLearners([]);
    setCurrentStep(STEP_CONFIG[0].id);
    localStorage.removeItem("assessment_state");
  };

  // -------------------------------------------
  // 🔹 Provide Context
  // -------------------------------------------
  return (
    <AssessmentContext.Provider
      value={{
        steps: STEP_CONFIG,
        currentStep,
        currentStepIndex,
        isFirstStep,
        isLastStep,
        nextStep,
        previousStep,
        goToStep,
        session,
        setSession,
        fellows: FELLOWS,
        selectFellow,
        learners,
        setLearners,
        assessments,
        updateAssessment,
        evidences,
        updateEvidence,
        getProgressPercentage,
        getLearnerProgress,
        getTierDistribution,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

// -------------------------------------------
// 🔹 Hook
// -------------------------------------------
export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx)
    throw new Error("useAssessment must be used inside AssessmentProvider");
  return ctx;
}
