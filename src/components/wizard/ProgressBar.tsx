"use client";

import React from "react";
import DownloadRubricButton from "../DownloadButton";
import { useAssessment } from "@/providers/AssessmentProvider";

export default function ProgressBar() {
  const { stepInfo } = useAssessment();
  const config = stepInfo.config;
  const Icon = config.icon;

  return (
    <div className="w-full h-full flex items-center justify-between gap-4 px-4">
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0
                     bg-gradient-to-br from-[#004854] to-[#0a5e6c] text-white shadow-sm"
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-[#004854] truncate">
            {config.title}
          </h1>
          <p className="text-[11px] text-[#32353C]/75 truncate hidden sm:block">
            {config.description}
          </p>
        </div>
      </div>

      {/* Right: Download Button */}
      <DownloadRubricButton />
    </div>
  );
}
