'use client';

import { useState, useEffect } from 'react';
import styles from './AIStats.module.css';
import { FaBrain, FaRedo } from 'react-icons/fa';

interface AIStatsProps {
  explorationRate: number;
  statesLearned: number;
  totalQValues: number;
  onReset: () => void;
}

export default function AIStats({
  explorationRate,
  statesLearned,
  totalQValues,
  onReset
}: AIStatsProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleResetClick = () => {
    if (!showConfirmReset) {
      setShowConfirmReset(true);
      return;
    }
    onReset();
    setShowConfirmReset(false);
  };

  // Hide confirmation after 3 seconds
  useEffect(() => {
    if (showConfirmReset) {
      const timer = setTimeout(() => {
        setShowConfirmReset(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmReset]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaBrain className={styles.icon} />
        <h3>AI Learning Progress</h3>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <label>Exploration Rate:</label>
          <div className={styles.value}>
            <div 
              className={styles.progressBar}
              style={{ width: `${explorationRate * 100}%` }}
            />
            <span>{(explorationRate * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <label>States Learned:</label>
          <span className={styles.value}>{statesLearned}</span>
        </div>

        <div className={styles.statItem}>
          <label>Total Q-Values:</label>
          <span className={styles.value}>{totalQValues}</span>
        </div>
      </div>

      <button
        className={`${styles.resetButton} ${showConfirmReset ? styles.confirm : ''}`}
        onClick={handleResetClick}
        aria-label="Reset AI learning progress"
      >
        <FaRedo className={styles.resetIcon} />
        {showConfirmReset ? 'Click again to confirm' : 'Reset Learning'}
      </button>
    </div>
  );
} 