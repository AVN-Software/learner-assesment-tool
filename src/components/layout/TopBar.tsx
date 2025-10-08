"use client";

import React from "react";
import DownloadRubricButton from "@/components/DownloadButton";
import { useAssessment } from "@/context/AssessmentProvider";

/**
 * TopBar
 * - Shows app title and current step info
 * - Includes download button for rubric
 * - Fully responsive with mobile-first approach
 */
const TopBar: React.FC = () => {
  const { stepInfo } = useAssessment();

  return (
    <header className="px-3 sm:px-4 md:px-6 pt-4 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
      {/* Title & Step Info */}
      <div className="min-w-0 flex-1">
        <h1 className="text-lg md:text-xl font-semibold text-slate-900 truncate">
          TTN Fellowship — Learner Observation
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
          {stepInfo.meta.label} • Step {stepInfo.index + 1} of {stepInfo.total}
        </p>
      </div>

      {/* Action Button */}
      <div className="shrink-0">
        <DownloadRubricButton />
      </div>
    </header>
  );
};

export default TopBar;