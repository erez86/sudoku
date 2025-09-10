import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserStats, UserData } from '../types/game';

const USERS_KEY = 'sudoku_users';
const CURRENT_USER_KEY = 'sudoku_current_user';

const defaultStats: UserStats = {
  totalGamesPlayed: 0,
  totalTimePlayed: 0,
  gamesByDifficulty: {},
  bestTimes: {},
  totalHintsUsed: 0,
  totalMistakes: 0,
};

export const createUser = (name: string, avatar: string = 'person'): User => {
  return {
    id: Date.now().toString(),
    name,
    avatar,
    createdAt: Date.now(),
    lastPlayed: Date.now(),
  };
};

export const createUserData = (user: User): UserData => {
  return {
    user,
    stats: { ...defaultStats },
  };
};

export const saveUsers = async (users: UserData[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

export const loadUsers = async (): Promise<UserData[]> => {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    if (usersData) {
      return JSON.parse(usersData);
    }
    return [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

export const saveCurrentUser = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, userId);
  } catch (error) {
    console.error('Error saving current user:', error);
  }
};

export const loadCurrentUser = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error loading current user:', error);
    return null;
  }
};

export const updateUserStats = (
  userData: UserData,
  gameTime: number,
  difficulty: string,
  hintsUsed: number,
  mistakes: number
): UserData => {
  const updatedStats = { ...userData.stats };
  
  // Update total stats
  updatedStats.totalGamesPlayed += 1;
  updatedStats.totalTimePlayed += gameTime;
  updatedStats.totalHintsUsed += hintsUsed;
  updatedStats.totalMistakes += mistakes;
  
  // Update difficulty-specific stats
  if (!updatedStats.gamesByDifficulty[difficulty]) {
    updatedStats.gamesByDifficulty[difficulty] = {
      gamesPlayed: 0,
      totalTime: 0,
      bestTime: Infinity,
      averageTime: 0,
    };
  }
  
  const diffStats = updatedStats.gamesByDifficulty[difficulty];
  diffStats.gamesPlayed += 1;
  diffStats.totalTime += gameTime;
  diffStats.bestTime = Math.min(diffStats.bestTime, gameTime);
  diffStats.averageTime = diffStats.totalTime / diffStats.gamesPlayed;
  
  // Update best times
  if (!updatedStats.bestTimes[difficulty] || gameTime < updatedStats.bestTimes[difficulty]) {
    updatedStats.bestTimes[difficulty] = gameTime;
  }
  
  return {
    ...userData,
    stats: updatedStats,
    user: {
      ...userData.user,
      lastPlayed: Date.now(),
    },
  };
};

export const getDefaultUser = (): UserData => {
  const defaultUser = createUser('Player 1', 'person');
  return createUserData(defaultUser);
};
