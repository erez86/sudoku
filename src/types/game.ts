export interface Cell {
  value: number;
  isGiven: boolean;
  notes: number[];
  isSelected: boolean;
  isHighlighted: boolean;
  hasConflict: boolean;
}

export interface GameState {
  board: Cell[][];
  solution: number[][];
  originalPuzzle: Cell[][];
  difficulty: string;
  isComplete: boolean;
  startTime: number;
  elapsedTime: number;
  selectedCell: { row: number; col: number } | null;
  isNotesMode: boolean;
  hintsUsed: number;
  mistakes: number;
  history: Cell[][][];
}

export interface DifficultyLevel {
  name: string;
  cellsToRemove: number;
}

export interface GameSettings {
  showTimer: boolean;
  showHints: boolean;
  highlightConflicts: boolean;
  autoSave: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface PuzzleData {
  puzzle: number[][];
  solution: number[][];
  difficulty: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  lastPlayed: number;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalTimePlayed: number; // in seconds
  gamesByDifficulty: {
    [difficulty: string]: {
      gamesPlayed: number;
      totalTime: number;
      bestTime: number;
      averageTime: number;
    };
  };
  bestTimes: {
    [difficulty: string]: number;
  };
  totalHintsUsed: number;
  totalMistakes: number;
}

export interface UserData {
  user: User;
  stats: UserStats;
}

export type GameAction = 
  | { type: 'SET_CELL_VALUE'; row: number; col: number; value: number }
  | { type: 'CLEAR_CELL'; row: number; col: number }
  | { type: 'TOGGLE_NOTES_MODE' }
  | { type: 'SET_SELECTED_CELL'; row: number; col: number }
  | { type: 'CLEAR_SELECTED_CELL' }
  | { type: 'GET_HINT' }
  | { type: 'START_NEW_GAME'; difficulty: DifficultyLevel }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_TIMER' }
  | { type: 'GAME_COMPLETE' }
  | { type: 'UNDO' }
  | { type: 'AUTO_FILL' };
