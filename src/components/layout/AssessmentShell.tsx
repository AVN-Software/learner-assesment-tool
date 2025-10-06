"use client";

import React from "react";
import TopBar from "./TopBar";
import Stepper from "./Stepper";
import Footer from "./Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

/**
 * Mobile-first Assessment Shell
 * - Tight paddings on mobile, roomier on md+
 * - Constrained width on larger screens (not full-bleed)
 * - Uses svh for better mobile viewport handling
 * - Card gains rounded + shadow progressively (md+)
 */
interface AssessmentShellProps {
  children: React.ReactNode;
}

const AssessmentShell: React.FC<AssessmentShellProps> = ({ children }) => {
  return (
    <main className="min-h-svh w-full bg-slate-50 font-[Poppins,sans-serif] text-slate-900">
      {/* Page gutter: small on mobile, larger on md+ */}
      <section className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <Card className="overflow-hidden md:rounded-2xl md:shadow-xl ring-1 ring-slate-200 bg-white">
          {/* TopBar: compact on mobile */}
          <div className="border-b border-slate-200">
            <TopBar />
          </div>

          {/* Stepper: slim; remains visible but unobtrusive on mobile */}
          <div className="border-b border-slate-200 bg-white">
            <Stepper />
          </div>

          {/* Body: tighter on mobile, comfortable on larger screens */}
          <CardContent className="px-3 sm:px-4 md:px-6 py-4 md:py-6">
            {/* Inner container: readable line-length on desktop */}
            <div className="mx-auto w-full max-w-3xl">{children}</div>
          </CardContent>

          {/* Footer: sticky-feel without actually sticking; ample touch targets */}
          <CardFooter className="border-t border-slate-200 bg-white px-3 sm:px-4 md:px-6 py-3">
            <Footer />
          </CardFooter>
        </Card>
      </section>
    </main>
  );
};

export default AssessmentShell;
