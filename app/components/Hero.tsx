'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import { FaUserFriends, FaBrain } from 'react-icons/fa';
import { MdComputer } from 'react-icons/md';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

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
        <div className={styles.welcomeText}>
          <h1>
            <span className={styles.welcomeLine}>Welcome to</span>
            <span className={styles.gameName}>Tic Tac Toe</span>
          </h1>
        </div>
        <p>Challenge your friends or play against the system</p>
        <div className={styles.cards}>
          <Link href="/2-players" className={`${styles.card} ${styles.cardYellow}`}> 
            <h2>2 PLAYERS</h2>
            <p>Challenge your friend in the classic game mode!</p>
            <div className={styles.button}>
              <FaUserFriends className={styles.buttonIcon} />
              Play Now
            </div>
          </Link>
          <Link href="/2-players-pro" className={`${styles.card} ${styles.cardBlue}`}> 
            <h2>2 PLAYERS PRO</h2>
            <p>Try our exciting new mode with only three marks each!</p>
            <div className={styles.button}>
              <GiPerspectiveDiceSixFacesRandom className={styles.buttonIcon} />
              Play Now
            </div>
          </Link>
          <Link href="/play-with-system" className={`${styles.card} ${styles.cardGreen}`}> 
            <h2>PLAY WITH SYSTEM</h2>
            <p>Test your skills against our intelligent system!</p>
            <div className={styles.button}>
              <MdComputer className={styles.buttonIcon} />
              Play Now
            </div>
          </Link>
          <Link href="/ai-learning" className={`${styles.card} ${styles.cardPurple}`}> 
            <h2>AI BUDDY</h2>
            <p>Train and evolve with our adaptive AI companion!</p>
            <div className={styles.button}>
              <FaBrain className={styles.buttonIcon} />
              Play Now
            </div>
          </Link>
        </div>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Multiple Modes</h3>
            <p>Choose from classic, advanced, or AI modes</p>
          </div>
          <div className={styles.feature}>
            <h3>Real-time Play</h3>
            <p>Enjoy smooth, responsive gameplay</p>
          </div>
          <div className={styles.feature}>
            <h3>Smart AI</h3>
            <p>Challenge our strategic AI opponent</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
 