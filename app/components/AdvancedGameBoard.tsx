'use client';

import { useState, useEffect, useCallback, useReducer } from 'react';
import Image from 'next/image';
import styles from './AdvancedGameBoard.module.css';
import SoundManager from '../utils/SoundManager';
import MuteButton from './MuteButton';

interface AdvancedGameBoardProps {
  player1Name: string;
  player2Name: string;
  onGameEnd?: (winner: string | null) => void;
}

interface ScoreType {
  [key: string]: number;
}

interface Mark {
  position: number;
  symbol: 'X' | 'O';
  timestamp: number;
}

const calculateWinner = (currentMarks: Mark[]): [string | null, number[] | null] => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const boardState = Array(9).fill(null);
  currentMarks.forEach(mark => {
    boardState[mark.position] = mark.symbol;
  });

  for (const line of lines) {
    const [a, b, c] = line;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return [boardState[a], line];
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

const AdvancedGameBoard: React.FC<AdvancedGameBoardProps> = ({ player1Name, player2Name, onGameEnd }) => {
  // Add effect to clear localStorage on hard refresh
  useEffect(() => {
    const clearAllGameData = () => {
      // Clear all game-related data from localStorage
      localStorage.removeItem('advancedBoard');
      localStorage.removeItem('advancedIsXNext');
      localStorage.removeItem('advancedScores');
      localStorage.removeItem('advancedMarks');
      localStorage.removeItem('advancedGameState');
      localStorage.removeItem('advancedGameEnded');
      localStorage.removeItem('advancedTicTacToeScores');
    };

    // Clear data when the component mounts
    clearAllGameData();

    // Add event listener for page reloads
    window.addEventListener('beforeunload', clearAllGameData);

    return () => {
      window.removeEventListener('beforeunload', clearAllGameData);
    };
  }, []);

  // Initialize state without localStorage
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
  const [marks, setMarks] = useState<Mark[]>([]);
  const [nextRemovalPosition, setNextRemovalPosition] = useState<number | null>(null);

  const currentPlayerMarks = marks.filter(mark => mark.symbol === (isXNext ? 'X' : 'O'));
  const remainingMarks = 3 - currentPlayerMarks.length;
  const [currentWinner, winningLineResult] = calculateWinner(marks);

  const getOldestMarkPosition = (symbol: 'X' | 'O'): number | null => {
    const playerMarks = marks.filter(mark => mark.symbol === symbol);
    if (playerMarks.length === 0) return null;
    
    const oldestMark = playerMarks.reduce((oldest, current) => 
      current.timestamp < oldest.timestamp ? current : oldest
    );
    return oldestMark.position;
  };

  useEffect(() => {
    if (!gameEnded && currentPlayerMarks.length === 3) {
      const oldestPosition = getOldestMarkPosition(isXNext ? 'X' : 'O');
      setNextRemovalPosition(oldestPosition);
    } else {
      setNextRemovalPosition(null);
    }
  }, [isXNext, marks, gameEnded]);

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
        <div className={styles.marksInfo} data-player={symbol}>
          {remainingMarks > 0 
            ? `${remainingMarks} marks remaining`
            : 'Next move will remove oldest mark'}
        </div>
      </div>
    );
  }, [currentWinner, gameState, player1Name, player2Name, isXNext, remainingMarks]);

  const makeMove = useCallback((position: number) => {
    if (gameEnded || (board[position] && !nextRemovalPosition)) {
      SoundManager.getInstance().playSound('invalid');
      return;
    }

    const currentSymbol = isXNext ? 'X' : 'O';
    const currentPlayerMarks = marks.filter(mark => mark.symbol === currentSymbol);

    let newMarks = [...marks];
    if (currentPlayerMarks.length >= 3) {
      // Remove the oldest mark for the current player
      const oldestMark = currentPlayerMarks.reduce((oldest, current) => 
        current.timestamp < oldest.timestamp ? current : oldest
      );
      newMarks = marks.filter(mark => mark !== oldestMark);
      SoundManager.getInstance().playSound('place');
    }

    // Add the new mark
    newMarks.push({
      position,
      symbol: currentSymbol,
      timestamp: Date.now()
    });

    setMarks(newMarks);
    
    // Update the visual board state
    const newBoard = Array(9).fill(null);
    newMarks.forEach(mark => {
      newBoard[mark.position] = mark.symbol;
    });
    setBoard(newBoard);

    const [winner, line] = calculateWinner(newMarks);
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
    } else {
      SoundManager.getInstance().playSound('place');
      setIsXNext(!isXNext);
    }
  }, [board, gameEnded, isXNext, marks, onGameEnd, player1Name, player2Name, nextRemovalPosition]);

  const startNewGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setSelectedSquare(-1);
    setWinningLine(null);
    setScoreUpdated(null);
    setGameState('playing');
    setGameEnded(false);
    setMarks([]);
    setNextRemovalPosition(null);
    
    // Don't clear scores as they should persist
    if (typeof window !== 'undefined') {
      localStorage.removeItem('advancedBoard');
      localStorage.removeItem('advancedIsXNext');
      localStorage.removeItem('advancedMarks');
      localStorage.removeItem('advancedGameState');
      localStorage.removeItem('advancedGameEnded');
    }
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
          <div className={`${styles.playerScore} ${isXNext && !gameEnded ? styles.activePlayer : ''}`}>
            <span className={styles.playerName}>{player1Name}</span>
            <span className={`${styles.score} ${scoreUpdated === player1Name ? styles.updated : ''}`}>
              {scores[player1Name]}
            </span>
            <span className={styles.marksCount}>
              {marks.filter(m => m.symbol === 'X').length}/3
            </span>
          </div>
          <div className={`${styles.playerScore} ${!isXNext && !gameEnded ? styles.activePlayer : ''}`}>
            <span className={styles.playerName}>{player2Name}</span>
            <span className={`${styles.score} ${scoreUpdated === player2Name ? styles.updated : ''}`}>
              {scores[player2Name]}
            </span>
            <span className={styles.marksCount}>
              {marks.filter(m => m.symbol === 'O').length}/3
            </span>
          </div>
        </div>
        <MuteButton />
      </div>

      {!currentWinner && !gameEnded && (
        <div className={styles.status}>
          {getStatusMessage()}
        </div>
      )}

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
          {board.map((square, i) => (
            <button
              key={i}
              className={`${styles.square} ${
                winningLine?.includes(i) ? styles.winning : ''
              } ${nextRemovalPosition === i ? styles.nextRemoval : ''}`}
              onClick={() => makeMove(i)}
              disabled={gameEnded}
            >
              {square && (
                <div
                  className={`${styles.mark} ${
                    winningLine?.includes(i) ? styles.winningMark : ''
                  } ${
                    getOldestMarkPosition(square as 'X' | 'O') === i ? styles.oldestMark : ''
                  }`}
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

      {gameEnded && (
        <div className={styles.status}>
          {getStatusMessage()}
        </div>
      )}

      {gameEnded && (
        <button className={styles.newGameButton} onClick={startNewGame}>
          New Game
        </button>
      )}
    </div>
  );
};

export default AdvancedGameBoard; 