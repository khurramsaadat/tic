'use client';

import React from 'react';
import styles from './page.module.css';
import { FaUserFriends } from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { MdComputer } from 'react-icons/md';
import { FaBrain } from 'react-icons/fa';
import { BsGrid3X3 } from 'react-icons/bs';
import { MdSwapHoriz } from 'react-icons/md';

const XMark = ({ id = Math.random().toString(36).substr(2, 9) }) => (
  <svg className={styles.mark} viewBox="0 0 100 100" width="30" height="30">
    <defs>
      <linearGradient id={`xGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF0000" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    <path
      d="M15,15 L85,85 M85,15 L15,85"
      stroke={`url(#xGradient-${id})`}
      strokeWidth="10"
      strokeLinecap="round"
    />
  </svg>
);

const OMark = ({ id = Math.random().toString(36).substr(2, 9) }) => (
  <svg className={styles.mark} viewBox="0 0 100 100" width="30" height="30">
    <defs>
      <linearGradient id={`oGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0000FF" />
        <stop offset="100%" stopColor="#00BFFF" />
      </linearGradient>
    </defs>
    <circle
      cx="50"
      cy="50"
      r="35"
      stroke={`url(#oGradient-${id})`}
      strokeWidth="10"
      fill="none"
    />
  </svg>
);

export default function Help() {
  return (
    <div className={styles.container}>
      <h1>Help Center</h1>
      
      <section className={styles.section}>
        <h2>Getting Started</h2>
        <p>Welcome to Tic Tac Toe! Choose from our different game modes to start playing:</p>
        <ul>
          <li><strong>2 Players</strong> - Classic tic-tac-toe game for two players</li>
          <li><strong>2 Players Pro</strong> - Enhanced version with special moves and strategies</li>
          <li><strong>Play with System</strong> - Challenge our intelligent system</li>
          <li><strong>AI Learning</strong> - Watch and learn as AI agents evolve</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Game Modes & Rules</h2>
        
        <div className={styles.gameMode}>
          <h3><FaUserFriends className={styles.modeIcon} /> 2 Players</h3>
          <p>The classic game of Tic Tac Toe you know and love!</p>
          <div className={styles.marksExample}>
            Player 1: <XMark /> vs Player 2: <OMark />
          </div>
          <ul>
            <li>Two players take turns marking <XMark /> and <OMark /> on a 3x3 grid</li>
            <li>First player uses <XMark />, second player uses <OMark /></li>
            <li>Get three marks in a row (horizontal, vertical, or diagonal) to win</li>
            <li>Game ends in a draw if no player achieves three in a row</li>
            <li>Track your wins with the built-in score counter</li>
          </ul>
        </div>

        <div className={styles.gameMode}>
          <h3><GiPerspectiveDiceSixFacesRandom className={styles.modeIcon} /> 2 Players Pro</h3>
          <p>An advanced version that adds a strategic twist to the classic game!</p>
          <div className={styles.marksExample}>
            Limited to 3 marks each: <XMark /> <XMark /> <XMark /> vs <OMark /> <OMark /> <OMark />
          </div>
          <ul>
            <li>Each player has exactly three <XMark /> or <OMark /> marks to use</li>
            <li>When placing a fourth mark, your oldest mark disappears</li>
            <li>Plan your moves carefully - position matters more than ever</li>
            <li>Use strategic repositioning to block opponents or create winning lines</li>
            <li>Perfect for players who want an extra challenge</li>
          </ul>
        </div>

        <div className={styles.gameMode}>
          <h3><MdComputer className={styles.modeIcon} /> Play with System</h3>
          <p>Test your skills against our intelligent system!</p>
          <div className={styles.marksExample}>
            You: <XMark /> vs System: <OMark />
          </div>
          <ul>
            <li>Play as <XMark /> against the system's <OMark /></li>
            <li>System analyzes the board and responds with strategic moves</li>
            <li>Learn different strategies by observing the system's play style</li>
            <li>Great for practice and improving your game</li>
            <li>Challenge yourself to beat the system</li>
          </ul>
        </div>

        <div className={styles.gameMode}>
          <h3><FaBrain className={styles.modeIcon} /> AI Learning</h3>
          <p>Experience an evolving AI agent that learns from each game with you!</p>
          <div className={styles.marksExample}>
            You: <XMark /> vs AI Agent: <OMark />
          </div>
          <ul>
            <li>Play against an AI agent that learns from your gameplay</li>
            <li>AI agent adapts and improves its strategy with each game</li>
            <li>Experience different approaches as the AI evolves</li>
            <li>Perfect for understanding advanced gameplay patterns</li>
            <li>Great educational tool for learning about AI and game theory</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faq}>
          <h3>How do I start a new game?</h3>
          <p>Click the "New Game" button available in each game mode to start fresh.</p>
          
          <h3>Can I customize player names?</h3>
          <p>Yes! In 2 Players and 2 Players Pro modes, you can enter custom names for both players.</p>
          
          <h3>How does the scoring work?</h3>
          <p>Players earn 1 point for each win. Scores are tracked during your session.</p>
          
          <h3>What happens in case of a draw?</h3>
          <p>The game will declare it a draw and allow you to start a new game.</p>

          <h3>Can I mute the game sounds?</h3>
          <p>Yes! Use the mute button in the top section of each game to toggle sound effects.</p>

          <h3>How do I know whose turn it is?</h3>
          <p>The game clearly indicates the current player's turn (<XMark /> or <OMark />), and the board will only accept moves from the active player.</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Pro Tips</h2>
        <div className={styles.tips}>
          <div className={styles.tip}>
            <BsGrid3X3 className={styles.tipIcon} />
            <h4>Corner Strategy</h4>
            <p>In classic mode, try to secure the corners first with your <XMark /> or <OMark /> - they offer more winning combinations!</p>
          </div>
          <div className={styles.tip}>
            <MdSwapHoriz className={styles.tipIcon} />
            <h4>Mark Movement</h4>
            <p>In 2 Players Pro, plan your mark movements carefully - sometimes moving an old <XMark /> or <OMark /> is better than placing a new one.</p>
          </div>
        </div>
      </section>
    </div>
  );
} 