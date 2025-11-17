'use client';

import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { AdminPanelSection } from './AdminPanelSection';
import { useAdminData } from '../../../../providers/AdminDataProvider';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { AssessmentCard } from '../cards/AssessmentCard';

export function LearnersPanel() {
  const { selectedFellow, learners, deleteLearner, setModal, fetchAssessment, latestAssessment } =
    useAdminData();

  const [openedLearnerId, setOpenedLearnerId] = useState<string | null>(null);

  const handleExpand = async (learnerId: string) => {
    // collapse if already open
    if (openedLearnerId === learnerId) {
      setOpenedLearnerId(null);
      return;
    }

    setOpenedLearnerId(learnerId);

    // Fetch latest assessment for this learner
    await fetchAssessment(learnerId);
  };

  return (
    <AdminPanelSection
      title="Learners"
      subtitle={
        selectedFellow
          ? `Learners under ${selectedFellow.fellow_name}`
          : 'Select a fellow to view learners'
      }
      helpText="Add, edit or remove learners"
      onAction={
        selectedFellow
          ? () =>
              setModal({
                type: 'add-learner',
                fellowId: selectedFellow.id,
              })
          : undefined
      }
      actionLabel="Add Learner"
    >
      {!selectedFellow ? (
        <p className="py-4 text-center text-slate-500">Select a fellow first</p>
      ) : learners.length === 0 ? (
        <p className="py-4 text-center text-slate-500">No learners found</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {learners.map((learner) => {
            const isOpen = learner.id === openedLearnerId;

            const assessmentDate = learner.assessment_date
              ? new Date(learner.assessment_date).toLocaleDateString()
              : 'No assessment';

            const assessmentStatus =
              learner.assessment_status === 'completed' ? 'Completed' : 'Incomplete';

            return (
              <AccordionItem value={learner.id} key={learner.id}>
                <AccordionTrigger
                  onClick={() => handleExpand(learner.id)}
                  className="flex justify-between"
                >
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">{learner.learner_name}</span>

                    <span className="text-xs text-slate-500">Status: {assessmentStatus}</span>

                    <span className="text-xs text-slate-500">
                      Last Assessment: {assessmentDate}
                    </span>
                  </div>

                  {/* CRUD buttons */}
                  <div className="ml-auto flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal({ type: 'edit-learner', learner });
                      }}
                      className="rounded p-1.5 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4 text-blue-600" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLearner(learner.id);
                      }}
                      className="rounded p-1.5 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  {isOpen && latestAssessment ? (
                    <AssessmentCard assessment={latestAssessment} />
                  ) : isOpen ? (
                    <p className="py-3 text-sm text-slate-500">
                      No assessment found for this learner.
                    </p>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </AdminPanelSection>
  );
}
