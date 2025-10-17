"use client";

import React from "react";

/**
 * StepContent — purely scrollable content area
 * No header or footer here. Those are composed at a higher level.
 */
export interface StepContentProps {
  children: React.ReactNode;
}

const StepContent: React.FC<StepContentProps> = ({ children }) => {
  return (
    <main
      className="
        flex-1 
        min-h-0 
        overflow-y-auto 
        px-3 sm:px-4 md:px-6 lg:px-8 
        py-3 sm:py-4 md:py-6
        bg-white md:bg-transparent
      "
    >
      <div className="w-full max-w-full lg:max-w-[1200px] mx-auto">
        {children}
      </div>
    </main>
  );
};

export default StepContent;
