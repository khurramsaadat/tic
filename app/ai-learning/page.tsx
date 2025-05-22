'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import DifficultySelector, { Difficulty } from './components/DifficultySelector';
import AILearningBoard from './components/AILearningBoard';

export default function AILearningPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  useEffect(() => {
    // Initialize any necessary setup
    document.title = 'AI Learning - TicTacToe';
  }, []);

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleGameEnd = (winner: 'X' | 'O' | null) => {
    // We'll add stats tracking here later
    console.log('Game ended with winner:', winner);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI Learning Mode</h1>
      <p className={styles.description}>Play against an AI that learns and adapts to your strategy.</p>
      <DifficultySelector
        onSelect={handleDifficultySelect}
        selectedDifficulty={selectedDifficulty}
      />
      <AILearningBoard
        difficulty={selectedDifficulty || 'medium'}
        onGameEnd={handleGameEnd}
      />
    </div>
  );
} 