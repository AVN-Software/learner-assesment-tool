"use client";

import React, { JSX, useState } from "react";
import { Download, X } from "lucide-react";

/**
 * 📄 DownloadRubricButton
 * Lets user select a phase and downloads the corresponding Word document.
 */

type PhaseCode = "foundation" | "intermediate" | "senior" | "fet";

interface PhaseInfo {
  readonly label: string;
  readonly filename: string;
}

const PHASE_OPTIONS: Readonly<Record<PhaseCode, PhaseInfo>> = {
  foundation: { label: "Foundation Phase", filename: "FoundationPhase.docx" },
  intermediate: { label: "Intermediate Phase", filename: "IntermediatePhase.docx" },
  senior: { label: "Senior Phase", filename: "SeniorPhase.docx" },
  fet: { label: "FET Phase", filename: "FETPhase.docx" },
};

interface Props {
  readonly invert?: boolean;
  readonly className?: string;
}

export default function DownloadRubricButton({
  invert = false,
  className = "",
}: Props): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPhase, setSelectedPhase] = useState<PhaseCode | null>(null);

  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const look = invert
    ? "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200 focus:ring-slate-300"
    : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-700";

  const handleDownload = (): void => {
    if (!selectedPhase) return;
    const fileInfo = PHASE_OPTIONS[selectedPhase];
    const fileUrl = `/${fileInfo.filename}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileInfo.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
    setSelectedPhase(null);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[base, look, className].join(" ")}
      >
        <Download className="w-4 h-4" />
        Download Phase Rubric (Word)
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Select Phase to Download
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {(
                Object.entries(PHASE_OPTIONS) as [PhaseCode, PhaseInfo][]
              ).map(([phase, { label }]) => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPhase === phase
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{label}</span>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedPhase === phase
                          ? "bg-blue-500 border-blue-500"
                          : "border-slate-300"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setSelectedPhase(null);
                  setOpen(false);
                }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={!selectedPhase}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  selectedPhase
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}