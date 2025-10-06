import React, { useEffect, useMemo } from "react";

import Instructions from "@/components/Instructions";
import FellowSelection from "@/components/FellowSelection";
import AssessmentTable from "@/components/AssesmentTable";
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
import { Step, STEPS } from "@/types/assessment";
import { useAssessment } from "@/context/AssessmentProvider";

/* ---------------------------------------------------------------------------
   🔹 Step meta (labels/icons only)
--------------------------------------------------------------------------- */
const STEP_META: Record<
  (typeof STEPS)[number],
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

/* ---------------------------------------------------------------------------
   🔹 Shell that uses the context
--------------------------------------------------------------------------- */
const AssessmentShell: React.FC = () => {
  const {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    selectedFellow,
    selectedLearners,
  } = useAssessment();

  // Progress calculations
  const stepIndex = STEPS.indexOf(currentStep);
  const totalSteps = STEPS.length;
  const pct = Math.round((stepIndex / (totalSteps - 1)) * 100);

  // Gate "Next" based on current context state
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "intro":
        return true;
      case "select":
        return !!selectedFellow && selectedLearners.length > 0;
      case "assess":
        return selectedLearners.length > 0;
      case "summary":
        return true; // you can always submit/review
      default:
        return false;
    }
  }, [currentStep, selectedFellow, selectedLearners]);

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < totalSteps - 1 && canProceed;

  // Keyboard navigation hooked into context
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && canGoNext) nextStep();
      else if (e.key === "ArrowLeft" && canGoBack) previousStep();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canGoNext, canGoBack, nextStep, previousStep]);

  // Step body
  const Body = () => {
    switch (currentStep) {
      case "intro":
        return <Instructions />;
      case "select":
        return <FellowSelection />; // pulls mock data + writes to context
      case "assess":
        return <AssessmentTable />; // reads/writes assessments/evidence via context
      case "summary":
        return <SubmissionSummary />; // reads everything from context and submits
      default:
        return null;
    }
  };

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
                {STEPS.map((s: Step, i: number) => {
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
};
export default AssessmentShell;
