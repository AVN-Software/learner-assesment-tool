"use client";

import React, { useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CompetencyId, TierLevel} from "@/types/rubric";

import { getCompetencyTierDescription } from "@/utils/competencyUtils";
import { Phase } from "@/types/core";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;

  // auto-save handler (upsert)
  onSave: (evidence: string) => void;

  currentEvidence: string;
  learnerName: string;
  learnerId: string;
  phase: Phase;
  tierLevel: TierLevel;
  competencyId: CompetencyId;
  competencyName: string;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentEvidence,
  learnerName,
  learnerId,
  phase,
  tierLevel,
  competencyId,
  competencyName,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState(currentEvidence ?? "");

  // keep local state in sync when opening on a different cell
  useEffect(() => {
    if (isOpen) setText(currentEvidence ?? "");
  }, [isOpen, currentEvidence, learnerId, competencyId]);

  // autofocus
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      const id = setTimeout(() => textareaRef.current?.focus(), 120);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  // 🔸 Debounced auto-save whenever text changes (no explicit save required)
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      onSave(text.trim());
    }, 400); // debounce 400ms after user stops typing
    return () => clearTimeout(id);
  }, [text, isOpen, onSave]);

  const tierDescription = getCompetencyTierDescription(phase, competencyId, tierLevel);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Optional: still support Cmd/Ctrl+Enter to close quickly
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      onSave(text.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 bg-white">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Evidence
          </DialogTitle>
          <p className="text-sm text-slate-600 flex flex-wrap gap-2 mt-1">
            <span>{learnerName}</span>
            <span>• {phase} Phase</span>
            <span>• Tier {tierLevel}</span>
            <span>• {competencyName}</span>
          </p>
        </DialogHeader>

        {tierDescription && (
          <div className="mb-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            {tierDescription}
          </div>
        )}

        <Textarea
          ref={textareaRef}
          placeholder="Brief, specific, observable behaviour..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          className="min-h-[120px] resize-none text-sm rounded-lg border-slate-300 focus-visible:ring-1 focus-visible:ring-slate-400"
        />

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>Auto-saves · Ctrl/Cmd + Enter to close</span>
          <span>{text.length}/500</span>
        </div>

        <div className="mt-5 flex justify-end">
          <Button type="button" onClick={onClose} className="h-8 px-4 text-xs" variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceModal;
