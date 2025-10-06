"use client";

import React, { useState } from "react";
import { Download, X } from "lucide-react";

type Props = { href?: string; invert?: boolean; className?: string };

export default function DownloadRubricButton({
  href = "/rubrics/full_rubric_2025.pdf", // kept for future enablement
  invert = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const look = invert
    ? "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200 focus:ring-slate-300"
    : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-700";

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        data-future-href={href}
        className={[base, look, className].join(" ")}
        title="Download Full Rubric (PDF)"
      >
        <Download className="w-4 h-4" />
        Download Full Rubric (PDF)
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Coming Soon
            </h3>
            <p className="mb-4 text-sm text-slate-600">
              The full rubric PDF will be available here shortly. In the
              meantime, you can continue with the assessment flow.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
