"use client";

import React from "react";
import { Check } from "lucide-react";
import { useAssessment } from "@/context/AssessmentProvider";
import { WIZARD_CONFIG, STEPS } from "@/hooks/wizard-config";

/**
 * Step indicator with circles and connecting lines
 */
export default function StepIndicator() {
  const { stepInfo } = useAssessment();
  
  const progressWidth = stepInfo.total > 1 
    ? (stepInfo.index / (stepInfo.total - 1)) * 100 
    : 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between relative">
        {/* Background connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-10" />
        
        {/* Animated progress line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-500"
          style={{ width: `${progressWidth}%` }}
        />
        
        {/* Step circles */}
        {STEPS.map((step, index) => {
          const config = WIZARD_CONFIG[step];
          const Icon = config.icon;
          const isActive = index === stepInfo.index;
          const isCompleted = index < stepInfo.index;
          
          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm
                  ${isActive 
                    ? 'bg-blue-600 text-white scale-105 shadow-lg ring-4 ring-blue-100' 
                    : isCompleted 
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span 
                className={`text-xs mt-1.5 font-medium text-center max-w-[80px] transition-colors
                  ${isActive ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}
              >
                {config.meta.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}