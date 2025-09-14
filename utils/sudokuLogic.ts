import { Cell } from '../types/game';

// Difficulty levels configuration
export const DIFFICULTY_LEVELS = {
  EASY: {
    name: 'Easy',
    description: '40 empty cells',
    color: '#4CAF50',
  },
  MEDIUM: {
    name: 'Medium',
    description: '50 empty cells',
    color: '#FF9800',
  },
  HARD: {
    name: 'Hard',
    description: '60 empty cells',
    color: '#F44336',
  },
};

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Generate a random Sudoku puzzle
export const generateSudoku = (difficulty: 'EASY' | 'MEDIUM' | 'HARD'): Cell[][] => {
  const board: Cell[][] = Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => ({
      value: 0,
      isGiven: false,
      notes: [],
      hasConflict: false
    }))
  );

  // Fill the board with a valid Sudoku solution
  fillBoard(board);
  
  // Remove numbers based on difficulty
  const cellsToRemove = difficulty === 'EASY' ? 40 : difficulty === 'MEDIUM' ? 50 : 60;
  removeNumbers(board, cellsToRemove);
  
  return board;
};

// Fill the board with a valid Sudoku solution
const fillBoard = (board: Cell[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === 0) {
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (const num of numbers) {
          if (isValidMove(board, row, col, num)) {
            board[row][col].value = num;
            
            if (fillBoard(board)) {
              return true;
            }
            
            board[row][col].value = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Remove numbers from the board
const removeNumbers = (board: Cell[][], count: number): void => {
  let removed = 0;
  const positions = shuffleArray(Array.from({ length: 81 }, (_, i) => i));
  
  for (const pos of positions) {
    if (removed >= count) break;
    
    const row = Math.floor(pos / 9);
    const col = pos % 9;
    
    if (board[row][col].value !== 0) {
      board[row][col].value = 0;
      board[row][col].isGiven = false;
      removed++;
    }
  }
};

// Check if a move is valid
export const isValidMove = (board: Cell[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x].value === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col].value === num) return false;
  }
  
  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j].value === num) return false;
    }
  }
  
  return true;
};

// Check for conflicts in the board
export const checkConflicts = (board: Cell[][]): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell, hasConflict: false })));
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = newBoard[row][col];
      if (cell.value !== 0) {
        // Check row conflicts
        for (let x = 0; x < 9; x++) {
          if (x !== col && newBoard[row][x].value === cell.value) {
            newBoard[row][col].hasConflict = true;
            newBoard[row][x].hasConflict = true;
          }
        }
        
        // Check column conflicts
        for (let x = 0; x < 9; x++) {
          if (x !== row && newBoard[x][col].value === cell.value) {
            newBoard[row][col].hasConflict = true;
            newBoard[x][col].hasConflict = true;
          }
        }
        
        // Check 3x3 box conflicts
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const checkRow = startRow + i;
            const checkCol = startCol + j;
            
            if ((checkRow !== row || checkCol !== col) && 
                newBoard[checkRow][checkCol].value === cell.value) {
              newBoard[row][col].hasConflict = true;
              newBoard[checkRow][checkCol].hasConflict = true;
            }
          }
        }
      }
    }
  }
  
  return newBoard;
};

// Check if the board is complete and valid
export const isBoardComplete = (board: Cell[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === 0) return false;
    }
  }
  
  // Check if there are any conflicts
  const boardWithConflicts = checkConflicts(board);
  return !boardWithConflicts.some(row => row.some(cell => cell.hasConflict));
};

// Shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get hint for a cell
export const getHint = (board: Cell[][], row: number, col: number): number | null => {
  if (board[row][col].value !== 0) return null;
  
  const possibleNumbers = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(board, row, col, num)) {
      possibleNumbers.push(num);
    }
  }
  
  return possibleNumbers.length === 1 ? possibleNumbers[0] : null;
};

// Auto-fill obvious cells
export const autoFill = (board: Cell[][]): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  let changed = true;
  
  while (changed) {
    changed = false;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newBoard[row][col].value === 0) {
          const hint = getHint(newBoard, row, col);
          if (hint) {
            newBoard[row][col].value = hint;
            changed = true;
          }
        }
      }
    }
  }
  
  return newBoard;
};
