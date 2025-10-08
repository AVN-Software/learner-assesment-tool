"use client";

import React from "react";

interface StepContentProps {
  children: React.ReactNode;
}

/**
 * Content area wrapper for step components
 */
export default function StepContent({ children }: StepContentProps) {
  return (
    <div className="p-6 min-h-[350px]">
      {children}
    </div>
  );
}