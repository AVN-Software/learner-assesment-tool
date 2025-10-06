"use client";

import React from "react";
import TopBar from "./TopBar";
import Stepper from "./Stepper";
import Footer from "./Footer";

interface AssessmentShellProps {
  children: React.ReactNode;
}

const AssessmentShell: React.FC<AssessmentShellProps> = ({ children }) => {
  return (
    <main className="min-h-screen w-full bg-[#eee] font-[Poppins,sans-serif] flex flex-col md:items-center md:justify-center">
      <section className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[75vh] w-full max-w-[1200px] md:max-w-[1400px] mx-auto my-8">
        {/* Header */}
        <TopBar />

        {/* Stepper */}
        <Stepper />

        {/* Body */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 py-6">
          <div className="mx-auto w-full max-w-[1100px]">{children}</div>
        </div>

        {/* Footer */}
        <Footer />
      </section>
    </main>
  );
};

export default AssessmentShell;
