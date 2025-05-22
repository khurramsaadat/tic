'use client';

import { useState, useEffect, useCallback, useReducer } from 'react';
import Image from 'next/image';
import styles from './GameBoard.module.css';
import SoundManager from '../utils/SoundManager';
import MuteButton from './MuteButton';

export interface GameBoardProps {
  player1Name: string;
  player2Name: string;
  onGameEnd?: (winner: string | null) => void;
}

interface ScoreType {
  [key: string]: number;
}

interface GameState {
  board: Array<string | null>;
  isXNext: boolean;
  gameStatus: 'playing' | 'won' | 'draw';
  gameEnded: boolean;
  winningLine: number[] | null;
  scores: ScoreType;
  scoreUpdated: string | null;
  selectedSquare: number;
}

type GameAction =
  | { type: 'MAKE_MOVE'; index: number; player1Name: string; player2Name: string }
  | { type: 'START_NEW_GAME' }
  | { type: 'SET_SELECTED_SQUARE'; square: number }
  | { type: 'CLEAR_SCORE_UPDATE' };

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

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MAKE_MOVE': {
      // Traditional rules: Can only place on empty squares and game must not be over
      if (state.board[action.index] || state.gameEnded) {
        return state;
      }

      const newBoard = [...state.board];
      const currentMark = state.isXNext ? 'X' : 'O';
      newBoard[action.index] = currentMark;

      const [winner, line] = calculateWinner(newBoard);
      const isDraw = !winner && !newBoard.includes(null);

      if (winner) {
        const winnerName = winner === 'X' ? action.player1Name : action.player2Name;
        return {
          ...state,
          board: newBoard,
          gameStatus: 'won',
          gameEnded: true,
          winningLine: line,
          scores: {
            ...state.scores,
            [winnerName]: state.scores[winnerName] + 1
          },
          scoreUpdated: winnerName
        };
      }

      if (isDraw) {
        return {
          ...state,
          board: newBoard,
          gameStatus: 'draw',
          gameEnded: true
        };
      }

      return {
        ...state,
        board: newBoard,
        isXNext: !state.isXNext
      };
    }

    case 'START_NEW_GAME':
      return {
        ...state,
        board: Array(9).fill(null),
        isXNext: true,
        gameStatus: 'playing',
        gameEnded: false,
        winningLine: null,
        scoreUpdated: null,
        selectedSquare: -1
      };

    case 'SET_SELECTED_SQUARE':
      return {
        ...state,
        selectedSquare: action.square
      };

    case 'CLEAR_SCORE_UPDATE':
      return {
        ...state,
        scoreUpdated: null
      };

    default:
      return state;
  }
};

const GameBoard = ({ player1Name, player2Name, onGameEnd }: GameBoardProps) => {
  // Add effect to clear localStorage on hard refresh
  useEffect(() => {
    const clearScores = () => {
      localStorage.removeItem('testTicTacToeScores');
    };

    // Clear scores when the component mounts
    clearScores();

    // Add event listener for page reloads
    window.addEventListener('beforeunload', clearScores);

    return () => {
      window.removeEventListener('beforeunload', clearScores);
    };
  }, []);

  const [state, dispatch] = useReducer(gameReducer, {
    board: Array(9).fill(null),
    isXNext: true,
    gameStatus: 'playing',
    gameEnded: false,
    winningLine: null,
    scores: {
      [player1Name]: 0,
      [player2Name]: 0
    },
    scoreUpdated: null,
    selectedSquare: -1
  });

  const [currentWinner] = calculateWinner(state.board);

  useEffect(() => {
    if (state.scoreUpdated) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_SCORE_UPDATE' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.scoreUpdated]);

  const getStatusMessage = useCallback(() => {
    if (state.gameStatus === 'won') {
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

    if (state.gameStatus === 'draw') {
      return (
        <div className={styles.winnerInfo}>
          <div className={styles.winnerDisplay}>
            <div className={styles.winnerTitle}>GAME DRAW!</div>
            <div className={styles.winnerName}>Well played!</div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.gameInfo}>
        <div className={styles.currentPlayer}>
          {state.isXNext ? player1Name : player2Name}'s Turn{' '}
          <span className={styles.turnSymbol}>
            <Image
              src={`/${state.isXNext ? 'cross' : 'zero'}.svg`}
              alt={state.isXNext ? 'X' : 'O'}
              width={24}
              height={24}
              priority
            />
          </span>
        </div>
      </div>
    );
  }, [state.gameStatus, state.isXNext, currentWinner, player1Name, player2Name]);

  const makeMove = useCallback((position: number) => {
    if (state.gameEnded || state.board[position]) {
      SoundManager.getInstance().playSound('invalid');
      return;
    }

    dispatch({ 
      type: 'MAKE_MOVE', 
      index: position,
      player1Name,
      player2Name
    });
    SoundManager.getInstance().playSound('place');
  }, [state.gameEnded, state.board, player1Name, player2Name]);

  const startNewGame = useCallback(() => {
    dispatch({ type: 'START_NEW_GAME' });
  }, []);

  const handleSquareClick = useCallback((position: number) => {
    makeMove(position);
  }, [makeMove]);

  return (
    <div className={styles.container}>
      <div className={styles.scoreBoard}>
        <div className={`${styles.playerScore} ${currentWinner === 'X' ? styles.winningPlayer : ''}`}>
          <span className={styles.playerName}>{player1Name}</span>
          <span className={`${styles.score} ${state.scoreUpdated === player1Name ? styles.scoreUpdated : ''}`}>
            {state.scores[player1Name]}
          </span>
        </div>
        <div className={`${styles.playerScore} ${currentWinner === 'O' ? styles.winningPlayer : ''}`}>
          <span className={styles.playerName}>{player2Name}</span>
          <span className={`${styles.score} ${state.scoreUpdated === player2Name ? styles.scoreUpdated : ''}`}>
            {state.scores[player2Name]}
          </span>
        </div>
      </div>

      {getStatusMessage()}

      <div className={styles.board}>
        {state.winningLine && (
          <div 
            className={`${styles.line} ${styles[getWinningLineType(state.winningLine)]}`}
            style={{
              top: state.winningLine[0] <= 2 ? `calc(${Math.floor(state.winningLine[0] / 3) * 33.33}% + 45px)` :
                    state.winningLine[0] <= 5 ? `calc(${Math.floor(state.winningLine[0] / 3) * 33.33}% + 45px)` :
                    `calc(${Math.floor(state.winningLine[0] / 3) * 33.33}% + 45px)`
            }}
          />
        )}
        {state.board.map((square, i) => (
          <button
            key={i}
            className={`${styles.square} ${state.winningLine?.includes(i) ? styles.winning : ''}`}
            onClick={() => handleSquareClick(i)}
            disabled={Boolean(square) || state.gameEnded}
          >
            {square && (
              <Image
                src={`/${square === 'X' ? 'cross' : 'zero'}.svg`}
                alt={square}
                width={60}
                height={60}
                className={`${styles.mark} ${square === 'X' ? styles.markX : styles.markO}`}
                priority
              />
            )}
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={startNewGame}
          disabled={!state.gameEnded}
        >
          New Game
        </button>
        <MuteButton />
      </div>
    </div>
  );
};

export default GameBoard; 