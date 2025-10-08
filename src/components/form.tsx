"use client";

import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {  TierValue } from "./AssesmentTable";
import { TIERS } from "./steps/AssessmentStep";

/* ================================
   Basic <select>
================================== */
export interface FormSelectProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[] | { label: string; value: string }[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
  placeholder = "Select…",
  className = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-semibold mb-2 text-slate-700">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) =>
        typeof opt === "string" ? (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
    </select>
  </div>
);

/* ================================
   Helpers
================================== */
export const getTierBadge = (
  tier: TierValue | ""
): (typeof TIERS)[number] | undefined => TIERS.find((t: { value: string; }) => t.value === tier);

/* ================================
   CustomSelect (click/tap only)
================================== */
export const CustomSelect: React.FC<{
  value: TierValue;
  onChange: (value: TierValue) => void;
  className?: string;
}> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => [{ label: "Clear selection", value: "" as TierValue }, ...TIERS],
    []
  );

  const tierBadge = getTierBadge(value);

  // close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen]);

  const applyValue = (v: TierValue) => {
    onChange(v);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={`w-36 h-9 px-3 text-left text-sm border border-slate-300 rounded-md bg-white flex items-center justify-between ${
          value ? tierBadge?.color ?? "" : "text-slate-700"
        }`}
      >
        <span className="truncate">
          {value ? TIERS.find((t: { value: string; }) => t.value === value)?.fullLabel : "Select Tier"}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-300 bg-white shadow-lg overflow-hidden">
          {items.map((item) => {
            const isSelected = item.value === value;
            return (
              <button
                key={`${item.value || "clear"}`}
                type="button"
                onClick={() => applyValue(item.value as TierValue)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center justify-between ${
                  isSelected ? "font-semibold" : "font-normal"
                }`}
              >
                <span className="truncate">
                  {"fullLabel" in item ? item.fullLabel : item.label}
                </span>
                {isSelected && (
                  <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 9.839a1 1 0 111.414-1.415l3.222 3.222 6.657-6.657a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
