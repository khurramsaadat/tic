'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './AILearningBoard.module.css';
import { Difficulty } from './DifficultySelector';
import { QLearning } from '../utils/QLearning';
import AIStats from './AIStats';
import MuteButton from '@/app/components/MuteButton';
import SoundManager from '@/app/utils/SoundManager';
import { FaBrain } from 'react-icons/fa';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface AILearningBoardProps {
  difficulty: Difficulty;
  onGameEnd?: (winner: Player) => void;
}

export default function AILearningBoard({ difficulty, onGameEnd }: AILearningBoardProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [stats, setStats] = useState({
    explorationRate: 0,
    statesLearned: 0,
    totalQValues: 0
  });
  const [scores, setScores] = useState({
    player: 0,
    ai: 0
  });
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const qLearning = useRef<QLearning>(new QLearning(difficulty));
  const lastState = useRef<Board | null>(null);
  const lastAction = useRef<number | null>(null);

  // Update stats periodically
  useEffect(() => {
    const updateStats = () => {
      setStats(qLearning.current.getPerformanceStats());
    };

    updateStats(); // Initial update
    const interval = setInterval(updateStats, 1000);

    return () => clearInterval(interval);
  }, []);

  // Reset game when difficulty changes
  useEffect(() => {
    handleReset();
    qLearning.current = new QLearning(difficulty);
  }, [difficulty]);

  const handleReset = () => {
    qLearning.current.reset();
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setStats(qLearning.current.getPerformanceStats());
    setWinningLine(null);
  };

  const checkWinner = (squares: Board): [Player, number[] | null] => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], [a, b, c]];
      }
    }
    return [null, null];
  };

  const calculateReward = (currentBoard: Board, isAIWinner: boolean): number => {
    if (isAIWinner) return 1;
    if (checkWinner(currentBoard)[0] === 'X') return -1;
    if (!currentBoard.includes(null)) return 0.5; // Draw
    return 0;
  };

  const handleClick = async (index: number) => {
    // Don't allow moves if no difficulty is selected
    if (!difficulty) {
      return;
    }
    
    if (!isPlayerTurn || board[index] || winner || isThinking) {
      SoundManager.getInstance().playSound('invalid');
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    SoundManager.getInstance().playSound('place');

    const [currentWinner, line] = checkWinner(newBoard);
    if (currentWinner) {
      setWinner(currentWinner);
      setWinningLine(line);
      setScores(prev => ({...prev, player: prev.player + 1}));
      if (lastState.current !== null && lastAction.current !== null) {
        qLearning.current.update(lastState.current, lastAction.current, newBoard, -1);
      }
      SoundManager.getInstance().playSound('win');
      onGameEnd?.(currentWinner);
      return;
    }

    if (!newBoard.includes(null)) {
      setWinner(null);
      if (lastState.current !== null && lastAction.current !== null) {
        qLearning.current.update(lastState.current, lastAction.current, newBoard, 0.5);
      }
      onGameEnd?.(null);
      return;
    }

    setIsPlayerTurn(false);
    setIsThinking(true);

    // Simulate AI thinking time based on difficulty
    const thinkingTime = {
      easy: 500,
      medium: 800,
      hard: 1200
    }[difficulty];

    setTimeout(() => {
      makeAIMove(newBoard);
      setIsThinking(false);
    }, thinkingTime);
  };

  const makeAIMove = (currentBoard: Board) => {
    const action = qLearning.current.chooseAction(currentBoard);
    const newBoard = [...currentBoard];
    newBoard[action] = 'O';
    setBoard(newBoard);
    SoundManager.getInstance().playSound('place');

    // Store state and action for next update
    lastState.current = currentBoard;
    lastAction.current = action;

    const [currentWinner, line] = checkWinner(newBoard);
    if (currentWinner) {
      setWinner(currentWinner);
      setWinningLine(line);
      setScores(prev => ({...prev, ai: prev.ai + 1}));
      qLearning.current.update(currentBoard, action, newBoard, 1);
      SoundManager.getInstance().playSound('win');
      onGameEnd?.(currentWinner);
      return;
    }

    if (!newBoard.includes(null)) {
      setWinner(null);
      qLearning.current.update(currentBoard, action, newBoard, 0.5);
      onGameEnd?.(null);
      return;
    }

    qLearning.current.update(currentBoard, action, newBoard, 0);
    setIsPlayerTurn(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameSection}>
        <div className={styles.scoreBoard}>
          <div className={styles.scoreContent}>
            <div className={`${styles.playerScore} ${isPlayerTurn && !winner ? styles.activePlayer : ''}`}>
              <span className={styles.playerName}>You</span>
              <span className={styles.score}>{scores.player}</span>
            </div>
            {isThinking && (
              <div className={styles.thinkingBrain}>
                <FaBrain className={styles.brainIcon} />
              </div>
            )}
            <div className={`${styles.playerScore} ${styles.aiScore} ${!isPlayerTurn && !winner ? styles.activePlayer : ''}`}>
              <span className={styles.playerName}>AI</span>
              <span className={styles.score}>{scores.ai}</span>
            </div>
          </div>
          <MuteButton />
        </div>

        <div className={styles.boardWrapper}>
          <Image
            src="/grid.svg"
            alt="Game Grid"
            className={styles.gridImage}
            width={600}
            height={600}
            priority
          />
          <div className={styles.board}>
            {board.map((cell, index) => (
              <button
                key={index}
                className={`${styles.cell} ${winningLine?.includes(index) ? styles.winning : ''}`}
                onClick={() => handleClick(index)}
                disabled={!difficulty || !isPlayerTurn || !!winner || !!cell || isThinking}
                aria-label={`Cell ${index + 1}`}
              >
                {cell && (
                  <div className={`${styles.mark} ${winningLine?.includes(index) ? styles.winningMark : ''}`}>
                    <Image
                      src={`/${cell === 'X' ? 'cross' : 'zero'}.svg`}
                      alt={cell}
                      width={180}
                      height={180}
                      priority
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {winner && (
          <div className={styles.winnerInfo}>
            <div className={`${styles.winnerDisplay} ${winner === 'X' ? styles.winnerX : styles.winnerO}`}>
              <div className={styles.winnerTitle}>WINNER!</div>
              <div className={styles.winnerName}>
                {winner === 'X' ? 'You' : 'AI'}
              </div>
            </div>
          </div>
        )}
        
        {!winner && !board.includes(null) && (
          <div className={styles.winnerInfo}>
            <div className={styles.winnerTitle}>GAME DRAW!</div>
          </div>
        )}

        <button 
          className={`${styles.newGameButton} ${(!winner && board.includes(null)) ? styles.disabled : ''}`} 
          onClick={handleReset}
          disabled={!winner && board.includes(null)}
        >
          New Game
        </button>
      </div>
      
      {difficulty && (
        <AIStats
          explorationRate={stats.explorationRate}
          statesLearned={stats.statesLearned}
          totalQValues={stats.totalQValues}
          onReset={handleReset}
        />
      )}
    </div>
  );
} 