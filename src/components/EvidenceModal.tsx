"use client";

import React, { useRef, useEffect } from "react";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: string) => void;
  currentEvidence: string;
  learnerName: string;
  phase: string;
  tier: string;
  competencyId: any;
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
  tier,
  competencyName,
  tierFullLabel,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(
          textareaRef.current.value.length,
          textareaRef.current.value.length
        );
      }, 100);
    }
  }, [isOpen]);

  const handleSave = () => {
    const evidenceText = textareaRef.current?.value || "";
    onSave(evidenceText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Evidence Note</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span><strong>Learner:</strong> {learnerName}</span>
              <span>•</span>
              <span><strong>Phase:</strong> {phase}</span>
              <span>•</span>
              <span><strong>Tier:</strong> {tierFullLabel}</span>
              <span>•</span>
              <span><strong>Competency:</strong> {competencyName}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Textarea */}
        <div className="flex-1 p-6">
          <div className="h-full flex flex-col">
            <textarea
              ref={textareaRef}
              placeholder="Describe specific, observable behaviors that support this assessment. Be brief and factual..."
              defaultValue={currentEvidence}
              className="flex-1 w-full resize-none border-0 focus:outline-none focus:ring-0 text-lg leading-relaxed placeholder-gray-400"
              maxLength={500}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Tip: brief, specific, observable behaviour. Use Ctrl/Cmd + Enter to save.
              </p>
              <span className="text-sm text-gray-500">
                {currentEvidence.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors font-medium rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Save Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;