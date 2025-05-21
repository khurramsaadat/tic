'use client';

import { useState, useEffect, useCallback, useReducer } from 'react';
import Image from 'next/image';
import styles from './TestGameBoard.module.css';
import SoundManager from '../utils/SoundManager';
import MuteButton from './MuteButton';

interface TestGameBoardProps {
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
      if (state.board[action.index] || state.gameEnded) {
        return state;
      }

      const newBoard = [...state.board];
      const currentMark = state.isXNext ? 'X' : 'O';
      newBoard[action.index] = currentMark;

      const [winner, line] = calculateWinner(newBoard);
      const isDraw = !winner && !newBoard.includes(null);

      if (winner) {
        console.log('Winner detected:', winner);
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
        console.log('Draw detected');
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

const TestGameBoard: React.FC<TestGameBoardProps> = ({ player1Name, player2Name, onGameEnd }) => {
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

  const currentPlayer = state.isXNext ? player1Name : player2Name;
  const [currentWinner] = calculateWinner(state.board);

  useEffect(() => {
    if (state.scoreUpdated) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_SCORE_UPDATE' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.scoreUpdated]);

  // Add sound effects for game state changes
  useEffect(() => {
    const soundManager = SoundManager.getInstance();
    
    if (state.gameStatus === 'won') {
      soundManager.playSound('win');
    } else if (state.gameStatus === 'draw') {
      soundManager.playSound('draw');
    }
  }, [state.gameStatus]);

  const makeMove = useCallback((index: number) => {
    const soundManager = SoundManager.getInstance();
    
    if (state.board[index] || state.gameEnded) {
      soundManager.playSound('invalid');
      return;
    }

    soundManager.playSound('place');
    dispatch({ type: 'MAKE_MOVE', index, player1Name, player2Name });
  }, [state.board, state.gameEnded, player1Name, player2Name]);

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
            <div className={styles.winnerTitle}>Game Draw!</div>
            <div className={styles.winnerName}>Well played, both!</div>
          </div>
        </div>
      );
    }

    return null;
  }, [state.gameStatus, currentWinner, player1Name, player2Name]);

  return (
    <div className={styles.container}>
      <div className={styles.scoreBoard}>
        <div className={styles.scoreContent}>
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
          {state.board.map((square, index) => (
            <button
              key={index}
              className={`${styles.square} ${
                state.selectedSquare === index ? styles.selected : ''
              } ${state.winningLine?.includes(index) ? styles.winning : ''}`}
              onClick={() => makeMove(index)}
              onMouseEnter={() => !state.gameEnded && dispatch({ type: 'SET_SELECTED_SQUARE', square: index })}
              onMouseLeave={() => !state.gameEnded && dispatch({ type: 'SET_SELECTED_SQUARE', square: -1 })}
              disabled={state.gameEnded || !!square}
              aria-label={`Square ${index + 1}${square ? ` marked with ${square}` : ''}`}
              role="gridcell"
            >
              {square && (
                <div 
                  className={`${styles.mark} ${state.winningLine?.includes(index) ? styles.winningMark : ''}`}
                  data-line={state.winningLine?.includes(index) ? getWinningLineType(state.winningLine) : undefined}
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

      {(state.gameStatus === 'won' || state.gameStatus === 'draw') && (
        <div 
          className={`${styles.status} ${
            state.gameStatus === 'won' ? styles.winner : ''
          } ${state.gameStatus === 'draw' ? styles.draw : ''}`}
        >
          {getStatusMessage()}
        </div>
      )}

      {state.gameEnded && (
        <button 
          className={styles.newGameButton}
          onClick={() => dispatch({ type: 'START_NEW_GAME' })}
          aria-label="Start a new game"
        >
          Start New Game
        </button>
      )}
    </div>
  );
};

export default TestGameBoard;