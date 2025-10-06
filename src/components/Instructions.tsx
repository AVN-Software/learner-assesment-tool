"use client";

import { useAssessment } from "@/context/AssessmentProvider";
import {
  ChevronRight,
  GraduationCap,
  Users,
  Target,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

export default function Instructions() {
  const { goToStep } = useAssessment();

  const steps = [
    {
      num: 1,
      title: "Select Term",
      desc: "Choose the academic term for this assessment. This helps organize and track assessments over time.",
      icon: GraduationCap,
    },
    {
      num: 2,
      title: "Select Coach",
      desc: "Choose the coach overseeing the fellows you want to assess. This filters the available fellows in the next step.",
      icon: Users,
    },
    {
      num: 3,
      title: "Select Fellow (Teacher)",
      desc: "Choose the fellow (teacher) whose students you want to assess. Only fellows under the selected coach will appear.",
      icon: Target,
    },
    {
      num: 4,
      title: "Select Students to Assess",
      desc: "Check the boxes for students you want to assess today. Students are grouped by grade and phase — you can assess across multiple phases at once.",
      icon: BookOpen,
    },
    {
      num: 5,
      title: "Review Competency Rubrics",
      desc: "Click on any competency to view its rubric for guidance before scoring learner behaviour.",
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
        {/* Left panel: title / context */}
        <div className="w-full sm:w-1/3 bg-slate-900 text-white flex flex-col justify-between p-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Quick Start Guide</h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              Welcome to the{" "}
              <span className="font-semibold text-white">
                2025 Learner Observation Pilot
              </span>
              . Follow these quick steps to begin your assessment process.
            </p>
          </div>

          <button
            onClick={() => goToStep("select")}
            className="mt-10 w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold rounded-xl py-3 hover:bg-slate-100 active:scale-[0.98] transition-all"
          >
            Begin Assessment
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right panel: steps */}
        <div className="w-full sm:w-2/3 p-8 sm:p-10 space-y-5">
          {steps.map(({ num, title, desc, icon: Icon }) => (
            <div
              key={num}
              className="flex items-start gap-4 group border-b border-slate-100 pb-4 last:border-0"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                {num}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-slate-700 group-hover:text-slate-900 transition-colors" />
                  <h3 className="font-semibold text-slate-900 text-base">
                    {title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
