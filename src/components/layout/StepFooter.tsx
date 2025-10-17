"use client";

import React from "react";

export interface StepFooterProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const StepFooter: React.FC<StepFooterProps> = ({ left, right }) => {
  return (
    <footer
      className="
        h-14 sm:h-16 
        flex-shrink-0 
        border-t border-[#004854]/15 
        px-3 sm:px-6 md:px-8 
        bg-white/95 
        flex items-center justify-between
      "
    >
      <div className="text-xs sm:text-sm text-[#32353C]/70 font-medium">
        {left}
      </div>
      <div className="flex items-center">{right}</div>
    </footer>
  );
};

export default StepFooter;
