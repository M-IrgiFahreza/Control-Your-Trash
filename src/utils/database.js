// ===================================================
// DATABASE API WRAPPER - Replace localStorage dengan Backend API
// ===================================================

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Helper function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    return { success: false, message: 'Network error' };
  }
};

// Database keys (untuk compatibility)
export const DB = {
  users: 'ecopoints_users',
  deposits: 'ecopoints_deposits',
  transactions: 'ecopoints_transactions'
};

// Initialize database (tidak diperlukan untuk API)
export const initializeDB = () => {
  console.log('Database initialized (using backend API)');
};

// Database operations - EXACT SAME interface sebagai localStorage version
export const dbOperations = {
  // ===================================================
  // USERS OPERATIONS
  // ===================================================
  
  // Get all users (admin only)
  getUsers: async () => {
    console.warn('getUsers() is deprecated - use API directly');
    return [];
  },

  // Set users (admin only)  
  setUsers: async (users) => {
    console.warn('setUsers() is deprecated - use API directly');
    return true;
  },

  // Current User Session
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  },

  // ===================================================
  // DEPOSITS OPERATIONS  
  // ===================================================

  // Get all deposits (admin only)
  getDeposits: async () => {
    const result = await apiCall('/deposits');
    return result || [];
  },

  // Set deposits (admin only)
  setDeposits: async (deposits) => {
    console.warn('setDeposits() is deprecated - use API directly');
    return true;
  },

  // Add new deposit (EXACT same interface)
  addDeposit: async (deposit) => {
    try {
      const result = await apiCall('/deposits', {
        method: 'POST',
        body: JSON.stringify(deposit),
      });

      if (result.success) {
        console.log('Deposit added successfully');
        return true;
      } else {
        console.error('Failed to add deposit:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Add deposit error:', error);
      return false;
    }
  },

  // Get user deposits (EXACT same interface)
  getUserDeposits: async (userId) => {
    try {
      const deposits = await apiCall(`/deposits/${userId}`);
      return deposits || [];
    } catch (error) {
      console.error('Get user deposits error:', error);
      return [];
    }
  },

  // ===================================================
  // TRANSACTIONS OPERATIONS
  // ===================================================

  // Get all transactions (admin only)
  getTransactions: async () => {
    console.warn('getTransactions() is deprecated - use getUserTransactions()');
    return [];
  },

  // Set transactions (admin only)
  setTransactions: async (transactions) => {
    console.warn('setTransactions() is deprecated - use API directly');
    return true;
  },

  // Add transaction (internal use)
  addTransaction: async (transaction) => {
    console.log('Transaction recorded via deposit/redemption API');
    return true;
  },

  // Get user transactions (EXACT same interface)
  getUserTransactions: async (userId) => {
    try {
      const transactions = await apiCall(`/transactions/${userId}`);
      return transactions || [];
    } catch (error) {
      console.error('Get user transactions error:', error);
      return [];
    }
  },

  // ===================================================
  // NEW API FUNCTIONS (additional)
  // ===================================================

  // Login function (untuk AppContext)
  login: async (email, password) => {
    try {
      const result = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (result.success) {
        dbOperations.setCurrentUser(result.user);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Register function (untuk AppContext)
  register: async (userData) => {
    try {
      const result = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (result.success) {
        dbOperations.setCurrentUser(result.user);
      }

      return result;
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Update user points
  updateUserPoints: async (userId, points) => {
    try {
      const result = await apiCall(`/users/${userId}/points`, {
        method: 'PUT',
        body: JSON.stringify({ points }),
      });

      if (result.success) {
        // Update current user in localStorage
        const currentUser = dbOperations.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.points = result.user.points;
          dbOperations.setCurrentUser(currentUser);
        }
      }

      return result;
    } catch (error) {
      console.error('Update user points error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Get user info
  getUserInfo: async (userId) => {
    try {
      const user = await apiCall(`/users/${userId}`);
      return user;
    } catch (error) {
      console.error('Get user info error:', error);
      return null;
    }
  },

  // ===================================================
  // CONFIG FUNCTIONS
  // ===================================================

  // Get waste types from API (replace config.js)
  getWasteTypes: async () => {
    try {
      const wasteTypes = await apiCall('/config/waste-types');
      return wasteTypes || [];
    } catch (error) {
      console.error('Get waste types error:', error);
      // Fallback to default if API fails
      return [
        { id: 'bottles', name: 'Plastic Bottles', icon: '🍶', pointsPerKg: 50, description: 'Plastic water bottles, soda bottles, etc.' },
        { id: 'cans', name: 'Aluminum Cans', icon: '🥤', pointsPerKg: 80, description: 'Beverage cans, food cans, etc.' },
        { id: 'cardboard', name: 'Cardboard', icon: '📦', pointsPerKg: 30, description: 'Cardboard boxes, packaging materials' },
        { id: 'paper', name: 'Paper', icon: '📄', pointsPerKg: 25, description: 'Newspapers, magazines, office paper' },
        { id: 'glass', name: 'Glass', icon: '🍾', pointsPerKg: 60, description: 'Glass bottles, jars, containers' },
        { id: 'electronic', name: 'Electronics', icon: '📱', pointsPerKg: 100, description: 'Old phones, batteries, small electronics' }
      ];
    }
  },

  // Get reward options from API (replace config.js)
  getRewardOptions: async () => {
    try {
      const rewards = await apiCall('/config/reward-options');
      return rewards || [];
    } catch (error) {
      console.error('Get reward options error:', error);
      // Fallback to default if API fails
      return [
        { id: 'gopay', name: 'GoPay', logo: '💚', minPoints: 1000, rate: 100, description: 'Transfer to your GoPay wallet' },
        { id: 'shopee', name: 'ShopeePay', logo: '🛒', minPoints: 1000, rate: 100, description: 'Transfer to your ShopeePay wallet' },
        { id: 'ovo', name: 'OVO', logo: '💜', minPoints: 1000, rate: 100, description: 'Transfer to your OVO wallet' }
      ];
    }
  },

  // ===================================================
  // REWARD FUNCTIONS
  // ===================================================

  // Redeem reward
  redeemReward: async (userId, rewardId, pointsUsed, idrAmount, walletInfo) => {
    try {
      const result = await apiCall('/rewards/redeem', {
        method: 'POST',
        body: JSON.stringify({ userId, rewardId, pointsUsed, idrAmount, walletInfo }),
      });

      return result;
    } catch (error) {
      console.error('Redeem reward error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Get user redemptions
  getUserRedemptions: async (userId) => {
    try {
      const redemptions = await apiCall(`/rewards/redemptions/${userId}`);
      return redemptions || [];
    } catch (error) {
      console.error('Get user redemptions error:', error);
      return [];
    }
  },

  // ===================================================
  // ADMIN FUNCTIONS
  // ===================================================

  // Get pending deposits (admin)
  getPendingDeposits: async () => {
    try {
      const deposits = await apiCall('/admin/deposits/pending');
      return deposits || [];
    } catch (error) {
      console.error('Get pending deposits error:', error);
      return [];
    }
  },

  // Approve deposit (admin)
  approveDeposit: async (depositId, adminId, adminNotes = '') => {
    try {
      const result = await apiCall(`/admin/deposits/${depositId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ adminId, adminNotes }),
      });

      return result;
    } catch (error) {
      console.error('Approve deposit error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Reject deposit (admin)
  rejectDeposit: async (depositId, adminId, rejectionReason) => {
    try {
      const result = await apiCall(`/admin/deposits/${depositId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ adminId, rejectionReason }),
      });

      return result;
    } catch (error) {
      console.error('Reject deposit error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Get admin stats
  getAdminStats: async () => {
    try {
      const stats = await apiCall('/admin/stats');
      return stats || {};
    } catch (error) {
      console.error('Get admin stats error:', error);
      return {};
    }
  },

  // ===================================================
  // MIGRATION FUNCTIONS (one-time use)
  // ===================================================

  // Migrate localStorage data to backend
  migrateToBackend: async () => {
    try {
      console.log('Starting migration from localStorage to backend...');

      // Migrate users
      const localUsers = JSON.parse(localStorage.getItem('ecopoints_users') || '[]');
      if (localUsers.length > 0) {
        const userResult = await apiCall('/migrate/users', {
          method: 'POST',
          body: JSON.stringify({ users: localUsers }),
        });
        console.log('Users migration:', userResult.message);
      }

      // Migrate deposits
      const localDeposits = JSON.parse(localStorage.getItem('ecopoints_deposits') || '[]');
      if (localDeposits.length > 0) {
        const depositResult = await apiCall('/migrate/deposits', {
          method: 'POST',
          body: JSON.stringify({ deposits: localDeposits }),
        });
        console.log('Deposits migration:', depositResult.message);
      }

      console.log('Migration completed!');
      return { success: true, message: 'Migration completed successfully' };

    } catch (error) {
      console.error('Migration error:', error);
      return { success: false, message: 'Migration failed' };
    }
  }
};

// ===================================================
// UTILITY FUNCTIONS
// ===================================================

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    const result = await apiCall('/test');
    return result.message === 'EcoPoints API is running!';
  } catch (error) {
    return false;
  }
};

// Switch between localStorage and API
export const switchToAPI = () => {
  console.log('Switched to backend API mode');
  // Bisa tambah logic untuk flag switching
};

export const switchToLocalStorage = () => {
  console.log('Switched to localStorage mode (fallback)');
  // Fallback ke localStorage jika API down
};

// ===================================================
// EXPORT DEFAULT (untuk compatibility)
// ===================================================
export default {
  DB,
  initializeDB,
  dbOperations,
  checkBackendHealth,
  switchToAPI,
  switchToLocalStorage
};