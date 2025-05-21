import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.welcomeText}>
        <h1>
          <span className={styles.welcomeLine}>Welcome to</span>
          <span className={styles.gameName}>Tic Tac Toe</span>
        </h1>
      </div>

      <div className={styles.gameModes}>
        <Link href="/play-with-system" className={styles.modeCard}>
          <h2>PLAY WITH AI</h2>
          <p>Test your skills against our intelligent AI!</p>
          <span className={styles.playButton}>Play Now</span>
        </Link>

        <Link href="/2-players" className={styles.modeCard}>
          <h2>2 PLAYERS</h2>
          <p>Challenge your friend in the classic game mode!</p>
          <span className={styles.playButton}>Play Now</span>
        </Link>

        <Link href="/2-players-plus" className={styles.modeCard}>
          <h2>2 PLAYERS+</h2>
          <p>Try our exciting new mode with only three marks each!</p>
          <span className={styles.playButton}>Play Now</span>
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
  );
}
