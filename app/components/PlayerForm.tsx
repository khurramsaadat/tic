'use client';

import { useState } from 'react';
import styles from './PlayerForm.module.css';
import Image from 'next/image';

interface PlayerFormProps {
  onStart: (names: { player1: string; player2: string }) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onStart }) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1Name.trim() && player2Name.trim()) {
      onStart({ player1: player1Name.trim(), player2: player2Name.trim() });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="player1">
          Player 1 <Image src="/cross.svg" alt="X" width={24} height={24} className={styles.markIcon} priority />
        </label>
        <input
          type="text"
          id="player1"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
          required
          maxLength={20}
          placeholder="Enter name"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="player2">
          Player 2 <Image src="/zero.svg" alt="O" width={24} height={24} className={styles.markIcon} priority />
        </label>
        <input
          type="text"
          id="player2"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
          required
          maxLength={20}
          placeholder="Enter name"
        />
      </div>
      <button 
        type="submit" 
        className={styles.button}
        disabled={!player1Name || !player2Name}
      >
        Start Game
      </button>
    </form>
  );
};

export default PlayerForm; 