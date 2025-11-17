'use client';

import { ModalType } from '../../types';
import { CoachModal } from './CoachModal';
import { FellowModal } from './FellowModal';
import { LearnerModal } from './LearnerModal';

export function ModalManager({
  modal,
  setModal,
}: {
  modal: ModalType;
  setModal: (m: ModalType) => void;
}) {
  if (!modal) return null;

  const close = () => setModal(null);

  switch (modal.type) {
    case 'add-coach':
      return <CoachModal mode="add" onClose={close} />;

    case 'edit-coach':
      return <CoachModal mode="edit" coach={modal.coach} onClose={close} />;

    case 'add-fellow':
      return <FellowModal mode="add" onClose={close} />;

    case 'edit-fellow':
      return <FellowModal mode="edit" fellow={modal.fellow} onClose={close} />;

    case 'add-learner':
      return <LearnerModal mode="add" onClose={close} />;

    case 'edit-learner':
      return <LearnerModal mode="edit" learner={modal.learner} onClose={close} />;

    default:
      return null;
  }
}
