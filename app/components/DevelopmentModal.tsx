import React from 'react';
import styles from './DevelopmentModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { MdOutlineDeveloperMode } from 'react-icons/md';

interface DevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevelopmentModal: React.FC<DevelopmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <MdOutlineDeveloperMode className={styles.icon} />
          </div>
          <h2 className={styles.title}>Under Development</h2>
          <div className={styles.message}>
            <p>This feature is currently under active development.</p>
            <p>We're working hard to bring you an amazing multiplayer experience!</p>
            <p>Click anywhere to continue with the current version.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentModal; 