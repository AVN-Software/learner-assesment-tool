"use client";

import React from "react";
import { Calendar, UserCheck, Users, BookOpen, Target } from "lucide-react";

export default function Instructions() {
  const steps = [
    {
      title: "Select Term",
      desc:
        "Pick the academic term for this assessment. This keeps your records organised over time.",
      icon: Calendar,
    },
    {
      title: "Select Coach",
      desc:
        "Choose your coach name from the drop down  ",
      icon: UserCheck,
    },
    {
      title: "Select Fellow Name(Educator)",
      desc:
        "Choose the fellow name ( Your Name ) . Only fellows under the selected coach will show.",
      icon: Users,
    },
    {
      title: "Select Learners for assessment  ",
      desc:
        "Tick the learners you'll assess today. You may select more then one, note learners  your selection is from learners in a single phase ",
      icon: BookOpen,
    },
    {
      title: "Review Competency Rubrics",
      desc:
        "Once at the assesment step please review competency rubrics ( you can download a pdf version version by pressing the download button) Open any competency to see indicators and hints, then assign tiers to each learner.",
      icon: Target,
    },
  ] as const;

  return (
    <div className="w-full">
      {/* Optional step heading (kept compact; StepContent controls spacing) */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#004854]">
          How this assessment works
        </h2>
        <p className="text-sm text-[#32353C]/80">
          Follow the steps below to , select learners, and capture competency ratings.
        </p>
      </div>

      {/* Steps list */}
      <div className="">
        {steps.map(({ title, desc, icon: Icon }, index) => (
          <div
            key={title}
            className={[
              "flex items-start gap-4 rounded-xl",
              
              "p-4 hover:bg-[#8ED1C1]/5 transition-colors",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                "bg-gradient-to-br from-[#004854] to-[#0a5e6c] text-white",
              ].join(" ")}
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
              <p className="text-xs text-[#32353C]/80 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
