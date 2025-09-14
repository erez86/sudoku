import { useEffect, useState } from 'react';
import { User } from '../types/game';

interface UserWithStats {
  user: User;
  stats: User['stats'];
}

const initialUser: UserWithStats = {
  user: {
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
  },
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

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserWithStats[]>([initialUser]);
  const [currentUser, setCurrentUser] = useState<UserWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setCurrentUser(initialUser);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addUser = async (name: string, avatar: string): Promise<void> => {
    const newUser: User = {
      id: `player-${Date.now()}`,
      name,
      avatar,
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

    const newUserWithStats: UserWithStats = {
      user: newUser,
      stats: newUser.stats,
    };

    setUsers(prev => [...prev, newUserWithStats]);
    setCurrentUser(newUserWithStats);
  };

  const switchUser = async (userId: string): Promise<void> => {
    const user = users.find(u => u.user.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    if (users.length <= 1) {
      throw new Error('Cannot delete the last user');
    }

    const updatedUsers = users.filter(u => u.user.id !== userId);
    setUsers(updatedUsers);

    // If we deleted the current user, switch to the first remaining user
    if (currentUser?.user.id === userId) {
      setCurrentUser(updatedUsers[0]);
    }
  };

  const updateUserStats = (userId: string, gameStats: {
    difficulty: string;
    timePlayed: number;
    hintsUsed: number;
    mistakes: number;
  }) => {
    setUsers(prev => prev.map(userWithStats => {
      if (userWithStats.user.id !== userId) return userWithStats;

      const updatedStats = { ...userWithStats.stats };
      updatedStats.totalGamesPlayed += 1;
      updatedStats.totalTimePlayed += gameStats.timePlayed;
      updatedStats.totalHintsUsed += gameStats.hintsUsed;
      updatedStats.totalMistakes += gameStats.mistakes;

      const difficulty = gameStats.difficulty;
      if (updatedStats.gamesByDifficulty[difficulty]) {
        const diffStats = updatedStats.gamesByDifficulty[difficulty];
        diffStats.gamesPlayed += 1;
        diffStats.totalTime += gameStats.timePlayed;
        diffStats.bestTime = Math.min(diffStats.bestTime, gameStats.timePlayed);
        diffStats.averageTime = diffStats.totalTime / diffStats.gamesPlayed;
      }

      return {
        ...userWithStats,
        stats: updatedStats,
      };
    }));

    // Update current user if it's the same user
    if (currentUser?.user.id === userId) {
      setCurrentUser(prev => {
        if (!prev) return prev;
        
        const updatedStats = { ...prev.stats };
        updatedStats.totalGamesPlayed += 1;
        updatedStats.totalTimePlayed += gameStats.timePlayed;
        updatedStats.totalHintsUsed += gameStats.hintsUsed;
        updatedStats.totalMistakes += gameStats.mistakes;

        const difficulty = gameStats.difficulty;
        if (updatedStats.gamesByDifficulty[difficulty]) {
          const diffStats = updatedStats.gamesByDifficulty[difficulty];
          diffStats.gamesPlayed += 1;
          diffStats.totalTime += gameStats.timePlayed;
          diffStats.bestTime = Math.min(diffStats.bestTime, gameStats.timePlayed);
          diffStats.averageTime = diffStats.totalTime / diffStats.gamesPlayed;
        }

        return {
          ...prev,
          stats: updatedStats,
        };
      });
    }
  };

  return {
    users,
    currentUser,
    addUser,
    switchUser,
    deleteUser,
    updateUserStats,
    isLoading,
  };
};
