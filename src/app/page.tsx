"use client";

import { useEffect, useMemo, useState } from "react";
import Instructions from "@/components/Instructions";
import FellowSelection from "@/components/FellowSelection";

import SubmissionSummary from "@/components/SubmissionSummary";
import DownloadRubricButton from "@/components/DownloadButton";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  UserRoundSearch,
  NotebookPen,
  ClipboardCheck,
} from "lucide-react";
import AssessmentTable from "@/components/AssesmentTable";
import { Phase } from "@/components/RubricDisplay";

/* ---------------------------------------------------------------------------
   🧩 TYPE DEFINITIONS
--------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------
   🔹 STATIC CONFIG
--------------------------------------------------------------------------- */

const STEP_CONFIG = [
  { id: "intro", label: "Introduction" },
  { id: "select", label: "Select Fellow" },
  { id: "assess", label: "Assess Learners" },
  { id: "summary", label: "Review & Submit" },
] as const;

/* ---------------------------------------------------------------------------
   🔹 Fellows (Pilot)
--------------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------------
   🔹 Learners per Fellow
--------------------------------------------------------------------------- */

export const LEARNERS: Learner[] = [
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

/** Represents a Fellow being assessed */
export interface Fellow {
  id: string;
  name: string;
  email: string;
  coachName: string;
  yearOfFellowship: number;
}

/** Represents a Learner assigned to a Fellow */
export interface Learner {
  id: string;
  fellowId: string;
  name: string;
  grade: string;
  subject: string;
  phase: Phase;
}

/** Tier levels for competency assessment */
export type TierValue = "" | "tier1" | "tier2" | "tier3";
export type TierKey = Exclude<TierValue, "">;

/** Competency definition used in the rubric */
export interface Competency {
  id: "motivation" | "teamwork" | "analytical" | "curiosity" | "leadership";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** Record of all assessments keyed by `learnerId_competencyId` */
export type AssessmentMap = Record<string, TierValue>;

/** Record of all evidence notes keyed by `learnerId_competencyId_evidence` */
export type EvidenceMap = Record<string, string>;

/** Step identifiers in the app workflow */
export const STEPS = ["intro", "select", "assess", "summary"] as const;
export type Step = (typeof STEPS)[number];

/** Metadata for each step (UI + labels) */
export const STEP_META: Record<
  Step,
  {
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  intro: {
    label: "Instructions",
    desc: "Review assessment guidance before starting.",
    icon: NotebookPen,
  },
  select: {
    label: "Choose Fellow",
    desc: "Select the fellow and class you’re assessing.",
    icon: UserRoundSearch,
  },
  assess: {
    label: "Assess Learners",
    desc: "Complete the rubric and record tier ratings.",
    icon: ClipboardCheck,
  },
  summary: {
    label: "Review & Submit",
    desc: "Check all entries before submitting.",
    icon: CheckCircle2,
  },
};

/** Props expected by the AssessmentTable */
export interface AssessmentTableProps {
  fellow: Fellow | null;
  learners: Learner[];
  assessments: AssessmentMap;
  evidences: EvidenceMap;
  onUpdateAssessments: (next: AssessmentMap) => void;
  onUpdateEvidences: (next: EvidenceMap) => void;
  onComplete: () => void;
}

/** Props expected by SubmissionSummary */
export interface SubmissionSummaryProps {
  learners: Learner[];
  assessments: AssessmentMap;
  evidences?: EvidenceMap;
  onSubmit?: (submission: {
    assessments: AssessmentMap;
    evidences: EvidenceMap;
  }) => Promise<void> | void;
}

/* ---------------------------------------------------------------------------
   ⚙️ COMPONENT IMPLEMENTATION
--------------------------------------------------------------------------- */
export default function AssessmentApp() {
  const [currentStep, setCurrentStep] = useState<Step>("intro");
  const [selectedFellow, setSelectedFellow] = useState<Fellow | null>(null);
  const [selectedLearners, setSelectedLearners] = useState<Learner[]>([]);

  // Centralized state for all assessment data
  const [assessments, setAssessments] = useState<AssessmentMap>({});
  const [evidences, setEvidences] = useState<EvidenceMap>({});

  /* ---------------- Navigation logic ---------------- */
  const stepIndex = STEPS.indexOf(currentStep);
  const totalSteps = STEPS.length;
  const pct = Math.round((stepIndex / (totalSteps - 1)) * 100);

  const goToStep = (s: Step) => setCurrentStep(s);
  const nextStep = () => {
    if (stepIndex < totalSteps - 1) setCurrentStep(STEPS[stepIndex + 1]);
  };
  const previousStep = () => {
    if (stepIndex > 0) setCurrentStep(STEPS[stepIndex - 1]);
  };

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "intro":
        return true;
      case "select":
        return !!selectedFellow && selectedLearners.length > 0;
      case "assess":
        return selectedLearners.length > 0;
      default:
        return false;
    }
  }, [currentStep, selectedFellow, selectedLearners]);

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < totalSteps - 1 && canProceed;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && canGoNext) nextStep();
      else if (e.key === "ArrowLeft" && canGoBack) previousStep();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canGoNext, canGoBack]);

  /* ---------------- Step content ---------------- */
  const Body = () => {
    switch (currentStep) {
      case "intro":
        return <Instructions />;

      case "select":
        return (
          <FellowSelection
            fellows={FELLOWS}
            allLearners={LEARNERS}
            coaches={[...new Set(FELLOWS.map((f) => f.coachName))]}
            onConfirm={(fellow, learners) => {
              setSelectedFellow(fellow);
              setSelectedLearners(learners);
              nextStep();
            }}
          />
        );

      case "assess":
        return (
          <AssessmentTable
            fellow={selectedFellow}
            learners={selectedLearners}
            assessments={assessments}
            evidences={evidences}
            onUpdateAssessments={setAssessments}
            onUpdateEvidences={setEvidences}
            onComplete={() => nextStep()}
          />
        );

      case "summary":
        return (
          <SubmissionSummary
            learners={selectedLearners}
            assessments={assessments}
            evidences={evidences}
            onSubmit={async ({ assessments, evidences }) => {
              console.log("Final submission payload:", {
                assessments,
                evidences,
              });
              alert("Assessment submitted successfully!");
            }}
          />
        );

      default:
        return null;
    }
  };

  /* ---------------- UI rendering ---------------- */
  return (
    <main className="min-h-screen w-full bg-[#eee] font-[Poppins,sans-serif] flex flex-col md:items-center md:justify-center">
      <section className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[75vh] w-full max-w-[1200px] md:max-w-[1400px] mx-auto my-8">
        {/* Header */}
        <header className="px-4 sm:px-6 pt-6 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              TTN Fellowship — Learner Observation
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {STEP_META[currentStep].label} • Step {stepIndex + 1} of{" "}
              {totalSteps}
            </p>
          </div>
          <DownloadRubricButton />
        </header>

        {/* Stepper */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-y border-slate-200 overflow-x-auto">
          <div className="px-4 py-4 min-w-[600px] sm:min-w-0">
            <div className="relative">
              <div className="h-1.5 w-full rounded-full bg-slate-200" />
              <div
                className="absolute left-0 top-0 h-1.5 rounded-full bg-[#304767] transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
              <div
                className="relative mt-4 grid"
                style={{
                  gridTemplateColumns: `repeat(${totalSteps}, minmax(0,1fr))`,
                }}
              >
                {STEPS.map((s, i) => {
                  const active = i === stepIndex;
                  const complete = i < stepIndex;
                  return (
                    <button
                      key={s}
                      onClick={() => goToStep(s)}
                      className="group flex flex-col items-center gap-1 focus:outline-none"
                    >
                      <span
                        className={[
                          "flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition",
                          active
                            ? "bg-[#304767] border-[#304767] text-white shadow"
                            : complete
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-slate-400 text-slate-500",
                        ].join(" ")}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={[
                          "text-[11px] sm:text-xs font-medium truncate max-w-[160px]",
                          active
                            ? "text-slate-900"
                            : "text-slate-500 group-hover:text-slate-700",
                        ].join(" ")}
                      >
                        {STEP_META[s].label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 py-6">
          <div className="mx-auto w-full max-w-[1100px]">
            <Body />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 p-4 flex flex-wrap gap-3 items-center justify-between">
          <button
            onClick={previousStep}
            disabled={!canGoBack}
            className={`h-10 px-4 w-full sm:w-24 text-sm rounded-md font-medium transition border ${
              canGoBack
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-4 h-4 inline-block mr-1" />
            Back
          </button>

          <div className="text-xs text-slate-500 truncate flex-1 text-center sm:text-left">
            {currentStep === "intro" && "Review the guide, then continue."}
            {currentStep === "select" &&
              (selectedFellow
                ? `Selected: ${selectedFellow.name}`
                : "Pick your fellow and learners.")}
            {currentStep === "assess" &&
              (selectedLearners.length === 0
                ? "No learners selected."
                : "Record tiers & evidence.")}
            {currentStep === "summary" && "Review and submit your assessment."}
          </div>

          <button
            onClick={nextStep}
            disabled={!canGoNext}
            className={`h-10 px-4 w-full sm:w-32 text-sm rounded-md font-semibold transition flex items-center justify-center gap-2 ${
              canGoNext
                ? "bg-[#0075ff] text-white hover:bg-[#005de0] active:scale-95"
                : "bg-slate-300 text-white cursor-not-allowed"
            }`}
          >
            {currentStep === "intro"
              ? "Start"
              : currentStep === "summary"
              ? "Done"
              : "Next Step"}
            {canGoNext && <ChevronRight className="w-4 h-4" />}
          </button>
        </footer>
      </section>
    </main>
  );
}
