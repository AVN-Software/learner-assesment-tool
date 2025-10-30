"use client";

import React from "react";
import ProgressBar from "./ProgressBar";
import Navigation from "./Navigation";
import { FellowSummary } from "../FellowSummaryCard";

interface StepContentProps {
  children: React.ReactNode;
}

/**
 * StepContent
 * - Includes the header with ProgressBar
 * - Includes FellowSummary card (appears after login)
 * - Parent-size aware: fills available space; no fixed heights
 * - Scroll-safe: vertical scrolling happens here (not the page)
 * - Responsive padding + optional readability clamp for text-heavy steps
 */
export default function StepContent({ children }: StepContentProps) {
  return (
    <div className="h-full w-full flex flex-col min-h-0">
      {/* Header with ProgressBar */}
      <div className="h-16 flex-shrink-0 border-b border-[#004854]/15 px-8 flex items-center bg-white/95">
        <ProgressBar />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
        {/* Readability clamp: center content, but allow full width when needed */}
        <div className="w-full max-w-[1200px] mx-auto space-y-4">
          {/* Fellow Summary Card - shows after login */}
          <FellowSummary />

          {/* Horizontal overflow container for wide content (tables, long grids) */}
          <div className="-mx-2 md:-mx-0 overflow-x-auto">
            <div className="px-2 md:px-0 flex items-center justify-center">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Navigation */}
      <div className="h-16 flex-shrink-0 border-t border-[#004854]/15 px-8 bg-white/95">
        <div className="h-full w-full flex items-center justify-between">
          <Navigation />
        </div>
      </div>
    </div>
  );
}
