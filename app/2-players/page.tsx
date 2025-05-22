'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import PlayerForm from '../components/PlayerForm';
import ErrorBoundary from '../components/ErrorBoundary';
import styles from './page.module.css';

// Loading component for the game board
const LoadingGameBoard = () => (
  <div className={styles.loading}>
    Loading game board...
  </div>
);

// Dynamic import with loading component and proper error handling
const TraditionalGameBoard = dynamic(
  () => import('../components/TraditionalGameBoard').catch(err => {
    console.error('Error loading TraditionalGameBoard:', err);
    return () => (
      <div className={styles.error}>
        Failed to load game board. Please refresh the page.
      </div>
    );
  }),
  {
    ssr: false,
    loading: () => <LoadingGameBoard />
  }
);

export default function TwoPlayersPage() {
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
    // Don't automatically reset the game
    // The game will be reset when the user clicks "New Game"
  };

  return (
    <div className={styles.container}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {!gameStarted ? (
          <PlayerForm onStart={handleStartGame} />
        ) : (
          <ErrorBoundary>
            <Suspense fallback={<LoadingGameBoard />}>
              <TraditionalGameBoard
                key={gameKey}
                player1Name={player1Name}
                player2Name={player2Name}
                onGameEnd={handleGameEnd}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
} 