import { Difficulty } from '../components/DifficultySelector';

type Board = Array<'X' | 'O' | null>;
type StateKey = string;
type Action = number;
type Pattern = Array<number>;

interface QTable {
  [state: StateKey]: {
    [action: number]: number;
  };
}

interface MinimaxResult {
  score: number;
  move: number | null;
}

export class QLearning {
  private qTable: QTable = {};
  private learningRate: number;
  private discountFactor: number;
  private explorationRate: number;
  private readonly minExplorationRate: number;
  private readonly explorationDecay: number;
  private readonly difficulty: Difficulty;
  private readonly winPatterns: Pattern[] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];
  private readonly cornerPositions: number[] = [0, 2, 6, 8];
  private readonly edgePositions: number[] = [1, 3, 5, 7];
  private readonly oppositeCorners: { [key: number]: number } = {
    0: 8, 2: 6, 6: 2, 8: 0
  };

  constructor(difficulty: Difficulty) {
    this.difficulty = difficulty;
    
    // Configure learning parameters based on difficulty
    switch (difficulty) {
      case 'easy':
        this.learningRate = 0.15;
        this.discountFactor = 0.6;
        this.explorationRate = 0.35;
        this.minExplorationRate = 0.15;
        this.explorationDecay = 0.002;
        break;
      case 'medium':
        this.learningRate = 0.3;
        this.discountFactor = 0.8;
        this.explorationRate = 0.25;
        this.minExplorationRate = 0.08;
        this.explorationDecay = 0.01;
        break;
      case 'hard':
        this.learningRate = 0.5;
        this.discountFactor = 0.99;
        this.explorationRate = 0.1;
        this.minExplorationRate = 0.01;
        this.explorationDecay = 0.03;
        break;
    }

    // Load Q-table from localStorage if it exists
    if (typeof window !== 'undefined') {
      const savedQTable = localStorage.getItem(`qTable_${difficulty}`);
      if (savedQTable) {
        this.qTable = JSON.parse(savedQTable);
      }
    }
  }

  private getStateKey(board: Board): StateKey {
    return board.map(cell => cell || '-').join('');
  }

  private getSymmetricStates(board: Board): StateKey[] {
    const states: StateKey[] = [];
    const boardMatrix = [
      [board[0], board[1], board[2]],
      [board[3], board[4], board[5]],
      [board[6], board[7], board[8]]
    ];

    // Original
    states.push(this.getStateKey(board));

    // Rotations
    for (let i = 0; i < 3; i++) {
      boardMatrix.reverse();
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < row; col++) {
          [boardMatrix[row][col], boardMatrix[col][row]] = 
          [boardMatrix[col][row], boardMatrix[row][col]];
        }
      }
      states.push(this.getStateKey(boardMatrix.flat() as Board));
    }

    // Reflections
    const reflectHorizontal = [board[6], board[7], board[8], board[3], board[4], board[5], board[0], board[1], board[2]];
    const reflectVertical = [board[2], board[1], board[0], board[5], board[4], board[3], board[8], board[7], board[6]];
    states.push(this.getStateKey(reflectHorizontal as Board));
    states.push(this.getStateKey(reflectVertical as Board));

    return [...new Set(states)];
  }

  private getAvailableActions(board: Board): Action[] {
    return board
      .map((cell, index) => cell === null ? index : null)
      .filter((index): index is number => index !== null);
  }

  private findForkOpportunities(board: Board, player: 'X' | 'O'): number[] {
    const availableActions = this.getAvailableActions(board);
    return availableActions.filter(action => {
      const testBoard = [...board];
      testBoard[action] = player;
      return this.canCreateFork(testBoard, player);
    });
  }

  private findBlockingMoves(board: Board, player: 'X' | 'O'): number[] {
    const opponent = player === 'X' ? 'O' : 'X';
    const availableActions = this.getAvailableActions(board);
    const blockingMoves: number[] = [];

    for (const action of availableActions) {
      const testBoard = [...board];
      testBoard[action] = player;
      
      // Check if this move blocks opponent's fork
      const opponentForks = this.findForkOpportunities(testBoard, opponent);
      if (opponentForks.length === 0) {
        blockingMoves.push(action);
      }
    }

    return blockingMoves;
  }

  private evaluateState(board: Board, action: number): number {
    let score = 0;
    const newBoard = [...board];
    newBoard[action] = 'O';
    const moveCount = board.filter(cell => cell !== null).length;

    // Immediate win/block checks with highest priority
    if (this.checkWin(newBoard, 'O')) {
      return 10000; // Immediate win
    }

    const opponentBoard = [...board];
    opponentBoard[action] = 'X';
    if (this.checkWin(opponentBoard, 'X')) {
      return 5000; // Block opponent's win
    }

    // Fork opportunities and prevention
    const forkMoves = this.findForkOpportunities(newBoard, 'O');
    if (forkMoves.length > 0) {
      score += 2000;
    }

    const opponentForkMoves = this.findForkOpportunities(opponentBoard, 'X');
    if (opponentForkMoves.length > 0) {
      score += 1500; // Block opponent's fork
    }

    // Strategic position scoring based on game phase and difficulty
    if (this.difficulty === 'hard') {
      // Perfect play strategy
      if (moveCount === 0) {
        // First move: take center
        return action === 4 ? 1000 : 100;
      } else if (moveCount === 1) {
        // Second move: if center taken, take corner; if corner taken, take center
        if (board[4] === 'X') {
          return this.cornerPositions.includes(action) ? 1000 : 100;
        } else if (this.cornerPositions.some(pos => board[pos] === 'X')) {
          return action === 4 ? 1000 : 100;
        }
      } else if (moveCount === 2 && board[4] === 'O') {
        // Third move with center: take opposite corner of opponent's move
        const opponentCorner = this.cornerPositions.find(pos => board[pos] === 'X');
        if (opponentCorner !== undefined && action === this.oppositeCorners[opponentCorner]) {
          return 1000;
        }
      }

      // Advanced positional strategy
      score += this.evaluateAdvancedPosition(board, action, moveCount);
    } else {
      // Simplified scoring for easy/medium
      score += this.evaluateBasicPosition(board, action);
    }

    // Pattern-based evaluation
    score += this.evaluatePatterns(newBoard, 'O') * (this.difficulty === 'hard' ? 2 : 1);
    
    // Defensive evaluation
    if (this.difficulty !== 'easy') {
      score += this.evaluatePatterns(opponentBoard, 'X') * (this.difficulty === 'hard' ? 1.5 : 0.8);
    }

    return score;
  }

  private evaluateAdvancedPosition(board: Board, action: number, moveCount: number): number {
    let score = 0;

    // Early game strategy
    if (moveCount <= 3) {
      if (action === 4) {
        score += 100; // Center control
      } else if (this.cornerPositions.includes(action)) {
        const oppositeCorner = this.oppositeCorners[action];
        if (board[oppositeCorner] === 'X') {
          score += 90; // Counter opposite corner strategy
        } else {
          score += 80; // General corner control
        }
      }
    }
    // Mid game strategy
    else if (moveCount <= 6) {
      if (this.canCreateFork(board, 'O')) {
        score += 150; // Fork creation
      }
      const blockingMoves = this.findBlockingMoves(board, 'O');
      if (blockingMoves.includes(action)) {
        score += 130; // Fork prevention
      }
    }
    // End game strategy
    else {
      score += this.evaluateEndgamePosition(board, action);
    }

    return score;
  }

  private evaluateEndgamePosition(board: Board, action: number): number {
    let score = 0;
    const newBoard = [...board];
    newBoard[action] = 'O';

    // Check for winning patterns
    for (const pattern of this.winPatterns) {
      const cells = pattern.map(i => newBoard[i]);
      const aiCount = cells.filter(cell => cell === 'O').length;
      const emptyCount = cells.filter(cell => cell === null).length;

      if (aiCount === 2 && emptyCount === 1) {
        score += 200; // Near win
      }
    }

    return score;
  }

  private evaluateBasicPosition(board: Board, action: number): number {
    let score = 0;

    if (action === 4) {
      score += 40; // Center
    } else if (this.cornerPositions.includes(action)) {
      score += 30; // Corners
    } else if (this.edgePositions.includes(action)) {
      score += 20; // Edges
    }

    return score;
  }

  private canCreateFork(board: Board, player: 'X' | 'O'): boolean {
    let potentialWins = 0;
    for (const pattern of this.winPatterns) {
      const cells = pattern.map(i => board[i]);
      const playerCount = cells.filter(cell => cell === player).length;
      const emptyCount = cells.filter(cell => cell === null).length;
      if (playerCount === 2 && emptyCount === 1) {
        potentialWins++;
      }
    }
    return potentialWins >= 2;
  }

  private evaluatePatterns(board: Board, player: 'X' | 'O'): number {
    let score = 0;
    const isHardMode = this.difficulty === 'hard';

    for (const pattern of this.winPatterns) {
      const cells = pattern.map(i => board[i]);
      const playerCount = cells.filter(cell => cell === player).length;
      const emptyCount = cells.filter(cell => cell === null).length;
      const opponentCount = cells.filter(cell => cell !== player && cell !== null).length;

      // Winning patterns
      if (playerCount === 2 && emptyCount === 1) {
        score += isHardMode ? 300 : 50;
      }
      // Developing patterns
      else if (playerCount === 1 && emptyCount === 2) {
        score += isHardMode ? 50 : 15;
      }
      // Blocking patterns
      else if (opponentCount === 2 && playerCount === 1) {
        score += isHardMode ? 200 : 25;
      }
      // Empty patterns
      else if (emptyCount === 3) {
        score += isHardMode ? 10 : 5;
      }
    }

    return score;
  }

  private checkWin(board: Board, player: 'X' | 'O'): boolean {
    return this.winPatterns.some(pattern =>
      pattern.every(pos => board[pos] === player)
    );
  }

  private minimax(board: Board, depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): MinimaxResult {
    const availableActions = this.getAvailableActions(board);

    // Terminal states
    if (this.checkWin(board, 'O')) return { score: 10 - depth, move: null };
    if (this.checkWin(board, 'X')) return { score: depth - 10, move: null };
    if (availableActions.length === 0) return { score: 0, move: null };
    if (depth >= (this.difficulty === 'hard' ? 9 : 6)) return { score: this.evaluateState(board, -1), move: null };

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = availableActions[0];

      for (const action of availableActions) {
        const newBoard = [...board];
        newBoard[action] = 'O';
        const score = this.minimax(newBoard, depth + 1, false, alpha, beta).score;
        if (score > bestScore) {
          bestScore = score;
          bestMove = action;
        }
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break;
      }

      return { score: bestScore, move: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = availableActions[0];

      for (const action of availableActions) {
        const newBoard = [...board];
        newBoard[action] = 'X';
        const score = this.minimax(newBoard, depth + 1, true, alpha, beta).score;
        if (score < bestScore) {
          bestScore = score;
          bestMove = action;
        }
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break;
      }

      return { score: bestScore, move: bestMove };
    }
  }

  chooseAction(board: Board): Action {
    const stateKey = this.getStateKey(board);
    const availableActions = this.getAvailableActions(board);
    const moveCount = board.filter(cell => cell !== null).length;
    
    // Hard mode: Use perfect play strategy
    if (this.difficulty === 'hard') {
      // Always use minimax for first few moves
      if (moveCount <= 2) {
        const minimaxResult = this.minimax(board, 0, true);
        return minimaxResult.move!;
      }
      
      // Check for immediate win or block
      for (const action of availableActions) {
        const testBoard = [...board];
        testBoard[action] = 'O';
        if (this.checkWin(testBoard, 'O')) {
          return action; // Take winning move
        }
        
        testBoard[action] = 'X';
        if (this.checkWin(testBoard, 'X')) {
          return action; // Block opponent's win
        }
      }
    }

    // Initialize Q-values for new state
    if (!this.qTable[stateKey]) {
      this.qTable[stateKey] = {};
      availableActions.forEach(action => {
        this.qTable[stateKey][action] = this.evaluateState(board, action) / 100;
      });
    }

    // Check symmetric states
    const symmetricStates = this.getSymmetricStates(board);
    const knownSymmetricState = symmetricStates.find(state => this.qTable[state]);

    // Exploration vs exploitation
    if (Math.random() < this.explorationRate) {
      if (this.difficulty === 'hard' || Math.random() < (this.difficulty === 'medium' ? 0.7 : 0.3)) {
        const minimaxResult = this.minimax(board, 0, true);
        return minimaxResult.move!;
      } else {
        // Smart random choice
        const scores = availableActions.map(action => this.evaluateState(board, action));
        const maxScore = Math.max(...scores);
        const bestActions = availableActions.filter((_, i) => scores[i] === maxScore);
        return bestActions[Math.floor(Math.random() * bestActions.length)];
      }
    }

    // Exploit: choose best action considering symmetry and enhanced evaluation
    let bestAction = availableActions[0];
    let maxQValue = -Infinity;

    availableActions.forEach(action => {
      const qValue = knownSymmetricState ?
        this.qTable[knownSymmetricState][action] || 0 :
        this.qTable[stateKey][action] || 0;
      
      const stateEvaluation = this.evaluateState(board, action);
      const evaluationWeight = this.difficulty === 'hard' ? 0.5 : 
                             this.difficulty === 'medium' ? 0.3 : 0.1;
      const combinedValue = qValue + (stateEvaluation * evaluationWeight);

      if (combinedValue > maxQValue) {
        maxQValue = combinedValue;
        bestAction = action;
      }
    });

    return bestAction;
  }

  update(oldState: Board, action: Action, newState: Board, reward: number): void {
    const oldStateKey = this.getStateKey(oldState);
    const newStateKey = this.getStateKey(newState);
    const availableActions = this.getAvailableActions(newState);

    // Initialize Q-values if they don't exist
    if (!this.qTable[oldStateKey]) {
      this.qTable[oldStateKey] = {};
    }
    if (!this.qTable[oldStateKey][action]) {
      this.qTable[oldStateKey][action] = 0;
    }

    // Q-learning update rule
    const maxQValue = this.getMaxQValue(newStateKey, availableActions);
    const oldQValue = this.qTable[oldStateKey][action];
    const newQValue = oldQValue + this.learningRate * (reward + this.discountFactor * maxQValue - oldQValue);
    this.qTable[oldStateKey][action] = newQValue;

    // Decay exploration rate
    this.explorationRate = Math.max(
      this.minExplorationRate,
      this.explorationRate * (1 - this.explorationDecay)
    );

    // Save Q-table to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`qTable_${this.difficulty}`, JSON.stringify(this.qTable));
      } catch (error) {
        console.warn('Failed to save Q-table to localStorage:', error);
      }
    }
  }

  private getMaxQValue(state: StateKey, availableActions: Action[]): number {
    if (!this.qTable[state]) return 0;
    return Math.max(...availableActions.map(action => this.qTable[state][action] || 0));
  }

  getPerformanceStats(): {
    explorationRate: number;
    statesLearned: number;
    totalQValues: number;
  } {
    const statesLearned = Object.keys(this.qTable).length;
    const totalQValues = Object.values(this.qTable)
      .reduce((sum, actions) => sum + Object.keys(actions).length, 0);

    return {
      explorationRate: this.explorationRate,
      statesLearned,
      totalQValues
    };
  }

  reset(): void {
    this.qTable = {};
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`qTable_${this.difficulty}`);
      } catch (error) {
        console.warn('Failed to remove Q-table from localStorage:', error);
      }
    }
  }
} 