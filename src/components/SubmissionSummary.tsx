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
    desc: "Select the fellow and class you're assessing.",
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
        {/* Header with better spacing */}
        <header className="px-6 pt-8 pb-4 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                TTN Fellowship — Learner Observation
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {STEP_META[currentStep].label}
                </span>
                <span className="text-sm text-slate-500">
                  Step {stepIndex + 1} of {totalSteps}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <DownloadRubricButton />
            </div>
          </div>
        </header>

        {/* Enhanced Stepper */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress bar */}
            <div className="relative mb-6">
              <div className="h-2 w-full rounded-full bg-slate-200" />
              <div
                className="absolute left-0 top-0 h-2 rounded-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            
            {/* Step indicators */}
            <div className="grid grid-cols-4 gap-4">
              {STEPS.map((s: Step, i: number) => {
                const active = i === stepIndex;
                const complete = i < stepIndex;
                const IconComponent = STEP_META[s].icon;
                
                return (
                  <button
                    key={s}
                    onClick={() => goToStep(s)}
                    className={`group flex flex-col items-center gap-3 p-3 rounded-xl transition-all ${
                      active 
                        ? "bg-blue-50 border border-blue-200" 
                        : complete
                        ? "bg-emerald-50 border border-emerald-200"
                        : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold transition-all ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                            : complete
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-slate-400 text-slate-500 group-hover:border-slate-600"
                        }`}
                      >
                        {complete ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <div className="flex-1 text-left min-w-0">
                        <div
                          className={`text-sm font-semibold truncate ${
                            active
                              ? "text-blue-900"
                              : complete
                              ? "text-emerald-900"
                              : "text-slate-700 group-hover:text-slate-900"
                          }`}
                        >
                          {STEP_META[s].label}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {STEP_META[s].desc}
                        </div>
                      </div>
                      <IconComponent
                        className={`w-4 h-4 flex-shrink-0 ${
                          active
                            ? "text-blue-600"
                            : complete
                            ? "text-emerald-500"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-8">
          <div className="mx-auto w-full max-w-[1100px]">
            <Body />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 px-6 py-5 bg-slate-50">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={previousStep}
              disabled={!canGoBack}
              className={`h-12 px-6 w-full sm:w-auto text-base rounded-lg font-medium transition-all border flex items-center justify-center ${
                canGoBack
                  ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 hover:shadow-sm"
                  : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <div className="text-sm text-slate-600 text-center flex-1 px-4">
              {currentStep === "intro" && "Review the assessment guide before starting"}
              {currentStep === "select" &&
                (selectedFellow
                  ? `Assessing ${selectedFellow.name}'s class`
                  : "Select a fellow and their learners")}
              {currentStep === "assess" &&
                (selectedLearners.length === 0
                  ? "No learners selected for assessment"
                  : `Assessing ${selectedLearners.length} learner${selectedLearners.length !== 1 ? 's' : ''}`)}
              {currentStep === "summary" && "Review your assessment before final submission"}
            </div>

            <button
              onClick={nextStep}
              disabled={!canGoNext}
              className={`h-12 px-8 w-full sm:w-auto text-base rounded-lg font-semibold transition-all flex items-center justify-center gap-3 ${
                canGoNext
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {currentStep === "intro"
                ? "Get Started"
                : currentStep === "summary"
                ? "Complete Assessment"
                : "Continue"}
              {canGoNext && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
};
export default AssessmentShell;