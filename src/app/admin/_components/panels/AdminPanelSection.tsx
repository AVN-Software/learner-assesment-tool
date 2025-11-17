'use client';

import React from 'react';

interface AdminPanelSectionProps {
  title: string;
  subtitle?: string;
  helpText?: string;
  children?: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
}

export function AdminPanelSection({
  title,
  subtitle,
  helpText,
  children,
  onAction,
  actionLabel = 'Add',
}: AdminPanelSectionProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="font-semibold text-slate-800">{title}</h2>

        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}

        {helpText && <p className="mt-1 text-xs text-slate-400">{helpText}</p>}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">{children}</div>

      {/* Footer Button */}
      {onAction && (
        <div className="border-t border-slate-200 p-3">
          <button
            onClick={onAction}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#005a6a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#007786]"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
