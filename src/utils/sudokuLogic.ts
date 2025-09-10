import { DifficultyLevel, Cell, PuzzleData } from '../types/game';

export const DIFFICULTY_LEVELS: Record<string, DifficultyLevel> = {
  EASY: { name: 'Easy', cellsToRemove: 40 },
  MEDIUM: { name: 'Medium', cellsToRemove: 50 },
  HARD: { name: 'Hard', cellsToRemove: 60 }
};

// Generate a complete solved Sudoku board
export function generateSolvedBoard(): number[][] {
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first (they are independent)
  for (let i = 0; i < 9; i += 3) {
    fillBox(board, i, i);
  }
  
  // Fill remaining cells
  solveSudoku(board);
  
  return board;
}

// Fill a 3x3 box with random numbers 1-9
function fillBox(board: number[][], row: number, col: number): void {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(numbers);
  
  let index = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[row + i][col + j] = numbers[index++];
    }
  }
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Solve Sudoku using backtracking
function solveSudoku(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Check if a move is valid
export function isValidMove(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  
  return true;
}

// Generate a puzzle by removing cells from solved board
export function generatePuzzle(difficulty: DifficultyLevel = DIFFICULTY_LEVELS.MEDIUM): PuzzleData {
  const solvedBoard = generateSolvedBoard();
  const puzzle = solvedBoard.map(row => [...row]);
  
  // Remove cells based on difficulty
  const cellsToRemove = difficulty.cellsToRemove;
  const positions: [number, number][] = [];
  
  // Generate all possible positions
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }
  
  // Shuffle positions
  shuffleArray(positions);
  
  // Remove cells
  for (let i = 0; i < cellsToRemove; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = 0;
  }
  
  return {
    puzzle,
    solution: solvedBoard,
    difficulty: difficulty.name
  };
}

// Create initial cell state
export function createInitialCell(value: number): Cell {
  return {
    value,
    isGiven: value !== 0,
    notes: [],
    isSelected: false,
    isHighlighted: false,
    hasConflict: false
  };
}

// Create board from puzzle data
export function createBoardFromPuzzle(puzzle: number[][]): Cell[][] {
  return puzzle.map(row => 
    row.map(cell => createInitialCell(cell))
  );
}

// Check if the current board is solved
export function isBoardSolved(board: Cell[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === 0) return false;
      if (!isValidMove(board.map(r => r.map(c => c.value)), row, col, board[row][col].value)) return false;
    }
  }
  return true;
}

// Get all possible numbers for a cell
export function getPossibleNumbers(board: Cell[][], row: number, col: number): number[] {
  const possible: number[] = [];
  const valueBoard = board.map(r => r.map(c => c.value));
  
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(valueBoard, row, col, num)) {
      possible.push(num);
    }
  }
  return possible;
}

// Check if the current board state is valid (no conflicts)
export function isBoardValid(board: Cell[][]): boolean {
  const valueBoard = board.map(r => r.map(c => c.value));
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (valueBoard[row][col] !== 0) {
        const num = valueBoard[row][col];
        valueBoard[row][col] = 0; // Temporarily remove to check validity
        const valid = isValidMove(valueBoard, row, col, num);
        valueBoard[row][col] = num; // Restore
        if (!valid) return false;
      }
    }
  }
  return true;
}

// Format time in MM:SS format
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Check for conflicts in a specific cell
export function checkCellConflicts(board: Cell[][], row: number, col: number): boolean {
  const value = board[row][col].value;
  if (value === 0) return false;
  
  const valueBoard = board.map(r => r.map(c => c.value));
  valueBoard[row][col] = 0; // Temporarily remove to check validity
  return !isValidMove(valueBoard, row, col, value);
}
