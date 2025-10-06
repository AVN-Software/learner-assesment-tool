"use client";

import React, { useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { TierLevel } from "@/types/rubric";
import { getCompetencyTierDescription } from "@/utils/competencyUtils";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: string) => void;
  currentEvidence: string;
  learnerName: string;
  phase: string;
  tier: string; // e.g. "tier1"
  tierLevel: TierLevel; // e.g. 1
  competencyId: string;
  competencyName: string;
  tierFullLabel: string;
}


const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentEvidence,
  learnerName,
  phase,
  tierLevel,
  competencyId,
  competencyName,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState(currentEvidence || "");

  // 🔹 Dynamically fetch tier description
  const tierDescription = getCompetencyTierDescription(
    phase,
    competencyId,
    tierLevel
  );

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 120);
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(text.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 bg-white animate-in fade-in-0 zoom-in-95"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Add Evidence
          </DialogTitle>
          <p className="text-sm text-slate-600 flex flex-wrap gap-2 mt-1">
            <span>{learnerName}</span>
            <span>• {phase} Phase</span>
            <span>• Tier {tierLevel}</span>
            <span>• {competencyName}</span>
          </p>
        </DialogHeader>

        {/* 🔹 Tier Description Preview */}
        {tierDescription && (
          <div className="mb-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            {tierDescription}
          </div>
        )}

        <Textarea
          ref={textareaRef}
          placeholder="Briefly describe observable behaviour or evidence..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          className="min-h-[120px] resize-none text-sm rounded-lg border-slate-300 focus-visible:ring-1 focus-visible:ring-slate-400"
        />

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Use Ctrl/Cmd + Enter to save quickly.</span>
          <span>{text.length}/500</span>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-8 px-4 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="h-8 px-4 text-xs bg-slate-900 hover:bg-slate-800"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceModal;
