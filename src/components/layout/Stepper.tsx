"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentProvider";
import { STEPS, Step } from "@/types/assessment";
import {
  CheckCircle2,
  UserRoundSearch,
  NotebookPen,
  ClipboardCheck,
} from "lucide-react";

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
   🔹 Stepper (reads from context)
--------------------------------------------------------------------------- */
const Stepper: React.FC = () => {
  const { currentStep, goToStep } = useAssessment();

  const stepIndex = STEPS.indexOf(currentStep);
  const totalSteps = STEPS.length;
  const pct = Math.round((stepIndex / (totalSteps - 1)) * 100);

  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-y border-slate-200 overflow-x-auto">
      <div className="px-4 py-4 min-w-[600px] sm:min-w-0">
        <div className="relative">
          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-slate-200" />
          <div
            className="absolute left-0 top-0 h-1.5 rounded-full bg-[#304767] transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />

          {/* Step Indicators */}
          <div
            className="relative mt-4 grid"
            style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0,1fr))` }}
            role="tablist"
            aria-label="Assessment steps"
          >
            {STEPS.map((s: Step, i: number) => {
              const active = i === stepIndex;
              const complete = i < stepIndex;

              return (
                <button
                  key={s}
                  onClick={() => goToStep(s)}
                  className="group flex flex-col items-center gap-1 focus:outline-none"
                  role="tab"
                  aria-selected={active}
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
  );
};

export default Stepper;
