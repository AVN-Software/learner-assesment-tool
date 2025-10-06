import { ChangeEvent, useState } from "react";
import { TIERS, TierValue } from "./AssesmentTable";

export interface FormSelectProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[] | { label: string; value: string }[];
  disabled?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:border-[#304767] disabled:bg-slate-100 disabled:cursor-not-allowed"
      >
        <option value="">Select...</option>
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
};

export const getTierBadge = (
  tier: TierValue | ""
): (typeof TIERS)[number] | undefined =>
  TIERS.find((t) => t.value === tier);

  /* ------------------- Custom Select Component ------------------- */
 export const CustomSelect: React.FC<{
    value: TierValue;
    onChange: (value: TierValue) => void;
    className?: string;
  }> = ({ value, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const tierBadge = getTierBadge(value);

    return (
      <div className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-32 h-9 px-3 py-2 text-left text-sm border border-slate-300 rounded-md bg-white flex items-center justify-between ${
            value ? tierBadge?.color : "text-slate-700"
          }`}
        >
          <span>{value ? TIERS.find(t => t.value === value)?.fullLabel : "Select Tier"}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 first:rounded-t-md"
              >
                Clear selection
              </button>
              {TIERS.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => {
                    onChange(tier.value as TierValue);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 last:rounded-b-md"
                >
                  {tier.fullLabel}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };