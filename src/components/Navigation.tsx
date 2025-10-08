"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentProvider";

/**
 * Navigation buttons (Back/Next)
 */
export default function Navigation() {
  const { navigation, nextStep, previousStep } = useAssessment();

  return (
    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
      {/* Left side - Back button or status message */}
      <div className="flex-1">
        {navigation.canGoBack ? (
          <button
            onClick={previousStep}
            className="px-5 py-2 bg-white border-2 border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
          >
            ← Back
          </button>
        ) : (
          <span className="text-sm text-slate-500">
            {navigation.statusMessage}
          </span>
        )}
      </div>
      
      {/* Right side - Next button */}
      {navigation.canGoNext && (
        <button
          onClick={nextStep}
          disabled={!navigation.canGoNext}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {navigation.nextLabel} →
        </button>
      )}
      
      {/* Show status message when can't proceed */}
      {!navigation.canGoBack && !navigation.canGoNext && (
        <span className="text-sm font-medium text-slate-600">
          {navigation.statusMessage}
        </span>
      )}
    </div>
  );
}