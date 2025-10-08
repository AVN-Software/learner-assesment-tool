"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentProvider";
import { STEPS, STEP_META, Step } from "@/context/AssessmentProvider";
import {
  CheckCircle2,
  UserRoundSearch,
  NotebookPen,
  ClipboardCheck,
} from "lucide-react";

/**
 * Icon mapping for each step
 * These icons appear in the completed state
 */
const STEP_ICONS: Record<Step, React.ComponentType<{ className?: string }>> = {
  intro: NotebookPen,
  select: UserRoundSearch,
  assess: ClipboardCheck,
  summary: CheckCircle2,
};

/**
 * Stepper Component
 * - Visual progress indicator across assessment steps
 * - Clickable step navigation
 * - Keyboard accessible (Tab + Arrow keys)
 * - Shows completion state with icons
 * - Responsive: stacks on mobile, horizontal on desktop
 */
const Stepper: React.FC = () => {
  const { stepInfo, goToStep } = useAssessment();

  /**
   * Keyboard navigation
   * Arrow Left/Right to move between steps
   */
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" && index < STEPS.length - 1) {
      e.preventDefault();
      goToStep(STEPS[index + 1]);
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      goToStep(STEPS[index - 1]);
    } else if (e.key === "Home") {
      e.preventDefault();
      goToStep(STEPS[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      goToStep(STEPS[STEPS.length - 1]);
    }
  };

  return (
    <nav
      className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200"
      aria-label="Assessment progress"
    >
      <div className="px-3 sm:px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="relative mb-4">
            <div className="h-1.5 w-full rounded-full bg-slate-200" />
            <div
              className="absolute left-0 top-0 h-1.5 rounded-full bg-[#304767] transition-[width] duration-500 ease-out"
              style={{ width: `${stepInfo.progress}%` }}
              role="progressbar"
              aria-valuenow={stepInfo.index + 1}
              aria-valuemin={1}
              aria-valuemax={stepInfo.total}
              aria-label={`Step ${stepInfo.index + 1} of ${stepInfo.total}: ${stepInfo.progress}% complete`}
            />
          </div>

          {/* Step Indicators */}
          <div
            className="flex flex-col sm:grid gap-2 sm:gap-0"
            style={{
              gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))`,
            }}
            role="tablist"
            aria-orientation="horizontal"
          >
            {STEPS.map((step: Step, index: number) => {
              const active = index === stepInfo.index;
              const complete = index < stepInfo.index;
              const Icon = STEP_ICONS[step];
              const meta = STEP_META[step];

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => goToStep(step)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={[
                    "group relative flex items-center sm:flex-col gap-3 sm:gap-1.5 p-3 sm:p-2 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "transition-all duration-200",
                    active && "bg-blue-50 sm:bg-transparent",
                  ].join(" ")}
                  role="tab"
                  aria-selected={active}
                  aria-current={active ? "step" : undefined}
                  aria-controls={`step-panel-${step}`}
                  aria-label={`${meta.label}: ${meta.desc}`}
                  tabIndex={active ? 0 : -1}
                >
                  {/* Step Number/Icon Circle */}
                  <span
                    className={[
                      "relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 text-xs font-bold transition-all duration-300 shrink-0",
                      active
                        ? "bg-[#304767] border-[#304767] text-white shadow-lg scale-110"
                        : complete
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-md"
                        : "bg-white border-slate-400 text-slate-500 group-hover:border-slate-600 group-hover:scale-105",
                    ].join(" ")}
                  >
                    {complete ? (
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </span>

                  {/* Step Label & Description */}
                  <div className="flex-1 sm:flex-none text-left sm:text-center min-w-0">
                    <div
                      className={[
                        "text-xs sm:text-[11px] font-semibold truncate sm:max-w-[140px]",
                        active
                          ? "text-slate-900"
                          : complete
                          ? "text-emerald-700"
                          : "text-slate-600 group-hover:text-slate-900",
                      ].join(" ")}
                    >
                      {meta.label}
                    </div>
                    {/* Description - hidden on mobile, visible on larger screens */}
                    <div
                      className={[
                        "hidden md:block text-[10px] truncate sm:max-w-[140px] mt-0.5",
                        active
                          ? "text-slate-600"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      {meta.desc}
                    </div>
                  </div>

                  {/* Connection Line (desktop only) */}
                  {index < STEPS.length - 1 && (
                    <div
                      className="hidden sm:block absolute top-[18px] left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 bg-slate-200"
                      aria-hidden="true"
                    >
                      <div
                        className={[
                          "h-full transition-all duration-500",
                          complete ? "bg-emerald-500 w-full" : "bg-transparent w-0",
                        ].join(" ")}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Stepper;