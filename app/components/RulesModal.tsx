'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './RulesModal.module.css';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoShow?: boolean;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, autoShow = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showRulesButton, setShowRulesButton] = useState(false);

  // Handle initial auto-show
  useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => {
        setShowRulesButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowRulesButton(true);
    }
  }, [autoShow]);

  // Handle animation states
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {showRulesButton && !isOpen && (
        <button 
          className={styles.rulesButton}
          onClick={onClose}
          title="Game Rules"
        >
          <Image
            src="/info-icon.svg"
            alt="Rules"
            width={24}
            height={24}
            priority
          />
        </button>
      )}

      {isOpen && (
        <div 
          className={`${styles.modalOverlay} ${isVisible ? styles.visible : ''}`}
          onClick={handleOverlayClick}
        >
          <div className={`${styles.modal} ${isVisible ? styles.visible : ''}`}>
            <button className={styles.closeButton} onClick={onClose}>×</button>
            
            <h2 className={styles.title}>2 Players+ Mode Rules</h2>
            
            <div className={styles.content}>
              <ul className={styles.rulesList}>
                <li className={styles.ruleItem}>
                  <span className={styles.ruleNumber}>1</span>
                  <span className={styles.ruleText}>
                    Each player can only have 3 marks (X or O) on the board at a time
                  </span>
                </li>
                <li className={styles.ruleItem}>
                  <span className={styles.ruleNumber}>2</span>
                  <span className={styles.ruleText}>
                    When placing a 4th mark, your oldest mark will be removed automatically
                  </span>
                </li>
                <li className={styles.ruleItem}>
                  <span className={styles.ruleNumber}>3</span>
                  <span className={styles.ruleText}>
                    Win by getting 3 of your marks in a row (horizontal, vertical, or diagonal)
                  </span>
                </li>
              </ul>

              <div className={styles.example}>
                <h3 className={styles.exampleTitle}>Strategy Tip</h3>
                <p>
                  Think ahead! You can use the mark removal mechanic to break your 
                  opponent's winning patterns or create new opportunities for yourself.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RulesModal; 