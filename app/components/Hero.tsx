'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.background}>
        <Image
          src="/hero-background.svg"
          alt="Tic Tac Toe Board"
          fill
          priority
          className={styles.backgroundImage}
        />
      </div>
      <div className={styles.content}>
        <h1>Welcome to Tic Tac Toe</h1>
        <p>Challenge your friends or play against the system</p>
        <div className={styles.buttons}>
          <Link href="/2-players" className={styles.button}>
            Play 2 Players
          </Link>
          <Link href="/2-players-plus" className={styles.button}>
            Play 2 Players+
          </Link>
          <Link href="/play-with-system" className={styles.button}>
            Play with AI
          </Link>
        </div>
      </div>
    </div>
  );
} 
 