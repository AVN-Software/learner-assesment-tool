"use client";

import {
  GraduationCap,
  Users,
  Target,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

export default function Instructions() {
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
      desc: "Pick the fellow whose students you’ll assess. Only fellows under the selected coach will show.",
      icon: Target,
    },
    {
      title: "Select Students to Assess",
      desc: "Tick the learners you’ll assess today. Students are grouped by grade & phase — assess across phases if needed.",
      icon: BookOpen,
    },
    {
      title: "Review Competency Rubrics",
      desc: "Open any competency to see indicators and hints, then assign a tier with a short evidence note.",
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="w-full max-w-[900px] mx-auto px-3 sm:px-4 md:px-0">
      {/* Intro header */}
      <header className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Quick Start
        </h2>
        <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-[600px] mx-auto md:mx-0">
          Follow these steps to set up and complete your learner observation.
        </p>
      </header>

      {/* Step list */}
      <div className="grid gap-4 sm:gap-5 md:gap-6">
        {steps.map(({ title, desc, icon: Icon }, idx) => (
          <div
            key={title}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow p-4 sm:p-5"
          >
            {/* Step icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#eef2f7] text-[#304767] shrink-0">
              <Icon className="w-5 h-5" />
            </div>

            {/* Step text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
                  Step {idx + 1}: {title}
                </h3>
              </div>
              <p className="text-sm sm:text-[15px] text-slate-600 mt-1 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-8 sm:mt-10 text-center md:text-left">
        <p className="text-sm text-slate-500">
          Once ready, click{" "}
          <span className="font-semibold text-[#0075ff]">Start</span> below to
          begin your assessment.
        </p>
      </div>
    </div>
  );
}
