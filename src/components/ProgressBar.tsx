"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentProvider";

/**
 * Header with step title and progress bar
 */
export default function ProgressBar() {
  const { stepInfo } = useAssessment();
  const config = stepInfo.config;
  const Icon = config.icon;

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              {config.title}
            </h1>
            <p className="text-blue-100 text-sm">
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between text-sm font-medium text-slate-600 mb-2">
          <span>Step {stepInfo.index + 1} of {stepInfo.total}</span>
          <span className="text-blue-600">{stepInfo.progress}% Complete</span>
        </div>
        <div className="relative w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${stepInfo.progress}%` }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{ width: `${stepInfo.progress}%` }}
          />
        </div>
      </div>
    </>
  );
}