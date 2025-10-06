"use client";

import React, { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CompetencyId, TierLevel } from "@/types/rubric";
import { Phase } from "@/types/core";
import { getCompetencyTierDescription } from "@/utils/competencyUtils";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;

  /** Persist the note (upsert). Should be stable from context. */
  onSave: (evidence: string) => void;

  currentEvidence: string;
  learnerName: string;
  learnerId: string;
  phase: Phase;
  tierLevel: TierLevel;
  competencyId: CompetencyId;
  competencyName: string;

  /** If true, also save when the textarea loses focus (default: true) */
  saveOnBlur?: boolean;
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
  saveOnBlur = true,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(currentEvidence ?? "");

  // Track the identity of the cell to prevent stale saves
  const activeKey = `${learnerId}__${competencyId}`;
  const activeKeyRef = useRef(activeKey);
  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);

  // When opening or switching to another cell, sync local state
  useEffect(() => {
    if (isOpen) setText(currentEvidence ?? "");
  }, [isOpen, currentEvidence, learnerId, competencyId]);

  // Focus textarea after open
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => textareaRef.current?.focus(), 120);
    return () => clearTimeout(id);
  }, [isOpen]);

  const tierDescription = getCompetencyTierDescription(
    phase,
    competencyId,
    tierLevel
  );

  const doSave = () => {
    // Prevent saving if dialog switched to another learner/competency quickly
    if (activeKeyRef.current !== activeKey) return;
    onSave(text.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      doSave();
      onClose();
    }
  };

  const handleBlur = () => {
    if (!saveOnBlur) return;
    doSave();
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
          onBlur={handleBlur}
          maxLength={500}
          className="min-h-[120px] resize-none text-sm rounded-lg border-slate-300 focus-visible:ring-1 focus-visible:ring-slate-400"
        />

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>Ctrl/Cmd + Enter to save & close</span>
          <span>{text.length}/500</span>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" className="h-8 px-3 text-xs" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            className="h-8 px-4 text-xs bg-slate-900 hover:bg-slate-800"
            onClick={() => {
              doSave();
              onClose();
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceModal;
