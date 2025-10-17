"use client";

import React from "react";
import { Calendar, UserCheck, Users, BookOpen, Target } from "lucide-react";

export default function Instructions() {
  const steps = [
    {
      title: "Select Term",
      desc: "Choose the academic term for this assessment. This helps keep your records organised throughout the year.",
      icon: Calendar,
    },
    {
      title: "Select Coach",
      desc: "Pick your coach’s name from the dropdown list.",
      icon: UserCheck,
    },
    {
      title: "Select Fellow (Educator)",
      desc: "Select your own name under Fellow Name. Only fellows linked to the chosen coach will appear.",
      icon: Users,
    },
    {
      title: "Select Learners",
      desc: "Tick the learners you’ll be assessing today. You can select more than one, but all must be from the same phase.",
      icon: BookOpen,
    },
    {
      title: "Review Competency Rubrics",
      desc: "At the assessment step, review the competency rubrics. You can download a PDF version using the Download Rubric button. Open any competency to view its indicators and tips, then assign a tier to each learner.",
      icon: Target,
    },
  ] as const;

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#004854]">
          How this assessment works
        </h2>
        <p className="text-sm text-[#32353C]/80">
          Follow the steps below to select learners and record their competency ratings.
        </p>
      </div>

      <div>
        {steps.map(({ title, desc, icon: Icon }, index) => (
          <div
            key={title}
            className="flex items-start gap-4 rounded-xl p-4 hover:bg-[#8ED1C1]/5 transition-colors"
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0
                         bg-gradient-to-br from-[#004854] to-[#0a5e6c] text-white"
              aria-hidden
            >
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-[#004854] text-sm truncate">
                  Step {index + 1}: {title}
                </h3>
              </div>
              <p className="text-xs text-[#32353C]/80 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
