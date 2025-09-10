import { useState, useEffect, useCallback, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generatePuzzle, DIFFICULTY_LEVELS, isBoardSolved, isBoardValid, createBoardFromPuzzle, checkCellConflicts } from '../utils/sudokuLogic';
import { GameState, GameSettings, DifficultyLevel, Cell, GameAction } from '../types/game';
import { useUserManagement } from './useUserManagement';

const GAME_STATE_KEY = 'sudoku_game_state';
const SETTINGS_KEY = 'sudoku_settings';

const initialGameState: GameState = {
  board: Array(9).fill(null).map(() => Array(9).fill(null).map(() => ({
    value: 0,
    isGiven: false,
    notes: [],
    isSelected: false,
    isHighlighted: false,
    hasConflict: false
  }))),
  solution: Array(9).fill(null).map(() => Array(9).fill(0)),
  difficulty: 'Medium',
  isComplete: false,
  startTime: Date.now(),
  elapsedTime: 0,
  selectedCell: null,
  isNotesMode: false,
  hintsUsed: 0,
  mistakes: 0
};

const initialSettings: GameSettings = {
  showTimer: true,
  showHints: true,
  highlightConflicts: true,
  autoSave: true,
  soundEnabled: true,
  vibrationEnabled: true
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CELL_VALUE': {
      if (state.isComplete) return state;
      
      const { row, col, value } = action;
      const newBoard = state.board.map(r => r.map(cell => ({ ...cell })));
      if (state.isNotesMode) {
        // Toggle note
        const cellNotes = [...newBoard[row][col].notes];
        const noteIndex = cellNotes.indexOf(value);
        if (noteIndex > -1) {
          cellNotes.splice(noteIndex, 1);
        } else {
          cellNotes.push(value);
        }
        newBoard[row][col].notes = cellNotes.sort();
      } else {
        // Set cell value
        newBoard[row][col].value = value;
        newBoard[row][col].notes = []; // Clear notes when setting value
      }

      // Check for conflicts
      newBoard[row][col].hasConflict = checkCellConflicts(newBoard, row, col);
      
      const isComplete = isBoardSolved(newBoard);
      
      return {
        ...state,
        board: newBoard,
        isComplete,
        selectedCell: null,
        mistakes: value !== 0 && checkCellConflicts(newBoard, row, col) ? state.mistakes + 1 : state.mistakes
      };
    }
    
    case 'CLEAR_CELL': {
      if (state.isComplete) return state;
      
      const { row, col } = action;
      const newBoard = state.board.map(r => r.map(cell => ({ ...cell })));
      
      newBoard[row][col].value = 0;
      newBoard[row][col].hasConflict = false;
      newBoard[row][col].notes = [];
      
      return {
        ...state,
        board: newBoard,
        selectedCell: null
      };
    }
    
    case 'TOGGLE_NOTES_MODE':
      return {
        ...state,
        isNotesMode: !state.isNotesMode
      };
    
    case 'SET_SELECTED_CELL': {
      const { row, col } = action;
      const isSameCell = state.selectedCell?.row === row && state.selectedCell?.col === col;
      
      return {
        ...state,
        selectedCell: isSameCell ? null : { row, col }
      };
    }
    
    case 'CLEAR_SELECTED_CELL':
      return {
        ...state,
        selectedCell: null
      };
    
    case 'GET_HINT': {
      if (state.isComplete || state.hintsUsed >= 3) return state;
      
      // Find an empty cell and fill it with the solution
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (state.board[row][col].value === 0) {
            const newBoard = state.board.map(r => r.map(cell => ({ ...cell })));
            newBoard[row][col].value = state.solution[row][col];
            newBoard[row][col].hasConflict = false;
            
            return {
              ...state,
              board: newBoard,
              hintsUsed: state.hintsUsed + 1,
              selectedCell: null
            };
          }
        }
      }
      return state;
    }
    
    case 'START_NEW_GAME': {
      const { puzzle, solution } = generatePuzzle(action.difficulty);
      const board = createBoardFromPuzzle(puzzle);
      
      return {
        ...state,
        board,
        solution,
        difficulty: action.difficulty.name,
        isComplete: false,
        startTime: Date.now(),
        elapsedTime: 0,
        selectedCell: null,
        isNotesMode: false,
        hintsUsed: 0,
        mistakes: 0
      };
    }
    
    case 'RESET_GAME':
      return initialGameState;
    
    case 'UPDATE_TIMER':
      return {
        ...state,
        elapsedTime: Math.floor((Date.now() - state.startTime) / 1000)
      };
    
    case 'GAME_COMPLETE':
      return {
        ...state,
        isComplete: true
      };
    
    default:
      return state;
  }
}

export function useGameState() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [settings, setSettings] = useState<GameSettings>(initialSettings);
  const { currentUser, recordGameCompletion, isLoading: userLoading } = useUserManagement();

  // Load game state and settings on mount
  useEffect(() => {
    loadGameState();
    loadSettings();
  }, []);

  // Auto-save game state when it changes
  useEffect(() => {
    if (settings.autoSave && gameState.board.some(row => row.some(cell => cell.value !== 0))) {
      saveGameState();
    }
  }, [gameState, settings.autoSave]);

  // Update timer every second
  useEffect(() => {
    if (!gameState.isComplete && settings.showTimer) {
      const interval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIMER' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.isComplete, settings.showTimer]);

  // Record game completion in user stats
  useEffect(() => {
    if (gameState.isComplete && currentUser) {
      recordGameCompletion(
        gameState.elapsedTime,
        gameState.difficulty,
        gameState.hintsUsed,
        gameState.mistakes
      );
    }
  }, [gameState.isComplete, gameState.elapsedTime, gameState.difficulty, gameState.hintsUsed, gameState.mistakes, currentUser, recordGameCompletion]);

  const loadGameState = async (): Promise<void> => {
    try {
      const savedState = await AsyncStorage.getItem(GAME_STATE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Note: In a real app, you'd want to validate the parsed state
        dispatch({ type: 'START_NEW_GAME', difficulty: DIFFICULTY_LEVELS[parsedState.difficulty] || DIFFICULTY_LEVELS.MEDIUM });
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };

  const saveGameState = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  const loadSettings = async (): Promise<void> => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: GameSettings): Promise<void> => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const startNewGame = useCallback((difficulty: string = 'Medium'): void => {
    const difficultyLevel = Object.values(DIFFICULTY_LEVELS).find(level => level.name === difficulty) || DIFFICULTY_LEVELS.MEDIUM;
    dispatch({ type: 'START_NEW_GAME', difficulty: difficultyLevel });
  }, []);

  const setCellValue = useCallback((row: number, col: number, value: number): void => {
    dispatch({ type: 'SET_CELL_VALUE', row, col, value });
  }, []);

  const clearCell = useCallback((row: number, col: number): void => {
    dispatch({ type: 'CLEAR_CELL', row, col });
  }, []);

  const toggleNotesMode = useCallback((): void => {
    dispatch({ type: 'TOGGLE_NOTES_MODE' });
  }, []);

  const setSelectedCell = useCallback((row: number, col: number): void => {
    dispatch({ type: 'SET_SELECTED_CELL', row, col });
  }, []);

  const getHint = useCallback((): void => {
    dispatch({ type: 'GET_HINT' });
  }, []);

  const clearGame = useCallback((): void => {
    AsyncStorage.removeItem(GAME_STATE_KEY);
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return {
    gameState,
    settings,
    currentUser,
    userLoading,
    startNewGame,
    setCellValue,
    clearCell,
    toggleNotesMode,
    setSelectedCell,
    getHint,
    clearGame,
    saveSettings
  };
}
