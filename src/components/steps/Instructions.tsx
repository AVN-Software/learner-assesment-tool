"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentProvider";
import {
  GraduationCap,
  Users,
  Target,
  BookOpen,
  ClipboardCheck,
  Star,
  Heart,
  Lightbulb,
  TargetIcon,
  Sparkles,
} from "lucide-react";
import StepScaffold from "./StepContainer";

export default function Instructions() {
  const { nextStep } = useAssessment();

  const steps = [
    {
      title: "Select Term & Coach",
      desc: "Choose the academic term and select your assigned coach to begin the assessment process.",
      icon: GraduationCap,
    },
    {
      title: "Choose Your Fellow",
      desc: "Select the teacher you'll be observing. You'll verify their details to ensure accurate assessment.",
      icon: Users,
    },
    {
      title: "Pick Classroom & Learners",
      desc: "Select the specific grade level and choose which students to include in this observation.",
      icon: BookOpen,
    },
    {
      title: "Assess Learner Competencies",
      desc: "Use our detailed rubrics to evaluate each learner's growth across academic and leadership skills.",
      icon: Target,
    },
    {
      title: "Complete & Review",
      desc: "Finalize your assessments and review the insights gathered about learner development.",
      icon: ClipboardCheck,
    },
  ] as const;

  return (
    <StepScaffold
      title={
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          Welcome to Conscious Leadership Development
        </div>
      }
      description="Thank you for participating in this important pilot program focused on learner growth and leadership development."
      maxWidth="2xl"
      actions={{
        leftHint: "Review the guide below, then continue when ready.",
        primary: {
          label: "Begin Assessment",
          onClick: nextStep,
        },
      }}
    >
      <div className="space-y-8">
        {/* Welcome Message */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-blue-200 flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Thank You for Joining Our Pilot Program
              </h2>
              <p className="text-slate-700 leading-relaxed text-base">
                Your participation is helping us shape the future of Conscious Instructional Leadership 
                and create meaningful impact in classrooms. Together, we're building a comprehensive 
                understanding of how learners develop both academically and as emerging leaders.
              </p>
            </div>
          </div>
        </div>

        {/* Purpose Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <TargetIcon className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-900">
              Purpose of Learner Competency Rubrics
            </h3>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-slate-700 leading-relaxed mb-4">
              To align classroom practice with <strong>Conscious Instructional Leadership</strong>, 
              educators need clear indicators of learner development in both academic outcomes and 
              essential leadership competencies.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700">
                  These rubrics help you <strong>observe and assess learner growth</strong> linked to 
                  5 key leadership skills that are essential for success in learning and life.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700">
                  You'll learn to <strong>recognize how learner behaviors evolve</strong> across 
                  Foundation Phase, Intermediate Phase, Senior Phase, and FET Phase, providing 
                  valuable insights into developmental progressions.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700">
                  Most importantly, these tools help <strong>align learner growth to teaching practices</strong> 
                  and classroom culture shifts, creating a feedback loop that benefits both teachers and students.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Competency Areas */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">
              Learner Competency Areas You'll Assess
            </h3>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Academic Outcomes",
                desc: "Subject mastery and cognitive skill application",
                color: "bg-blue-50 text-blue-700 border-blue-200"
              },
              {
                title: "Teamwork",
                desc: "Collaboration and social learning skills",
                color: "bg-emerald-50 text-emerald-700 border-emerald-200"
              },
              {
                title: "Curiosity & Creativity",
                desc: "Inquiry, innovation, and creative thinking",
                color: "bg-amber-50 text-amber-700 border-amber-200"
              },
              {
                title: "Analytic Thinking",
                desc: "Critical thinking and problem-solving",
                color: "bg-purple-50 text-purple-700 border-purple-200"
              },
              {
                title: "Leadership",
                desc: "Initiative and influence among peers",
                color: "bg-rose-50 text-rose-700 border-rose-200"
              },
              {
                title: "Motivation & Self-Awareness",
                desc: "Intrinsic drive and personal reflection",
                color: "bg-indigo-50 text-indigo-700 border-indigo-200"
              }
            ].map((area, index) => (
              <div
                key={area.title}
                className={`rounded-xl border-2 p-4 ${area.color} hover:shadow-md transition-all`}
              >
                <h4 className="font-semibold text-sm mb-2">{area.title}</h4>
                <p className="text-xs opacity-80 leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">
              Your Assessment Journey
            </h3>
          </div>
          
          <ol className="grid gap-4">
            {steps.map(({ title, desc, icon: Icon }, idx) => (
              <li
                key={title}
                className="flex flex-col sm:flex-row items-start gap-4 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-slate-300 transition-all p-5"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="sm:hidden flex-1">
                    <h3 className="font-semibold text-slate-900 text-base">
                      {title}
                    </h3>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 sm:pl-2">
                  <div className="hidden sm:flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <h3 className="font-semibold text-slate-900 text-base">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Closing Note */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 text-center">
          <p className="text-slate-700 font-medium">
            Ready to begin? Click <strong>"Begin Assessment"</strong> to start your first observation.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            You can return to these instructions anytime using the help button.
          </p>
        </div>
      </div>
    </StepScaffold>
  );
}