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
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Quick Start</h2>
      <p className="text-slate-600 mb-6">
        Follow these steps to set up and complete your learner observation.
      </p>

      <div className="space-y-4">
        {steps.map(({ title, desc, icon: Icon }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 bg-white"
          >
            <div className="mt-0.5 rounded-md bg-slate-100 p-2">
              <Icon className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">{title}</div>
              <div className="text-sm text-slate-600">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
