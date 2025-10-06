"use client";

import React, { useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: string) => void;
  currentEvidence: string;
  learnerName: string;
  phase: string;
  tierFullLabel: string;
  competencyName: string;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentEvidence,
  learnerName,
  phase,
  tierFullLabel,
  competencyName,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState(currentEvidence || "");

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 bg-white animate-in fade-in-0 zoom-in-95"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Add Evidence
          </DialogTitle>
          <p className="text-sm text-slate-600">
            {learnerName} • {phase} Phase • {tierFullLabel} • {competencyName}
          </p>
        </DialogHeader>

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
