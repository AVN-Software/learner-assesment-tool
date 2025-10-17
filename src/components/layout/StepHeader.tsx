"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import DownloadRubricButton from "../DownloadButton";

export interface StepHeaderProps {
  /** Optional step icon (Lucide icon component) */
  icon?: LucideIcon;
  /** Step title (required) */
  title: string;
  /** Step description (optional, smaller text below title) */
  description?: string;
  /** Optional right-side action, defaults to DownloadRubricButton */
  action?: React.ReactNode;
}

/**
 * 🧭 StepHeader
 * - Displays the step’s icon, title, and description.
 * - Shows a right-side action (download button by default).
 * - Fully responsive and consistent across wizard steps.
 */
const StepHeader: React.FC<StepHeaderProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <header
      className="
        h-16 sm:h-20 md:h-24 
        flex-shrink-0 
        border-b border-[#004854]/15 
        bg-gradient-to-r from-white to-[#8ED1C1]/5
        flex items-center justify-between
        px-3 sm:px-6 md:px-8
        gap-3 sm:gap-4
      "
      role="banner"
      aria-label={`Step header: ${title}`}
    >
      {/* === Left side: Icon + Title === */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {Icon && (
          <div
            className="
              w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
              rounded-xl 
              flex items-center justify-center 
              flex-shrink-0 
              bg-gradient-to-br from-[#004854] to-[#0a5e6c] 
              text-white 
              shadow-md
            "
            aria-hidden="true"
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
        )}

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <h1
            className="
              text-base sm:text-lg md:text-xl lg:text-2xl 
              font-bold 
              text-[#004854] 
              truncate
            "
          >
            {title}
          </h1>

          {description && (
            <p
              className="
                text-xs sm:text-sm 
                text-[#32353C]/70 
                hidden sm:block 
                truncate
              "
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* === Right side: Action (Download, etc.) === */}
      <div className="hidden md:flex flex-shrink-0 items-center justify-end">
        {action ?? <DownloadRubricButton />}
      </div>
    </header>
  );
};

export default StepHeader;
