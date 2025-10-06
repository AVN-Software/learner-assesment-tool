"use client";

import { GraduationCap, Users, Target, BookOpen, ClipboardCheck } from "lucide-react";
import React from "react";

export default function Instructions() {
  const steps = [
    {
      title: "Select Term",
      desc:
        "Pick the academic term for this assessment. This keeps your records organised over time.",
      icon: GraduationCap,
    },
    {
      title: "Select Coach",
      desc:
        "Choose the coach overseeing the fellows you want to assess. This filters the fellow list.",
      icon: Users,
    },
    {
      title: "Select Fellow (Teacher)",
      desc:
        "Pick the fellow whose students you’ll assess. Only fellows under the selected coach will show.",
      icon: Target,
    },
    {
      title: "Select Students to Assess",
      desc:
        "Tick the learners you’ll assess today. Students are grouped by grade & phase — assess across phases if needed.",
      icon: BookOpen,
    },
    {
      title: "Review Competency Rubrics",
      desc:
        "Open any competency to see indicators and hints, then assign a tier with a short evidence note.",
      icon: ClipboardCheck,
    },
  ] as const;

  return (
    <div className="w-full max-w-[900px] mx-auto px-4">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Quick Start</h2>
        <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-[600px]">
          Follow these steps to set up and complete your learner observation.
        </p>
      </header>

      {/* Steps */}
      <ol className="grid gap-4 sm:gap-5 md:gap-6">
        {steps.map(({ title, desc, icon: Icon }, idx) => (
          <li
            key={title}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow p-4 sm:p-5"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#eef2f7] text-[#304767] shrink-0">
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

      {/* Note (no buttons here; Footer in shell handles navigation) */}
      <p className="mt-8 text-sm text-slate-500">
        When you’re ready, use the <span className="font-semibold text-[#0075ff]">Start</span> /
        <span className="font-semibold text-[#0075ff]">Next</span> controls in the footer below.
      </p>
    </div>
  );
}
