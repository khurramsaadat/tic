'use client';

import { useState } from 'react';
import AIGameBoard from '../components/AIGameBoard';
import styles from './page.module.css';

export default function PlayWithSystem() {
  const [playerName] = useState("Player");
  const [aiName] = useState("AI");

  return (
    <main className={styles.main}>
      <AIGameBoard 
        playerName={playerName}
        aiName={aiName}
      />
    </main>
  );
} 