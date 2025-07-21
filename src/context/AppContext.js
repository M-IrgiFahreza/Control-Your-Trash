// ===================================================
// UPDATED AppContext.js - Backend Integration
// ===================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbOperations, initializeDB, checkBackendHealth } from '../utils/database';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);
    
    // Check if backend is available
    const backendAvailable = await checkBackendHealth();
    setIsOnline(backendAvailable);
    
    if (backendAvailable) {
      console.log('✅ Backend connected - using API mode');
    } else {
      console.warn('⚠️ Backend unavailable - using localStorage fallback');
    }

    // Initialize database (localStorage or API)
    initializeDB();
    
    // Get current user from localStorage (session management)
    const currentUser = dbOperations.getCurrentUser();
    
    // If user exists and backend is available, refresh user data
    if (currentUser && backendAvailable) {
      try {
        const updatedUser = await dbOperations.getUserInfo(currentUser.id);
        if (updatedUser) {
          setUser(updatedUser);
          dbOperations.setCurrentUser(updatedUser);
        } else {
          setUser(currentUser); // Fallback to localStorage data
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        setUser(currentUser); // Fallback to localStorage data
      }
    } else if (currentUser) {
      setUser(currentUser); // Use localStorage data
    }
    
    setIsLoading(false);
  };

  // Login function - updated untuk backend
  const login = async (email, password) => {
    try {
      if (isOnline) {
        // Use backend API
        const result = await dbOperations.login(email, password);
        if (result.success) {
          setUser(result.user);
        }
        return result;
      } else {
        // Fallback to localStorage (original logic)
        const users = JSON.parse(localStorage.getItem('ecopoints_users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
          setUser(foundUser);
          dbOperations.setCurrentUser(foundUser);
          return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  // Register function - updated untuk backend
  const register = async (userData) => {
    try {
      if (isOnline) {
        // Use backend API
        const result = await dbOperations.register(userData);
        if (result.success) {
          setUser(result.user);
        }
        return result;
      } else {
        // Fallback to localStorage (original logic)
        const users = JSON.parse(localStorage.getItem('ecopoints_users') || '[]');
        if (users.find(u => u.email === userData.email)) {
          return { success: false, message: 'Email already exists' };
        }

        const newUser = {
          id: Date.now().toString(),
          ...userData,
          points: 0,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('ecopoints_users', JSON.stringify(users));
        setUser(newUser);
        dbOperations.setCurrentUser(newUser);
        return { success: true };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    dbOperations.setCurrentUser(null);
  };

  // Update user points - updated untuk backend
  const updateUserPoints = async (points) => {
    if (!user) return;

    try {
      if (isOnline) {
        // Use backend API
        const result = await dbOperations.updateUserPoints(user.id, points);
        if (result.success) {
          setUser(result.user);
        }
      } else {
        // Fallback to localStorage (original logic)
        const updatedUser = { ...user, points: user.points + points };
        setUser(updatedUser);
        dbOperations.setCurrentUser(updatedUser);
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('ecopoints_users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('ecopoints_users', JSON.stringify(users));
        }
      }
    } catch (error) {
      console.error('Update points error:', error);
    }
  };

  // Submit deposit - new function untuk integrate dengan backend
  const submitDeposit = async (depositData) => {
    try {
      const deposit = {
        id: Date.now().toString(),
        userId: user.id,
        ...depositData,
        createdAt: new Date().toISOString()
      };

      if (isOnline) {
        // Use backend API
        const success = await dbOperations.addDeposit(deposit);
        if (success) {
          // Points automatically added by backend
          // Refresh user data to get updated points
          const updatedUser = await dbOperations.getUserInfo(user.id);
          if (updatedUser) {
            setUser(updatedUser);
            dbOperations.setCurrentUser(updatedUser);
          }
          return { success: true };
        } else {
          return { success: false, message: 'Failed to submit deposit' };
        }
      } else {
        // Fallback to localStorage (original logic)
        const deposits = JSON.parse(localStorage.getItem('ecopoints_deposits') || '[]');
        deposits.push(deposit);
        localStorage.setItem('ecopoints_deposits', JSON.stringify(deposits));
        
        // Update points immediately (original behavior)
        await updateUserPoints(deposit.points);
        return { success: true };
      }
    } catch (error) {
      console.error('Submit deposit error:', error);
      return { success: false, message: 'Failed to submit deposit' };
    }
  };

  // Get user deposits
  const getUserDeposits = async () => {
    if (!user) return [];
    
    try {
      return await dbOperations.getUserDeposits(user.id);
    } catch (error) {
      console.error('Get user deposits error:', error);
      return [];
    }
  };

  // Get user transactions
  const getUserTransactions = async () => {
    if (!user) return [];
    
    try {
      return await dbOperations.getUserTransactions(user.id);
    } catch (error) {
      console.error('Get user transactions error:', error);
      return [];
    }
  };

  // Redeem reward - new function
  const redeemReward = async (rewardData) => {
    if (!user) return { success: false, message: 'User not logged in' };

    try {
      const result = await dbOperations.redeemReward(
        user.id,
        rewardData.rewardId,
        rewardData.pointsUsed,
        rewardData.idrAmount,
        rewardData.walletInfo
      );

      if (result.success && isOnline) {
        // Refresh user data to get updated points
        const updatedUser = await dbOperations.getUserInfo(user.id);
        if (updatedUser) {
          setUser(updatedUser);
          dbOperations.setCurrentUser(updatedUser);
        }
      }

      return result;
    } catch (error) {
      console.error('Redeem reward error:', error);
      return { success: false, message: 'Failed to redeem reward' };
    }
  };

  // Get waste types from API/config
  const getWasteTypes = async () => {
    try {
      return await dbOperations.getWasteTypes();
    } catch (error) {
      console.error('Get waste types error:', error);
      return [];
    }
  };

  // Get reward options from API/config
  const getRewardOptions = async () => {
    try {
      return await dbOperations.getRewardOptions();
    } catch (error) {
      console.error('Get reward options error:', error);
      return [];
    }
  };

  // Force refresh user data
  const refreshUser = async () => {
    if (!user || !isOnline) return;

    try {
      const updatedUser = await dbOperations.getUserInfo(user.id);
      if (updatedUser) {
        setUser(updatedUser);
        dbOperations.setCurrentUser(updatedUser);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  // Check connection status
  const checkConnection = async () => {
    const backendAvailable = await checkBackendHealth();
    setIsOnline(backendAvailable);
    return backendAvailable;
  };

  // Migrate localStorage to backend (one-time)
  const migrateToBackend = async () => {
    try {
      const result = await dbOperations.migrateToBackend();
      if (result.success) {
        console.log('✅ Migration completed successfully');
        // Refresh app after migration
        await initializeApp();
      }
      return result;
    } catch (error) {
      console.error('Migration error:', error);
      return { success: false, message: 'Migration failed' };
    }
  };

  // Context value
  const contextValue = {
    // Original functions (untuk compatibility)
    user,
    isLoading,
    login,
    register,
    logout,
    updateUserPoints,

    // New functions
    submitDeposit,
    getUserDeposits,
    getUserTransactions,
    redeemReward,
    getWasteTypes,
    getRewardOptions,
    refreshUser,
    
    // System status
    isOnline,
    checkConnection,
    migrateToBackend,

    // Admin functions (jika user adalah admin)
    isAdmin: user?.role === 'admin',
    
    // Utility
    reinitialize: initializeApp
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook untuk use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Export default
export default AppContext;