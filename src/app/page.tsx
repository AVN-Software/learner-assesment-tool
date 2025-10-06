"use client";

import { useEffect, useMemo } from "react";
import { useAssessment } from "@/context/AssessmentProvider";

import Instructions from "@/components/Instructions";
import FellowSelection from "@/components/FellowSelection";
import AssessmentTable from "@/components/AssesmentTable";
import SubmissionSummary from "@/components/SubmissionSummary";

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  UserRoundSearch,
  NotebookPen,
  ClipboardCheck,
} from "lucide-react";
import DownloadRubricButton from "@/components/DownloadButton";

const STEPS = ["intro", "select", "assess", "summary"] as const;
type Step = (typeof STEPS)[number];

const STEP_META: Record<
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

export default function AssessmentApp() {
  const {
    currentStep,
    steps,
    nextStep,
    previousStep,
    goToStep,
    session,
    learners,
  } = useAssessment();

  const stepIndex = steps.findIndex((s) => s.id === currentStep);
  const totalSteps = steps.length;
  const pct = Math.max(
    0,
    Math.min(100, Math.round((stepIndex / (totalSteps - 1)) * 100))
  );

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "intro":
        return true;
      case "select":
        return !!session?.fellowId;
      case "assess":
        return true; // allow partials
      default:
        return false;
    }
  }, [currentStep, session?.fellowId]);

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < totalSteps - 1 && canProceed;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && canGoNext) nextStep();
      else if (e.key === "ArrowLeft" && canGoBack) previousStep();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canGoNext, canGoBack, nextStep, previousStep]);

  const Body = () => {
    switch (currentStep) {
      case "intro":
        return <Instructions />;
      case "select":
        return <FellowSelection />;
      case "assess":
        return <AssessmentTable />;
      case "summary":
        return <SubmissionSummary />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#eee] font-[Poppins,sans-serif]">
      {/* Centered single card; content width constrained so it doesn't hug full width */}
      <div className="mx-auto max-w-[1400px] px-4 py-8">
        <section className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[75vh] flex flex-col">
          {/* Header row: title + rubric action */}
          <header className="px-6 pt-6 pb-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                TTN Fellowship — Learner Observation
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {STEP_META[currentStep as Step]?.label} • Step {stepIndex + 1}{" "}
                of {totalSteps}
              </p>
            </div>
            <div className="shrink-0">
              <DownloadRubricButton />
            </div>
          </header>

          {/* Horizontal Stepper (sticky within the card) */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-y border-slate-200">
            <div className="px-6 py-4">
              <div className="relative">
                {/* Track */}
                <div className="h-1.5 w-full rounded-full bg-slate-200" />
                {/* Fill */}
                <div
                  className="absolute left-0 top-0 h-1.5 rounded-full bg-[#304767] transition-[width] duration-500"
                  style={{ width: `${pct}%` }}
                />
                {/* Nodes */}
                <div
                  className="relative mt-4 grid"
                  style={{
                    gridTemplateColumns: `repeat(${totalSteps}, minmax(0,1fr))`,
                  }}
                >
                  {steps.map((s, i) => {
                    const active = i === stepIndex;
                    const complete = i < stepIndex;
                    return (
                      <button
                        key={s.id}
                        onClick={() => goToStep(s.id)}
                        className="group flex flex-col items-center gap-1 focus:outline-none"
                        aria-current={active ? "step" : undefined}
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
                          title={STEP_META[s.id as Step].label}
                        >
                          {STEP_META[s.id as Step].label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Body: content width constrained; tables can scroll horizontally */}
          <div className="flex-1 overflow-auto px-6 py-6">
            <div className="mx-auto w-full max-w-[1200px]">
              {/* Let very wide components (like the matrix) scroll horizontally */}
              <div className="max-w-full overflow-x-auto">
                <Body />
              </div>
            </div>
          </div>

          {/* Footer controls */}
          <footer className="border-t border-slate-200 p-4 flex items-center justify-between">
            <button
              onClick={() => previousStep()}
              disabled={!canGoBack}
              className={[
                "h-10 w-24 text-sm rounded-md font-medium transition border",
                canGoBack
                  ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                  : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed",
              ].join(" ")}
            >
              Back
            </button>

            <div className="text-xs text-slate-500 truncate px-3">
              {currentStep === "intro" && "Review the guide, then continue."}
              {currentStep === "select" &&
                (session?.fellowId
                  ? `Selected: ${session.fellowName}`
                  : "Pick your fellow.")}
              {currentStep === "assess" &&
                (learners.length === 0
                  ? "No learners yet."
                  : "Record tiers & evidence.")}
              {currentStep === "summary" &&
                "Review and submit your assessment."}
            </div>

            <button
              onClick={() => nextStep()}
              disabled={!canGoNext}
              className={[
                "h-10 w-32 text-sm rounded-md font-semibold transition flex items-center justify-center gap-2",
                canGoNext
                  ? "bg-[#0075ff] text-white hover:bg-[#005de0] active:scale-95"
                  : "bg-slate-300 text-white cursor-not-allowed",
              ].join(" ")}
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
      </div>
    </main>
  );
}
