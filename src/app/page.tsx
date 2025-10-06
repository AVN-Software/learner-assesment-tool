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
  Circle,
} from "lucide-react";
import DownloadRubricButton from "@/components/DownloadButton";

// steps metadata
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

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "intro":
        return true;
      case "select":
        return !!session?.fellowId;
      case "assess":
        return true; // allow partials
      case "summary":
        return false; // submit inside summary
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

  // progress % for subtle bar
  const progressPct = Math.round((stepIndex / (totalSteps - 1)) * 100);

  return (
    <main className="h-screen w-screen bg-slate-50">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-[320px,1fr] gap-4">
        {/* LEFT PANEL: title + progress (compact) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col">
          <div className="mb-4">
            <h1 className="text-lg font-bold text-slate-900">
              Learner Observation
            </h1>
            <p className="text-xs text-slate-600">
              Step {stepIndex + 1} of {totalSteps}
            </p>
          </div>

          {/* Progress list */}
          <div className="space-y-2 mb-5">
            {steps.map((s, i) => {
              const active = i === stepIndex;
              const complete = i < stepIndex;
              const Icon = STEP_META[s.id as Step]?.icon ?? Circle;
              return (
                <button
                  key={s.id}
                  onClick={() => goToStep(s.id)}
                  className={[
                    "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition border",
                    active
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                      : complete
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {complete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="truncate">
                    {STEP_META[s.id as Step]?.label ?? s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Thin progress bar (subtle) */}
          <div className="mb-5">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] text-slate-600">
              {currentStep === "select" &&
                !session?.fellowId &&
                "Select a fellow to continue."}
              {currentStep === "assess" &&
                learners.length === 0 &&
                "No learners yet."}
            </div>
          </div>

          {/* Persistent rubric download */}
          <DownloadRubricButton className="mt-auto" />
        </section>

        {/* RIGHT PANEL: active step content (scrolls internally if needed) */}
        <section className="rounded-2xl border border-slate-200 bg-white h-full flex flex-col">
          <div className="flex-1 overflow-auto p-5">
            <Body />
          </div>

          {/* Inline footer controls (minimal, never lost) */}
          <div className="border-t border-slate-200 p-3 flex items-center justify-between">
            <button
              onClick={() => previousStep()}
              disabled={!canGoBack}
              className={[
                "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition",
                canGoBack
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed",
              ].join(" ")}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="text-xs text-slate-500 truncate">
              {currentStep === "intro" && "Review the guide, then continue."}
              {currentStep === "select" &&
                (session?.fellowId
                  ? `Selected: ${session.fellowName}`
                  : "Pick your fellow.")}
              {currentStep === "assess" &&
                "Record tiers and (optional) evidence."}
              {currentStep === "summary" &&
                "Review and submit your assessment."}
            </div>

            <button
              onClick={() => nextStep()}
              disabled={!canGoNext}
              className={[
                "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition",
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
        </section>
      </div>
    </main>
  );
}
