'use client';

import { useState } from 'react';
import styles from './DifficultySelector.module.css';
import { FaBrain } from 'react-icons/fa';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  selectedDifficulty: Difficulty | null;
}

export default function DifficultySelector({ onSelect, selectedDifficulty }: DifficultySelectorProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <FaBrain className={styles.icon} />
        Select AI Difficulty
      </h2>
      <div className={styles.buttons}>
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            className={`${styles.button} ${selectedDifficulty === difficulty ? styles.selected : ''}`}
            onClick={() => onSelect(difficulty)}
            aria-pressed={selectedDifficulty === difficulty}
          >
            {difficulty}
          </button>
        ))}
      </div>
    </div>
  );
} 