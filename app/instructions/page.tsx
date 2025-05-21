'use client';

import React from 'react';
import styles from './page.module.css';
import { FaUserFriends, FaRobot } from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { BsGrid3X3 } from 'react-icons/bs';
import { MdSwapHoriz } from 'react-icons/md';
import Image from 'next/image';

export default function InstructionsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>How to Play</h1>
      
      <section className={styles.section}>
        <h2>2 PLAYERS</h2>
        <p>Classic Tic-tac-toe where two players take turns marking X and O on a 3x3 grid. First to get three in a row wins!</p>
        <div className={styles.visualGuide}>
          <Image
            src="/images/classic-board.png"
            alt="Classic Tic-tac-toe board demonstration"
            width={300}
            height={300}
            className={styles.boardImage}
            priority={true}
          />
        </div>
        <ul className={styles.tips}>
          <li>Take turns placing marks in empty squares</li>
          <li>First player uses X, second player uses O</li>
          <li>Get three marks in a row to win (horizontal, vertical, or diagonal)</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2 PLAYERS+</h2>
        <p>Advanced mode with a twist! Each player has only three marks. When placing a fourth mark, your oldest mark disappears!</p>
        <div className={styles.visualGuide}>
          <div className={styles.moveIndicator}>Oldest mark moves here →</div>
          <Image
            src="/images/advanced-board.png"
            alt="Advanced Tic-tac-toe board demonstration"
            width={300}
            height={300}
            className={styles.boardImage}
          />
        </div>
        <ul className={styles.tips}>
          <li>Each player has exactly three marks</li>
          <li>Placing a fourth mark removes your oldest one</li>
          <li>Strategic movement is key to victory</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>PLAY WITH AI</h2>
        <p>Challenge our AI opponent! The AI analyzes the board and makes strategic moves to challenge your skills.</p>
        <div className={styles.visualGuide}>
          <Image
            src="/images/ai-board.png"
            alt="AI mode board demonstration"
            width={300}
            height={300}
            className={styles.boardImage}
          />
        </div>
        <ul className={styles.tips}>
          <li>You play as X, AI plays as O</li>
          <li>AI responds quickly with strategic moves</li>
          <li>Test your skills against different AI strategies</li>
        </ul>
      </section>

      <div className={styles.startPlaying}>
        <p>Ready to play? Choose your game mode and start playing!</p>
      </div>
    </div>
  );
} 