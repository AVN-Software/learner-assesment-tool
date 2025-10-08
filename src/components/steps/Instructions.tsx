"use client";

import React from "react";

import {
  GraduationCap,
  Users,
  Target,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";




export default function Instructions() {


  const steps = [
    { title: "Select Term & Coach", desc: "Choose academic term and your assigned coach.", icon: GraduationCap },
    { title: "Select Fellow", desc: "Pick the teacher you'll be observing.", icon: Users },
    { title: "Choose Classroom & Learners", desc: "Select grade level and students to assess.", icon: BookOpen },
    { title: "Assess Competencies", desc: "Evaluate learners using our rubrics.", icon: Target },
    { title: "Complete Assessment", desc: "Review and finalize your observations.", icon: ClipboardCheck },
  ] as const;

  return (
  <div className="space-y-6">
    {/* Welcome Message */}
    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 text-center">
      <h3 className="font-semibold text-slate-900 mb-2">Let&apos;s Get Started</h3>
      <p className="text-slate-700 text-sm">
        You&apos;ll be assessing learner development across academic outcomes and leadership competencies.
      </p>
    </div>

    {/* Step Overview */}
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900 text-lg">Assessment Steps</h3>
      <ol className="space-y-3">
        {steps.map(({ title, desc, icon: Icon }, idx) => (
          <li
            key={title}
            className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:shadow-sm transition"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-slate-600" />
                <h4 className="font-medium text-slate-900 text-sm">{title}</h4>
              </div>
              <p className="text-slate-600 text-xs">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>

    {/* Footer Note */}
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-center">
      <p className="text-slate-700 text-sm font-medium">
        Ready to begin your first observation?
      </p>
    </div>
  </div>
);
}
