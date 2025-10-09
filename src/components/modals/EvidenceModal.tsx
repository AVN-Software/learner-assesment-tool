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

  const tierDescription = getCompetencyTierDescription(phase, competencyId, tierLevel);

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
      <DialogContent
        className={[
          "max-w-lg p-0 overflow-hidden",
          "rounded-2xl border border-[#004854]/15 bg-white shadow-2xl",
        ].join(" ")}
        aria-label={`Evidence for ${learnerName}, ${competencyName}`}
      >
        {/* Brand header bar */}
        <div className="bg-gradient-to-r from-[#004854] to-[#0a5e6c] text-white">
          <div className="px-6 py-4">
            <DialogHeader className="p-0">
              <DialogTitle className="text-base font-semibold tracking-tight">Evidence</DialogTitle>
              <p className="mt-1 text-xs/5 text-white/80">
                <span className="font-medium">{learnerName}</span>
                <span className="mx-1.5">•</span>
                <span>{phase} Phase</span>
                <span className="mx-1.5">•</span>
                <span>Tier {tierLevel}</span>
                <span className="mx-1.5">•</span>
                <span>{competencyName}</span>
              </p>
            </DialogHeader>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {tierDescription && (
            <div className="mb-3 rounded-lg border border-[#004854]/12 bg-[#8ED1C1]/10 p-3 text-xs text-[#32353C]/85">
              {tierDescription}
            </div>
          )}

          <label htmlFor="evidence-textarea" className="sr-only">
            Evidence notes
          </label>
          <Textarea
            id="evidence-textarea"
            ref={textareaRef}
            placeholder="Brief, specific, observable behaviour..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            maxLength={500}
            className={[
              "min-h-[140px] resize-none text-sm",
              "rounded-lg border border-[#004854]/20",
              "focus-visible:ring-2 focus-visible:ring-[#8ED1C1]/40 focus-visible:border-[#004854]",
            ].join(" ")}
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-[#32353C]/70">
            <span>Ctrl/Cmd + Enter to save & close</span>
            <span>{text.length}/500</span>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 px-3 text-xs border-[#004854]/25 text-[#004854] hover:bg-[#8ED1C1]/10"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="button"
              className="h-8 px-4 text-xs bg-[#004854] hover:bg-[#0a5e6c] text-white"
              onClick={() => {
                doSave();
                onClose();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceModal;
