"use client";

import React from "react";

import {} from "lucide-react";

import { AssessmentProvider } from "@/context/AssessmentProvider";
import AssessmentShell from "@/components/layout/AssessmentShell";

/* ---------------------------------------------------------------------------
   🔹 Export the page wrapped with the Provider
--------------------------------------------------------------------------- */
export default function Page() {
  return <AssessmentShell />;
}
