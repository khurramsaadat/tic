'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import PlayerForm from '@/app/components/PlayerForm';
import styles from './page.module.css';

// Loading component for the game board
const LoadingGameBoard = () => (
  <div className={styles.loading}>
    Loading advanced game board...
  </div>
);

// Dynamic import with loading component
const AdvancedGameBoard = dynamic(() => import('@/app/components/AdvancedGameBoard'), {
  ssr: false,
  loading: () => <LoadingGameBoard />
});

export default function TwoPlayersPlusPage() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const handleStartGame = (names: { player1: string; player2: string }) => {
    setPlayer1Name(names.player1);
    setPlayer2Name(names.player2);
    setGameStarted(true);
  };

  const handleGameEnd = (winner: string | null) => {
    // Don't automatically reset the game
    // The game will be reset when the user clicks "New Game"
  };

  return (
    <main className={styles.container}>
      {!gameStarted ? (
        <PlayerForm onStart={handleStartGame} />
      ) : (
        <Suspense fallback={<LoadingGameBoard />}>
          <AdvancedGameBoard
            key={gameKey}
            player1Name={player1Name}
            player2Name={player2Name}
            onGameEnd={handleGameEnd}
          />
        </Suspense>
      )}
    </main>
  );
} 