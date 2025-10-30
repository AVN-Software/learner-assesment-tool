"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { useData } from "@/providers/DataProvider";

/**
 * FellowSummary Component
 * Simple horizontal bar showing: Fellow Name | Coach | Grade | Phase
 * Automatically fetches from DataProvider - no props needed
 */
export const FellowSummary: React.FC = () => {
  const { fellowData } = useData();

  // Don't render if no fellow data (user not logged in)
  if (!fellowData) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="shrink-0 rounded-lg bg-slate-100 p-2">
          <GraduationCap className="h-4 w-4 text-slate-700" />
        </div>

        {/* Fellow Info */}
        <div className="flex items-center gap-6 text-sm flex-1 min-w-0">
          <div className="min-w-0">
            <span className="font-semibold text-slate-900 truncate block">
              {fellowData.fellowName}
            </span>
          </div>

          <div className="text-slate-600">
            <span className="font-medium text-slate-700">Coach:</span>{" "}
            {fellowData.coachName}
          </div>

          <div className="text-slate-600">
            <span className="font-medium text-slate-700">Grade:</span>{" "}
            {fellowData.grade}
          </div>

          <div className="text-slate-600">
            <span className="font-medium text-slate-700">Phase:</span>{" "}
            {fellowData.phase}
          </div>
        </div>
      </div>
    </div>
  );
};
