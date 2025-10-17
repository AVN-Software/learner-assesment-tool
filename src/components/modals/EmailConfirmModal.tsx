"use client";

import React, { useState } from "react";
import { CheckCircle2, Mail, X } from "lucide-react";
import type { Fellow } from "@/types/people";

export interface EmailConfirmModalProps {
  fellow: Fellow;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * 📧 EmailConfirmModal
 * - Confirms a fellow’s registered email.
 * - Only responsibility: verify typed email === fellow.email,
 *   then call onConfirm().
 */
export const EmailConfirmModal: React.FC<EmailConfirmModalProps> = ({
  fellow,
  onConfirm,
  onClose,
}) => {
  const [emailInput, setEmailInput] = useState("");

  const fellowEmail = fellow.email?.trim().toLowerCase() ?? "";
  const emailMatch = emailInput.trim().toLowerCase() === fellowEmail;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-email-title"
    >
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h3
          id="confirm-email-title"
          className="text-lg font-semibold text-slate-900 mb-2"
        >
          Confirm Fellow Email
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Enter <span className="font-semibold">{fellow.name}</span>’s
          registered email to continue.
        </p>

        {/* Input */}
        <div className="relative mb-3">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter fellow email"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:border-[#304767] focus:ring-2 focus:ring-[#304767]/20 transition-all"
          />
        </div>

        {/* Feedback */}
        {emailInput && !emailMatch && (
          <p className="text-sm text-red-600 mb-3">
            Email does not match this fellow’s record.
          </p>
        )}
        {emailMatch && (
          <p className="text-sm text-emerald-700 mb-3 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Verified successfully!
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!emailMatch}
            className={`px-5 py-2 text-sm rounded-md font-semibold transition-colors ${
              emailMatch
                ? "bg-[#304767] text-white hover:bg-[#22334a]"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
