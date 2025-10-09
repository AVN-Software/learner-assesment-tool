"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentProvider";

/**
 * Navigation buttons (Back / Next)
 * - Parent provides the container styling (height, padding, border, bg).
 * - This component is layout-only: full-width row, brand-styled buttons.
 */
export default function Navigation() {
  const { navigation, nextStep, previousStep } = useAssessment();

  return (
    <div className="w-full flex items-center justify-between gap-3">
      {/* Left side: Back or status */}
      <div className="min-w-0">
        {navigation.canGoBack ? (
          <button
            type="button"
            onClick={previousStep}
            className={[
              "inline-flex items-center justify-center h-10 px-4 rounded-lg",
              "bg-white border border-[#004854]/20 text-[#004854]",
              "hover:bg-[#8ED1C1]/10",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ED1C1]/40",
              "transition-colors duration-200"
            ].join(" ")}
            aria-label="Go to previous step"
          >
            ← Back
          </button>
        ) : (
          <span className="text-sm text-[#838998] truncate">
            {navigation.statusMessage}
          </span>
        )}
      </div>

      {/* Right side: Next (primary action) or status */}
      <div className="min-w-0">
        {navigation.canGoNext ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!navigation.canGoNext}
            className={[
              "inline-flex items-center justify-center h-10 px-6 rounded-lg font-semibold",
              "bg-[#004854] text-white",
              "hover:bg-[#0a5e6c]",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ED1C1]/40",
              "shadow-sm hover:shadow transition"
            ].join(" ")}
            aria-label="Go to next step"
          >
            {navigation.nextLabel} →
          </button>
        ) : (
          <span className="text-sm font-medium text-[#32353C]/80">
            {navigation.statusMessage}
          </span>
        )}
      </div>
    </div>
  );
}
