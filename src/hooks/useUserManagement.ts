import { useState, useEffect, useCallback } from 'react';
import { User, UserData } from '../types/game';
import {
  loadUsers,
  saveUsers,
  loadCurrentUser,
  saveCurrentUser,
  createUser,
  createUserData,
  updateUserStats,
  getDefaultUser,
} from '../utils/userManagement';

export function useUserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load users and current user on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, currentUserId] = await Promise.all([
        loadUsers(),
        loadCurrentUser(),
      ]);

      setUsers(usersData);

      if (usersData.length === 0) {
        // Create default user if no users exist
        const defaultUser = getDefaultUser();
        const newUsers = [defaultUser];
        await saveUsers(newUsers);
        await saveCurrentUser(defaultUser.user.id);
        setUsers(newUsers);
        setCurrentUser(defaultUser);
      } else if (currentUserId) {
        // Find current user
        const user = usersData.find(u => u.user.id === currentUserId);
        if (user) {
          setCurrentUser(user);
        } else {
          // If current user not found, use first user
          setCurrentUser(usersData[0]);
          await saveCurrentUser(usersData[0].user.id);
        }
      } else {
        // No current user set, use first user
        setCurrentUser(usersData[0]);
        await saveCurrentUser(usersData[0].user.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to default user
      const defaultUser = getDefaultUser();
      setUsers([defaultUser]);
      setCurrentUser(defaultUser);
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = useCallback(async (name: string, avatar: string = 'person') => {
    const newUser = createUser(name, avatar);
    const newUserData = createUserData(newUser);
    const updatedUsers = [...users, newUserData];
    
    setUsers(updatedUsers);
    await saveUsers(updatedUsers);
    
    return newUserData;
  }, [users]);

  const switchUser = useCallback(async (userId: string) => {
    const user = users.find(u => u.user.id === userId);
    if (user) {
      setCurrentUser(user);
      await saveCurrentUser(userId);
    }
  }, [users]);

  const updateUser = useCallback(async (updatedUser: UserData) => {
    const updatedUsers = users.map(u => 
      u.user.id === updatedUser.user.id ? updatedUser : u
    );
    
    setUsers(updatedUsers);
    await saveUsers(updatedUsers);
    
    if (currentUser?.user.id === updatedUser.user.id) {
      setCurrentUser(updatedUser);
    }
  }, [users, currentUser]);

  const recordGameCompletion = useCallback(async (
    gameTime: number,
    difficulty: string,
    hintsUsed: number,
    mistakes: number
  ) => {
    if (!currentUser) return;

    const updatedUserData = updateUserStats(
      currentUser,
      gameTime,
      difficulty,
      hintsUsed,
      mistakes
    );

    await updateUser(updatedUserData);
  }, [currentUser, updateUser]);

  const deleteUser = useCallback(async (userId: string) => {
    if (users.length <= 1) {
      throw new Error('Cannot delete the last user');
    }

    const updatedUsers = users.filter(u => u.user.id !== userId);
    setUsers(updatedUsers);
    await saveUsers(updatedUsers);

    // If deleted user was current user, switch to first available user
    if (currentUser?.user.id === userId) {
      const newCurrentUser = updatedUsers[0];
      setCurrentUser(newCurrentUser);
      await saveCurrentUser(newCurrentUser.user.id);
    }
  }, [users, currentUser]);

  return {
    users,
    currentUser,
    isLoading,
    addUser,
    switchUser,
    updateUser,
    recordGameCompletion,
    deleteUser,
  };
}
