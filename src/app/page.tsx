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
  Circle,
  UserRoundSearch,
  NotebookPen,
  ClipboardCheck,
} from "lucide-react";

// ---------------------------------------------
// Strong step typing (keeps everything in sync)
// ---------------------------------------------
const STEPS = ["intro", "select", "assess", "summary"] as const;
type Step = (typeof STEPS)[number];

const STEP_META: Record<
  Step,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  intro: { label: "Instructions", icon: NotebookPen },
  select: { label: "Choose Fellow", icon: UserRoundSearch },
  assess: { label: "Assess Learners", icon: ClipboardCheck },
  summary: { label: "Review & Submit", icon: CheckCircle2 },
};

// ---------------------------------------------
// Component
// ---------------------------------------------
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

  // ---------------------------------------------
  // Derived state for guards & progress
  // ---------------------------------------------
  const stepIndex = steps.findIndex((s) => s.id === currentStep);
  const progressPct = Math.max(0, (stepIndex / (steps.length - 1)) * 100);

  const canProceed = useMemo<boolean>(() => {
    switch (currentStep) {
      case "intro":
        return true;
      case "select":
        return !!session?.fellowId;
      case "assess":
        return true; // allow partial assessments
      case "summary":
        return false;
      default:
        return false;
    }
  }, [currentStep, session?.fellowId]);

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < steps.length - 1 && canProceed;

  // ---------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && canGoNext) {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowLeft" && canGoBack) {
        e.preventDefault();
        previousStep();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canGoNext, canGoBack, nextStep, previousStep]);

  // ---------------------------------------------
  // Navigation helpers
  // ---------------------------------------------
  const goNext = () => canGoNext && nextStep();
  const goBack = () => canGoBack && previousStep();
  const goTo = (id: string) => goToStep(id);

  // ---------------------------------------------
  // Step content
  // ---------------------------------------------
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

  // ---------------------------------------------
  // Render
  // ---------------------------------------------
  return (
    <main className="min-h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Sticky Stepper Header */}
      <header className="shrink-0 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Progress bar */}
          <div className="relative w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Step buttons */}
          <nav className="grid grid-cols-4 gap-2 sm:gap-3">
            {steps.map((s, i) => {
              const active = i === stepIndex;
              const complete = i < stepIndex;
              const Icon = STEP_META[s.id as Step]?.icon ?? Circle;
              return (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className={[
                    "flex items-center justify-center gap-2 rounded-lg border px-2.5 py-2 sm:px-3 sm:py-2.5 transition text-sm sm:text-base font-medium",
                    complete
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : active
                      ? "bg-slate-900 border-slate-900 text-white shadow-md"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {complete ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : active ? (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Circle className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />
                  )}
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Step content — vertically centered, no scroll */}
      <section className="flex-1 flex items-center justify-center px-6 py-4 sm:py-6 bg-slate-50 overflow-hidden">
        <div className="w-full max-w-6xl">
          <Body />
        </div>
      </section>

      {/* Sticky Footer Navigation */}
      <footer className="shrink-0 border-t border-slate-200 bg-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={goBack}
              disabled={!canGoBack}
              className={[
                "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition",
                canGoBack
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed",
              ].join(" ")}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="text-[11px] sm:text-xs text-slate-600 text-center flex-1 truncate">
              {currentStep === "intro" && "Read the guide, then continue."}
              {currentStep === "select" &&
                (session?.fellowId
                  ? `Selected: ${session.fellowName}`
                  : "Select your fellow to begin assessment.")}
              {currentStep === "assess" &&
                "Record competency tiers and evidence for each learner."}
              {currentStep === "summary" &&
                "Review all data and submit assessment."}
            </div>

            <button
              onClick={goNext}
              disabled={!canGoNext}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow transition",
                canGoNext
                  ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                  : "bg-slate-300 text-white cursor-not-allowed",
              ].join(" ")}
            >
              {currentStep === "intro"
                ? "Start"
                : currentStep === "summary"
                ? "Done"
                : "Continue"}
              {canGoNext && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
