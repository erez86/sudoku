import { useEffect, useState } from 'react';
import { GameSettings, GameState, User } from '../types/game';
import { generateSudoku } from '../utils/sudokuLogic';

const initialGameState: GameState = {
  board: Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => ({
      value: 0,
      isGiven: false,
      notes: [],
      hasConflict: false
    }))
  ),
  selectedCell: null,
  isNotesMode: false,
  difficulty: 'EASY',
  elapsedTime: 0,
  hintsUsed: 0,
  mistakes: 0,
  isComplete: false,
};

const initialSettings: GameSettings = {
  showTimer: true,
  showHints: true,
  highlightConflicts: true,
  autoSave: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

const mockUser: User = {
  id: 'player-1',
  name: 'Player',
  avatar: 'person',
  createdAt: new Date().toISOString(),
  stats: {
    totalGamesPlayed: 0,
    totalTimePlayed: 0,
    totalHintsUsed: 0,
    totalMistakes: 0,
    gamesByDifficulty: {
      Easy: {
        gamesPlayed: 0,
        totalTime: 0,
        bestTime: Infinity,
        averageTime: 0,
      },
      Medium: {
        gamesPlayed: 0,
        totalTime: 0,
        bestTime: Infinity,
        averageTime: 0,
      },
      Hard: {
        gamesPlayed: 0,
        totalTime: 0,
        bestTime: Infinity,
        averageTime: 0,
      },
      Expert: {
        gamesPlayed: 0,
        totalTime: 0,
        bestTime: Infinity,
        averageTime: 0,
      },
    },
  },
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [settings, setSettings] = useState<GameSettings>(initialSettings);
  const [currentUser, setCurrentUser] = useState<{ user: User } | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [gameHistory, setGameHistory] = useState<GameState[]>([]);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setCurrentUser({ user: mockUser });
      setUserLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!gameState.isComplete && settings.showTimer) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.isComplete, settings.showTimer]);

  const startNewGame = (difficulty: 'EASY' | 'MEDIUM' | 'HARD') => {
    const newBoard = generateSudoku(difficulty);
    // Mark given cells
    const boardWithGiven = newBoard.map(row => 
      row.map(cell => ({
        ...cell,
        isGiven: cell.value !== 0
      }))
    );

    const newGameState = {
      ...initialGameState,
      board: boardWithGiven,
      difficulty,
    };

    setGameState(newGameState);
    setGameHistory([newGameState]);
  };

  const setCellValue = (row: number, col: number, value: number) => {
    if (gameState.board[row][col].isGiven) return;

    setGameState(prev => {
      const newBoard = prev.board.map((boardRow, r) =>
        boardRow.map((cell, c) => {
          if (r === row && c === col) {
            if (prev.isNotesMode) {
              const newNotes = cell.notes.includes(value)
                ? cell.notes.filter(note => note !== value)
                : [...cell.notes, value];
              return { ...cell, notes: newNotes };
            } else {
              return { ...cell, value, notes: [] };
            }
          }
          return cell;
        })
      );

      // Check for conflicts
      const boardWithConflicts = checkConflicts(newBoard, row, col);

      // Check if game is complete
      const isComplete = checkGameComplete(boardWithConflicts);

      return {
        ...prev,
        board: boardWithConflicts,
        isComplete,
      };
    });
  };

  const clearCell = (row: number, col: number) => {
    if (gameState.board[row][col].isGiven) return;

    setGameState(prev => {
      const newBoard = prev.board.map((boardRow, r) =>
        boardRow.map((cell, c) => {
          if (r === row && c === col) {
            return { ...cell, value: 0, notes: [], hasConflict: false };
          }
          return cell;
        })
      );

      return {
        ...prev,
        board: newBoard,
      };
    });
  };

  const toggleNotesMode = () => {
    setGameState(prev => ({
      ...prev,
      isNotesMode: !prev.isNotesMode
    }));
  };

  const setSelectedCell = (row: number, col: number) => {
    setGameState(prev => ({
      ...prev,
      selectedCell: { row, col }
    }));
  };

  const getHint = () => {
    // Simple hint implementation - find first empty cell and fill with correct value
    const solution = generateSudoku(gameState.difficulty);
    let hintGiven = false;

    setGameState(prev => {
      const newBoard = prev.board.map((row, r) =>
        row.map((cell, c) => {
          if (!hintGiven && cell.value === 0 && solution[r][c].value !== 0) {
            hintGiven = true;
            return { ...cell, value: solution[r][c].value };
          }
          return cell;
        })
      );

      return {
        ...prev,
        board: newBoard,
        hintsUsed: prev.hintsUsed + 1,
      };
    });
  };

  const undo = () => {
    if (gameHistory.length > 1) {
      const previousState = gameHistory[gameHistory.length - 2];
      setGameState(previousState);
      setGameHistory(prev => prev.slice(0, -1));
    }
  };

  const autoFill = () => {
    const solution = generateSudoku(gameState.difficulty);
    setGameState(prev => ({
      ...prev,
      board: prev.board.map((row, r) =>
        row.map((cell, c) => ({
          ...cell,
          value: solution[r][c].value,
          notes: [],
          hasConflict: false
        }))
      ),
      isComplete: true,
    }));
  };

  const clearGame = () => {
    setGameState(initialGameState);
    setGameHistory([]);
  };

  const checkConflicts = (board: GameState['board'], row: number, col: number) => {
    const value = board[row][col].value;
    if (value === 0) return board;

    return board.map((boardRow, r) =>
      boardRow.map((cell, c) => {
        if (r === row && c === col) return cell;

        let hasConflict = false;

        // Check row
        if (r === row && cell.value === value) hasConflict = true;

        // Check column
        if (c === col && cell.value === value) hasConflict = true;

        // Check 3x3 box
        const boxRow = Math.floor(r / 3) * 3;
        const boxCol = Math.floor(c / 3) * 3;
        const cellBoxRow = Math.floor(row / 3) * 3;
        const cellBoxCol = Math.floor(col / 3) * 3;

        if (boxRow === cellBoxRow && boxCol === cellBoxCol && cell.value === value) {
          hasConflict = true;
        }

        return { ...cell, hasConflict };
      })
    );
  };

  const checkGameComplete = (board: GameState['board']) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === 0 || board[row][col].hasConflict) {
          return false;
        }
      }
    }
    return true;
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      setGameHistory(prevHistory => [...prevHistory, newState]);
      return newState;
    });
  };

  const resetGame = () => {
    setGameState(initialGameState);
    setGameHistory([]);
  };

  const saveSettings = async (newSettings: GameSettings) => {
    setSettings(newSettings);
    // In a real app, you would save to AsyncStorage or a backend here
  };

  return {
    gameState,
    settings,
    currentUser,
    userLoading,
    startNewGame,
    updateGameState,
    resetGame,
    setCellValue,
    clearCell,
    toggleNotesMode,
    setSelectedCell,
    getHint,
    undo,
    autoFill,
    clearGame,
    saveSettings,
  };
};
