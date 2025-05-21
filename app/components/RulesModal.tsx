'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './RulesModal.module.css';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoShow?: boolean;
}

const CrossMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={styles.inlineMark}>
    <defs>
      <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4500" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
    </defs>
    <path
      d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
      fill="url(#crossGradient)"
    />
  </svg>
);

const ZeroMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={styles.inlineMark}>
    <defs>
      <linearGradient id="zeroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00BFFF" />
        <stop offset="100%" stopColor="#00FFFF" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
      fill="url(#zeroGradient)"
    />
  </svg>
);

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
            
            <h2 className={styles.title}>
              <div className={styles.titleMain}>2 PLAYERS+</div>
              <div className={styles.titleSub}>RULES</div>
            </h2>
            
            <div className={styles.content}>
              <ul className={styles.rulesList}>
                <li className={styles.ruleItem}>
                  <span className={styles.ruleNumber}>1</span>
                  <span className={styles.ruleText}>
                    Each player can only have 3 marks{' '}
                    <span className={styles.inlineMarks}>
                      (<CrossMark /> or <ZeroMark />)
                    </span>
                    {' '}on the board at a time
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