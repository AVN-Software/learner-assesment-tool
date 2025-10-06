"use client";

import { Download } from "lucide-react";

type Props = { href?: string; invert?: boolean; className?: string };

export default function DownloadRubricButton({
  href = "/rubrics/full_rubric_2025.pdf",
  invert = false,
  className = "",
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition";
  const look = invert
    ? "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200"
    : "bg-slate-900 text-white hover:bg-slate-800";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[base, look, className].join(" ")}
    >
      <Download className="w-4 h-4" />
      Download Full Rubric (PDF)
    </a>
  );
}
