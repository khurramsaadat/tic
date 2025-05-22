'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './TraditionalGameBoard.module.css';
import SoundManager from '../utils/SoundManager';
import MuteButton from './MuteButton';

interface TraditionalGameBoardProps {
  player1Name: string;
  player2Name: string;
  onGameEnd?: (winner: string | null) => void;
}

interface ScoreType {
  [key: string]: number;
}

const calculateWinner = (board: Array<string | null>): [string | null, number[] | null] => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [board[a], line];
    }
  }
  return [null, null];
};

const getWinningLineType = (line: number[]): string => {
  // Horizontal lines
  if ((line[0] === 0 && line[1] === 1 && line[2] === 2) ||
      (line[0] === 3 && line[1] === 4 && line[2] === 5) ||
      (line[0] === 6 && line[1] === 7 && line[2] === 8)) {
    return 'horizontal';
  }
  // Vertical lines
  if ((line[0] === 0 && line[1] === 3 && line[2] === 6) ||
      (line[0] === 1 && line[1] === 4 && line[2] === 7) ||
      (line[0] === 2 && line[1] === 5 && line[2] === 8)) {
    return 'vertical';
  }
  // Diagonal line (top-left to bottom-right)
  if (line[0] === 0 && line[1] === 4 && line[2] === 8) {
    return 'diagonal';
  }
  // Diagonal line (top-right to bottom-left)
  if (line[0] === 2 && line[1] === 4 && line[2] === 6) {
    return 'diagonal-reverse';
  }
  return 'horizontal';
};

const TraditionalGameBoard: React.FC<TraditionalGameBoardProps> = ({ player1Name, player2Name, onGameEnd }) => {
  // Add effect to clear localStorage on hard refresh
  useEffect(() => {
    const clearAllGameData = () => {
      localStorage.removeItem('traditionalBoard');
      localStorage.removeItem('traditionalIsXNext');
      localStorage.removeItem('traditionalScores');
      localStorage.removeItem('traditionalGameState');
      localStorage.removeItem('traditionalGameEnded');
      localStorage.removeItem('traditionalTicTacToeScores');
    };

    // Clear data when the component mounts
    clearAllGameData();

    // Add event listener for page reloads
    window.addEventListener('beforeunload', clearAllGameData);

    return () => {
      window.removeEventListener('beforeunload', clearAllGameData);
    };
  }, []);

  // Initialize state
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [scores, setScores] = useState<ScoreType>({
    [player1Name]: 0,
    [player2Name]: 0
  });
  const [selectedSquare, setSelectedSquare] = useState<number>(-1);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scoreUpdated, setScoreUpdated] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'draw' | 'won'>('playing');
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const [currentWinner, winningLineResult] = calculateWinner(board);

  useEffect(() => {
    if (scoreUpdated) {
      const timer = setTimeout(() => {
        setScoreUpdated(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [scoreUpdated]);

  const getStatusMessage = useCallback(() => {
    if (currentWinner) {
      const winnerName = currentWinner === 'X' ? player1Name : player2Name;
      return (
        <div className={styles.winnerInfo}>
          <div className={`${styles.winnerDisplay} ${currentWinner === 'X' ? styles.winnerX : styles.winnerO}`}>
            <div className={styles.winnerTitle}>WINNER!</div>
            <div className={styles.winnerName}>
              {winnerName}
            </div>
          </div>
        </div>
      );
    }

    if (gameState === 'draw') {
      return (
        <div className={styles.winnerInfo}>
          <div className={styles.winnerTitle}>GAME DRAW!</div>
          <div className={styles.winnerName}>Well played, both!</div>
        </div>
      );
    }

    const currentPlayer = isXNext ? player1Name : player2Name;
    const symbol = isXNext ? 'X' : 'O';
    return (
      <div className={styles.gameInfo}>
        <div className={styles.currentPlayer} data-player={symbol}>
          {currentPlayer}'s Turn{' '}
          <span className={styles.turnSymbol}>
            <Image
              src={`/${symbol === 'X' ? 'cross' : 'zero'}.svg`}
              alt={symbol}
              width={24}
              height={24}
              priority
            />
          </span>
        </div>
      </div>
    );
  }, [currentWinner, gameState, player1Name, player2Name, isXNext]);

  const makeMove = useCallback((position: number) => {
    if (gameEnded || board[position]) {
      SoundManager.getInstance().playSound('invalid');
      return;
    }

    const newBoard = [...board];
    const currentSymbol = isXNext ? 'X' : 'O';
    newBoard[position] = currentSymbol;

    const [winner, line] = calculateWinner(newBoard);
    const isDraw = !winner && !newBoard.includes(null);

    if (winner) {
      const winnerName = winner === 'X' ? player1Name : player2Name;
      SoundManager.getInstance().playSound('win');
      setWinningLine(line);
      setGameState('won');
      setGameEnded(true);
      setScores(prev => ({
        ...prev,
        [winnerName]: prev[winnerName] + 1
      }));
      setScoreUpdated(winnerName);
      if (onGameEnd) onGameEnd(winnerName);
    } else if (isDraw) {
      setGameState('draw');
      setGameEnded(true);
      if (onGameEnd) onGameEnd(null);
    } else {
      SoundManager.getInstance().playSound('place');
      setIsXNext(!isXNext);
    }

    setBoard(newBoard);
  }, [board, gameEnded, isXNext, onGameEnd, player1Name, player2Name]);

  const startNewGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setSelectedSquare(-1);
    setWinningLine(null);
    setGameState('playing');
    setGameEnded(false);
  }, []);

  const handleSquareClick = useCallback((position: number) => {
    makeMove(position);
  }, [makeMove]);

  return (
    <div className={styles.container}>
      <div className={styles.scoreBoard}>
        <div className={styles.scoreContent}>
          <div className={`${styles.playerScore} ${currentWinner === 'X' ? styles.winningPlayer : ''}`}>
            <span className={styles.playerName}>{player1Name}</span>
            <span className={`${styles.score} ${scoreUpdated === player1Name ? styles.scoreUpdated : ''}`}>
              {scores[player1Name]}
            </span>
          </div>
          <div className={`${styles.playerScore} ${currentWinner === 'O' ? styles.winningPlayer : ''}`}>
            <span className={styles.playerName}>{player2Name}</span>
            <span className={`${styles.score} ${scoreUpdated === player2Name ? styles.scoreUpdated : ''}`}>
              {scores[player2Name]}
            </span>
          </div>
        </div>
        <MuteButton />
      </div>

      <div className={styles.boardWrapper}>
        <Image
          src="/grid.svg"
          alt="Game Grid"
          width={600}
          height={600}
          className={styles.gridImage}
          priority
        />
        <div className={styles.board}>
          {board.map((square, i) => (
            <button
              key={i}
              className={`${styles.square} ${winningLine?.includes(i) ? styles.winning : ''}`}
              onClick={() => handleSquareClick(i)}
              disabled={Boolean(square) || gameEnded}
            >
              {square && (
                <div
                  className={`${styles.mark} ${winningLine?.includes(i) ? styles.winningMark : ''}`}
                  data-line={winningLine?.includes(i) ? getWinningLineType(winningLine) : undefined}
                >
                  <Image
                    src={`/${square === 'X' ? 'cross' : 'zero'}.svg`}
                    alt={square}
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

      <div className={styles.status}>
        {getStatusMessage()}
      </div>

      <button
        className={styles.newGameButton}
        onClick={startNewGame}
        disabled={!gameEnded}
      >
        New Game
      </button>
    </div>
  );
};

export default TraditionalGameBoard; 