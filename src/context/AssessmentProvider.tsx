"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// -------------------------------------------
// 🔹 Types
// -------------------------------------------

export interface Fellow {
  id: string;
  name: string;
  email: string; // Fellow’s own email (used for verification)
  coachName: string;
  yearOfFellowship: number;
}

export interface Learner {
  id: string;
  fellowId: string;
  name: string;
  grade: string;
  subject: string;
  phase: "Foundation" | "Intermediate" | "Senior" | "FET";
}

interface Session {
  term: string;
  fellowId: string;
  fellowName: string;
  coachName: string;
  email: string;
  yearOfFellowship: number;
  schoolName: string;
  schoolLevel: string;
}

interface AssessmentContextType {
  steps: { id: string; label: string }[];
  currentStep: string;
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (id: string) => void;

  // Session / Fellow
  session: Session | null;
  setSession: (s: Session) => void;
  fellows: Fellow[];
  selectFellow: (fellow: Fellow, term?: string) => void;

  // Learners
  learners: Learner[];
  setLearners: (l: Learner[]) => void;

  // Assessments
  assessments: Record<string, string>;
  updateAssessment: (
    learnerId: string,
    competencyId: string,
    value: string
  ) => void;

  // Evidences
  evidences: Record<string, string>;
  updateEvidence: (
    learnerId: string,
    competencyId: string,
    text: string
  ) => void;

  // Rubric Drawer
  openRubric: { phase: string | null; competencyId: string | null };
  openRubricDrawer: (phase: string, competencyId: string) => void;
  closeRubric: () => void;

  // Progress
  getProgressPercentage: () => number;
  getLearnerProgress: (learnerId: string) => {
    assessed: number;
    total: number;
    percentage: number;
  };
  getTierDistribution: () => { tier1: number; tier2: number; tier3: number };

  resetAssessment: () => void;
}

// -------------------------------------------
// 🔹 Static Config
// -------------------------------------------
const STEP_CONFIG = [
  { id: "intro", label: "Introduction" },
  { id: "select", label: "Select Fellow" },
  { id: "assess", label: "Assess Learners" },
  { id: "summary", label: "Review & Submit" },
];

// -------------------------------------------
// 🔹 Fellows (Pilot)
// -------------------------------------------
export const FELLOWS: Fellow[] = [
  {
    id: "fellow-001",
    name: "Lufuno Mudau",
    email: "lufuno.mudau@teachthenation.org",
    coachName: "Correta",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-002",
    name: "Victoria Mokhali",
    email: "victoria.mokhali@teachthenation.org",
    coachName: "Correta",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-003",
    name: "Vhuwavho Phophi",
    email: "vhuwavho.phophi@teachthenation.org",
    coachName: "Robin",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-004",
    name: "Lailaa Koopman",
    email: "lailaa.koopman@teachthenation.org",
    coachName: "Robin",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-005",
    name: "Kauthar Congo",
    email: "kauthar.congo@teachthenation.org",
    coachName: "Angie",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-006",
    name: "Siyamthanda Matiwane",
    email: "siyamthanda.matiwane@teachthenation.org",
    coachName: "Angie",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-007",
    name: "Mickayla Cummings",
    email: "mickayla.cummings@teachthenation.org",
    coachName: "Bruce",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-008",
    name: "Zikhona Ngcongo",
    email: "zikhona.ngcongo@teachthenation.org",
    coachName: "Bruce",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-009",
    name: "Nomsindisi Mbolekwa",
    email: "nomsindisi.mbolekwa@teachthenation.org",
    coachName: "Cindy",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-010",
    name: "Andrew Petersen",
    email: "andrew.petersen@teachthenation.org",
    coachName: "Cindy",
    yearOfFellowship: 2025,
  },
];

// -------------------------------------------
// 🔹 Learners per Fellow
// -------------------------------------------
export const LEARNERS: Learner[] = [
  // Foundation Phase (Example)
  {
    id: "learner-001",
    fellowId: "fellow-001",
    name: "Thabo Mokoena",
    grade: "Grade 3",
    subject: "Mathematics",
    phase: "Foundation",
  },
  {
    id: "learner-002",
    fellowId: "fellow-001",
    name: "Naledi Dlamini",
    grade: "Grade 2",
    subject: "English",
    phase: "Foundation",
  },

  // Intermediate Phase
  {
    id: "learner-003",
    fellowId: "fellow-002",
    name: "Sipho Khumalo",
    grade: "Grade 5",
    subject: "Natural Sciences",
    phase: "Intermediate",
  },
  {
    id: "learner-004",
    fellowId: "fellow-002",
    name: "Ayanda Nene",
    grade: "Grade 6",
    subject: "Life Skills",
    phase: "Intermediate",
  },

  // Senior Phase
  {
    id: "learner-005",
    fellowId: "fellow-003",
    name: "Lerato Mabuza",
    grade: "Grade 8",
    subject: "Geography",
    phase: "Senior",
  },
  {
    id: "learner-006",
    fellowId: "fellow-003",
    name: "Tebogo Nkosi",
    grade: "Grade 9",
    subject: "Mathematics",
    phase: "Senior",
  },

  // FET
  {
    id: "learner-007",
    fellowId: "fellow-004",
    name: "Kea Jacobs",
    grade: "Grade 11",
    subject: "English Home Language",
    phase: "FET",
  },
  {
    id: "learner-008",
    fellowId: "fellow-004",
    name: "Anele Sithole",
    grade: "Grade 12",
    subject: "Accounting",
    phase: "FET",
  },
];

// -------------------------------------------
// 🔹 Context Setup
// -------------------------------------------
const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(STEP_CONFIG[0].id);
  const [session, setSession] = useState<Session | null>(null);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [assessments, setAssessments] = useState<Record<string, string>>({});
  const [evidences, setEvidences] = useState<Record<string, string>>({});
  const [openRubric, setOpenRubric] = useState<{
    phase: string | null;
    competencyId: string | null;
  }>({ phase: null, competencyId: null });

  // 🔸 Step Navigation
  const currentStepIndex = STEP_CONFIG.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEP_CONFIG.length - 1;
  const goToStep = (id: string) =>
    STEP_CONFIG.some((s) => s.id === id) && setCurrentStep(id);
  const nextStep = () =>
    !isLastStep && setCurrentStep(STEP_CONFIG[currentStepIndex + 1].id);
  const previousStep = () =>
    !isFirstStep && setCurrentStep(STEP_CONFIG[currentStepIndex - 1].id);

  // 🔸 Fellow Selection
  const selectFellow = (fellow: Fellow, term = "Term 3") => {
    setSession({
      term,
      fellowId: fellow.id,
      fellowName: fellow.name,
      coachName: fellow.coachName,
      email: fellow.email,
      yearOfFellowship: fellow.yearOfFellowship,
      schoolName: "Not Assigned",
      schoolLevel: "Unknown",
    });
    const fellowLearners = LEARNERS.filter((l) => l.fellowId === fellow.id);
    setLearners(fellowLearners);
  };

  // 🔸 Assessments & Evidence
  const updateAssessment = (
    learnerId: string,
    competencyId: string,
    value: string
  ) =>
    setAssessments((p) => ({ ...p, [`${learnerId}_${competencyId}`]: value }));

  const updateEvidence = (
    learnerId: string,
    competencyId: string,
    text: string
  ) =>
    setEvidences((p) => ({
      ...p,
      [`${learnerId}_${competencyId}_evidence`]: text,
    }));

  // 🔸 Progress Helpers
  const getLearnerProgress = (learnerId: string) => {
    const keys = Object.keys(assessments).filter((k) =>
      k.startsWith(`${learnerId}_`)
    );
    const assessed = keys.filter((k) => assessments[k]).length;
    const total = keys.length || 5;
    return {
      assessed,
      total,
      percentage: total ? Math.round((assessed / total) * 100) : 0,
    };
  };

  const getProgressPercentage = () => {
    const total = Object.keys(assessments).length || learners.length * 5;
    const assessed = Object.values(assessments).filter((v) => v).length;
    return total ? Math.round((assessed / total) * 100) : 0;
  };

  const getTierDistribution = () => ({
    tier1: Object.values(assessments).filter((v) => v === "tier1").length,
    tier2: Object.values(assessments).filter((v) => v === "tier2").length,
    tier3: Object.values(assessments).filter((v) => v === "tier3").length,
  });

  const resetAssessment = () => {
    setAssessments({});
    setEvidences({});
    setSession(null);
    setLearners([]);
    setCurrentStep(STEP_CONFIG[0].id);
  };

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
        openRubric,
        openRubricDrawer: (phase, competencyId) =>
          setOpenRubric({ phase, competencyId }),
        closeRubric: () => setOpenRubric({ phase: null, competencyId: null }),
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
    throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}
