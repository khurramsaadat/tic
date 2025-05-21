interface Move {
  score: number;
  position: number;
}

export class TicTacToeAI {
  private static readonly WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  static getBestMove(board: Array<string | null>, aiPlayer: 'X' | 'O'): number {
    // If center is empty, take it (optimal first move)
    if (board[4] === null) return 4;

    const availableMoves = this.getAvailableMoves(board);
    
    // If only one move available, take it
    if (availableMoves.length === 1) return availableMoves[0];

    const moves: Move[] = [];
    const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';

    // Try each available move
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = aiPlayer;
      
      const score = this.minimax(newBoard, 0, false, aiPlayer, humanPlayer);
      moves.push({ position: move, score });
    }

    // Find the move with the highest score
    const bestMove = moves.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    return bestMove.position;
  }

  private static minimax(
    board: Array<string | null>,
    depth: number,
    isMaximizing: boolean,
    aiPlayer: string,
    humanPlayer: string
  ): number {
    const winner = this.checkWinner(board);
    
    // Terminal states
    if (winner === aiPlayer) return 10 - depth;
    if (winner === humanPlayer) return depth - 10;
    if (this.isBoardFull(board)) return 0;

    const availableMoves = this.getAvailableMoves(board);
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = aiPlayer;
        const score = this.minimax(newBoard, depth + 1, false, aiPlayer, humanPlayer);
        bestScore = Math.max(bestScore, score);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = humanPlayer;
        const score = this.minimax(newBoard, depth + 1, true, aiPlayer, humanPlayer);
        bestScore = Math.min(bestScore, score);
      }
      return bestScore;
    }
  }

  private static getAvailableMoves(board: Array<string | null>): number[] {
    return board.reduce<number[]>((moves, cell, index) => {
      if (cell === null) moves.push(index);
      return moves;
    }, []);
  }

  private static isBoardFull(board: Array<string | null>): boolean {
    return !board.includes(null);
  }

  private static checkWinner(board: Array<string | null>): string | null {
    for (const [a, b, c] of this.WINNING_COMBINATIONS) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  // Add randomization for first few moves to make the game more interesting
  static getSmartMove(board: Array<string | null>, aiPlayer: 'X' | 'O'): number {
    const moveCount = board.filter(cell => cell !== null).length;
    const availableMoves = this.getAvailableMoves(board);

    // For the first few moves, occasionally make a random move
    if (moveCount < 2 && Math.random() < 0.3) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    return this.getBestMove(board, aiPlayer);
  }
} 