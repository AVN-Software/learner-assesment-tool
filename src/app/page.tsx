"use client";

import { useAssessment } from "@/context/AssessmentProvider";

import Instructions from "@/components/steps/Instructions";
import FellowSelection from "@/components/steps/FellowSelection";
import AssessmentStep from "@/components/steps/AssessmentStep";
import SubmissionSummary from "@/components/steps/SubmissionSummary";
import { Card } from "@/components/ui/card";

export default function Page() {
  const { stepInfo } = useAssessment();

  return (
     <main className="min-h-svh w-full bg-slate-50">
      <section className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <Card className="overflow-hidden md:rounded-2xl md:shadow-xl ring-1 ring-slate-200 bg-white">

      {stepInfo.current === "intro" && <Instructions />}
      {stepInfo.current === "select" && <FellowSelection />}
      {stepInfo.current === "assess" && <AssessmentStep />}
      {stepInfo.current === "summary" && <SubmissionSummary />}

        </Card>
      </section>
    </main>
  );
   

}