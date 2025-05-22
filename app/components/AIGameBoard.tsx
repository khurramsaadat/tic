'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './AIGameBoard.module.css';
import SoundManager from '../utils/SoundManager';
import MuteButton from './MuteButton';
import { TicTacToeAI } from '../utils/TicTacToeAI';

interface AIGameBoardProps {
  playerName: string;
  aiName?: string;
  onGameEnd?: (winner: string | null) => void;
}

interface ScoreType {
  [key: string]: number;
}

const calculateWinner = (squares: Array<string | null>): [string | null, number[] | null] => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], line];
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

const AIGameBoard: React.FC<AIGameBoardProps> = ({ 
  playerName, 
  aiName = "AI", 
  onGameEnd 
}) => {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [scores, setScores] = useState<ScoreType>(() => ({
    [playerName]: 0,
    [aiName]: 0,
  }));
  const [selectedSquare, setSelectedSquare] = useState<number>(-1);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scoreUpdated, setScoreUpdated] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'draw'>('playing');
  const [gameEnded, setGameEnded] = useState(false);

  const [currentWinner] = calculateWinner(board);

  const getStatusMessage = useCallback(() => {
    if (gameState === 'won') {
      const winnerName = currentWinner === 'X' ? playerName : aiName;
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
          <div className={styles.winnerDisplay}>
            <div className={styles.winnerTitle}>GAME DRAW!</div>
            <div className={styles.winnerName}>Well played!</div>
          </div>
        </div>
      );
    }

    return null;
  }, [gameState, currentWinner, playerName, aiName]);

  const makeMove = useCallback((position: number) => {
    if (gameEnded || board[position] || !isPlayerTurn) {
      SoundManager.getInstance().playSound('invalid');
      return;
    }

    const newBoard = [...board];
    newBoard[position] = 'X'; // Player is always X
    SoundManager.getInstance().playSound('place');
    
    const [winner, line] = calculateWinner(newBoard);
    if (winner) {
      SoundManager.getInstance().playSound('win');
      setWinningLine(line);
      setGameState('won');
      setGameEnded(true);
      setScores(prev => ({
        ...prev,
        [playerName]: prev[playerName] + 1
      }));
      setScoreUpdated(playerName);
      if (onGameEnd) onGameEnd(playerName);
    } else if (!newBoard.includes(null)) {
      SoundManager.getInstance().playSound('draw');
      setGameState('draw');
      setGameEnded(true);
      if (onGameEnd) onGameEnd(null);
    } else {
      setIsPlayerTurn(false);
    }
    
    setBoard(newBoard);
  }, [board, gameEnded, isPlayerTurn, onGameEnd, playerName]);

  // AI Move
  useEffect(() => {
    if (!isPlayerTurn && !gameEnded) {
      const timer = setTimeout(() => {
        const aiMove = TicTacToeAI.getSmartMove(board, 'O');
        const newBoard = [...board];
        newBoard[aiMove] = 'O';
        SoundManager.getInstance().playSound('place');

        const [winner, line] = calculateWinner(newBoard);
        if (winner) {
          SoundManager.getInstance().playSound('win');
          setWinningLine(line);
          setGameState('won');
          setGameEnded(true);
          setScores(prev => ({
            ...prev,
            [aiName]: prev[aiName] + 1
          }));
          setScoreUpdated(aiName);
          if (onGameEnd) onGameEnd(aiName);
        } else if (!newBoard.includes(null)) {
          SoundManager.getInstance().playSound('draw');
          setGameState('draw');
          setGameEnded(true);
          if (onGameEnd) onGameEnd(null);
        }

        setBoard(newBoard);
        setIsPlayerTurn(true);
      }, 500); // Add a small delay to make it feel more natural

      return () => clearTimeout(timer);
    }
  }, [board, isPlayerTurn, gameEnded, aiName, onGameEnd]);

  const startNewGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setSelectedSquare(-1);
    setWinningLine(null);
    setScoreUpdated(null);
    setGameState('playing');
    setGameEnded(false);
  }, []);

  useEffect(() => {
    if (scoreUpdated) {
      const timer = setTimeout(() => setScoreUpdated(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [scoreUpdated]);

  return (
    <div className={styles.container}>
      <div className={styles.scoreBoard}>
        <div className={styles.scoreContent}>
          <div className={`${styles.playerScore} ${currentWinner === 'X' ? styles.winningPlayer : ''}`}>
            <span className={styles.playerName}>{playerName}</span>
            <span className={`${styles.score} ${scoreUpdated === playerName ? styles.updated : ''}`}>
              {scores[playerName]}
            </span>
          </div>
          <div className={`${styles.playerScore} ${currentWinner === 'O' ? styles.winningPlayer : ''}`}>
            <span className={styles.playerName}>{aiName}</span>
            <span className={`${styles.score} ${scoreUpdated === aiName ? styles.updated : ''}`}>
              {scores[aiName]}
            </span>
          </div>
        </div>
        <MuteButton />
      </div>

      <div className={styles.boardWrapper}>
        <Image 
          src="/grid.svg" 
          alt="Game Grid" 
          width={300} 
          height={300} 
          className={styles.gridImage}
          priority
        />
        <div className={styles.board} role="grid" aria-label="Tic-tac-toe game board">
          {board.map((square, i) => (
            <button
              key={i}
              className={`${styles.square} ${
                selectedSquare === i ? styles.selected : ''
              } ${winningLine?.includes(i) ? styles.winning : ''}`}
              onClick={() => makeMove(i)}
              onMouseEnter={() => !gameEnded && setSelectedSquare(i)}
              onMouseLeave={() => !gameEnded && setSelectedSquare(-1)}
              disabled={gameEnded || !!square || !isPlayerTurn}
              aria-label={`Square ${i + 1}${square ? ` marked with ${square}` : ''}`}
              role="gridcell"
            >
              {square && (
                <div 
                  className={`${styles.mark} ${winningLine?.includes(i) ? styles.winningMark : ''}`}
                  data-line={winningLine?.includes(i) ? getWinningLineType(winningLine) : undefined}
                >
                  <Image
                    src={`/${square === 'X' ? 'cross' : 'zero'}.svg`}
                    alt={square}
                    width={120}
                    height={120}
                    priority
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={`${styles.status} ${gameState === 'won' ? styles.winner : ''} ${gameState === 'draw' ? styles.draw : ''}`}>
        {getStatusMessage()}
      </div>

      <div className={styles.controls}>
        <button 
          className={`${styles.newGameButton} ${gameState === 'won' ? styles.winnerButton : ''}`}
          onClick={startNewGame}
          disabled={!gameEnded}
          aria-label="Start a new game"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default AIGameBoard; 