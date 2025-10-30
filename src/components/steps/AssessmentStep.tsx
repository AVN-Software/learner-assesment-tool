'use client';

import React, { useState } from 'react';
import { Users, X } from 'lucide-react';

import { PhaseTable } from '../AssesmentTable/PhaseTable';
import EvidenceModal from '@/components/modals/EvidenceModal';
import { useAssessment } from '@/providers/AssessmentProvider';
import { useData } from '@/providers/DataProvider';
import { CompetencyId } from '@/types/rubric.types';

/* ----------------------------------------------------------------------------
   AssessmentStep - Main component
---------------------------------------------------------------------------- */
const AssessmentStep: React.FC = () => {
  const { fellowData } = useData();

  const { selectedLearners, assessmentDrafts, mode } = useAssessment();

  // Evidence modal state
  const [evidenceModal, setEvidenceModal] = useState<{
    open: boolean;
    learnerId: string;
    competencyId: CompetencyId;
  }>({
    open: false,
    learnerId: '',
    competencyId: 'motivation',
  });

  /* ---------------------------- Handlers ---------------------------- */
  const handleOpenEvidence = (args: {
    learnerId: string;
    competencyId: CompetencyId;
    learnerName: string;
    tierScore: 1 | 2 | 3;
  }) => {
    setEvidenceModal({
      open: true,
      learnerId: args.learnerId,
      competencyId: args.competencyId,
    });
  };

  const closeEvidence = () => setEvidenceModal((prev) => ({ ...prev, open: false }));

  /* ---------------------------- Render ---------------------------- */
  if (selectedLearners.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Users className="mx-auto mb-2 h-10 w-10 text-slate-400" />
          <h3 className="mb-1 text-base font-semibold text-slate-800">No learners selected</h3>
          <p className="text-sm text-slate-600">
            Go back and choose learners to begin your assessment.
          </p>
        </div>
      </div>
    );
  }

  if (!fellowData) return null;

  const isEditMode = mode?.type === 'edit';
  const headerTitle = isEditMode
    ? `Editing Assessment - ${fellowData.grade} • ${fellowData.phase} Phase`
    : `New Assessment - ${fellowData.grade} • ${fellowData.phase} Phase`;

  const learnerCount = assessmentDrafts.length;

  return (
    <div className="w-full space-y-3">
      {/* Header Info */}
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">{headerTitle}</h3>
            <p className="mt-0.5 text-sm text-slate-600">
              {isEditMode ? (
                <span>Editing 1 learner</span>
              ) : (
                <span>
                  Assessing {learnerCount} learner
                  {learnerCount !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* PhaseTable */}
      <PhaseTable onOpenEvidence={handleOpenEvidence} />

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={evidenceModal.open}
        onClose={closeEvidence}
        learnerId={evidenceModal.learnerId}
        competencyId={evidenceModal.competencyId}
      />
    </div>
  );
};

export default AssessmentStep;
