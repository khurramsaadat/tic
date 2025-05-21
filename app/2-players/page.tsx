'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PlayerForm from '@/app/components/PlayerForm';
import styles from './page.module.css';

const TestGameBoard = dynamic(() => import('@/app/components/TestGameBoard'), {
  ssr: false,
});

export default function TestPage() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const handleStartGame = (names: { player1: string; player2: string }) => {
    setPlayer1Name(names.player1);
    setPlayer2Name(names.player2);
    setGameStarted(true);
  };

  const handleGameEnd = () => {
    // Increment the key to reset the board but keep player names
    setGameKey(prev => prev + 1);
  };

  return (
    <div className={styles.container}>
      {!gameStarted ? (
        <PlayerForm onStart={handleStartGame} />
      ) : (
        <TestGameBoard
          key={gameKey}
          player1Name={player1Name}
          player2Name={player2Name}
          onGameEnd={handleGameEnd}
        />
      )}
    </div>
  );
} 