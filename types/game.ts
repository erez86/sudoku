export interface Cell {
  value: number;
  isGiven: boolean;
  notes: number[];
  hasConflict: boolean;
}

export interface GameState {
  board: Cell[][];
  selectedCell: { row: number; col: number } | null;
  isNotesMode: boolean;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  elapsedTime: number;
  hintsUsed: number;
  mistakes: number;
  isComplete: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  stats: {
    totalGamesPlayed: number;
    totalTimePlayed: number;
    totalHintsUsed: number;
    totalMistakes: number;
    gamesByDifficulty: {
      [key: string]: {
        gamesPlayed: number;
        totalTime: number;
        bestTime: number;
        averageTime: number;
      };
    };
  };
}

export interface GameSettings {
  showTimer: boolean;
  showHints: boolean;
  highlightConflicts: boolean;
  autoSave: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
