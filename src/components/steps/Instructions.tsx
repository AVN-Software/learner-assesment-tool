"use client";

import React from "react";

import { useAssessment } from "@/context/AssessmentProvider";
import {
  GraduationCap,
  Users,
  Target,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import StepScaffold from "./StepContainer";

export default function Instructions() {
  const { nextStep } = useAssessment();

  const steps = [
    {
      title: "Select Term",
      desc: "Pick the academic term for this assessment. This keeps your records organised over time.",
      icon: GraduationCap,
    },
    {
      title: "Select Coach",
      desc: "Choose the coach overseeing the fellows you want to assess. This filters the fellow list.",
      icon: Users,
    },
    {
      title: "Select Fellow (Teacher)",
      desc: "Pick the fellow whose students you'll assess. Only fellows under the selected coach will show.",
      icon: Target,
    },
    {
      title: "Select Students to Assess",
      desc: "Tick the learners you'll assess today. Students are grouped by grade & phase — assess across phases if needed.",
      icon: BookOpen,
    },
    {
      title: "Review Competency Rubrics",
      desc: "Open any competency to see indicators and hints, then assign a tier with a short evidence note.",
      icon: ClipboardCheck,
    },
  ] as const;

  return (
    <StepScaffold
      title="Quick Start"
      description="Follow these steps to set up and complete your learner observation."
      maxWidth="lg"
      actions={{
        leftHint: "Review the guide, then continue when ready.",
        primary: {
          label: "Get Started",
          onClick: nextStep,
        },
      }}
    >
      <div className="pb-6">
        <ol className="grid gap-4 sm:gap-5">
          {steps.map(({ title, desc, icon: Icon }, idx) => (
            <li
              key={title}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-slate-300 transition-all p-4 sm:p-5"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
                  Step {idx + 1}: {title}
                </h3>
                <p className="text-sm sm:text-[15px] text-slate-600 mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </StepScaffold>
  );
}