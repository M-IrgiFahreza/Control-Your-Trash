// ===================================================
// server.js - Main server
// ===================================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecopoints',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // For base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===================================================
// AUTH ROUTES - Replace AppContext login/register
// ===================================================

// Login (exact match dengan AppContext.login)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND password = ? AND is_active = true',
      [email, password]
    );

    if (users.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        createdAt: user.createdAt,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register (exact match dengan AppContext.register)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.json({ success: false, message: 'Email already exists' });
    }

    // Create new user (format sama dengan localStorage)
    const userId = Date.now().toString();
    const createdAt = new Date().toISOString();

    await pool.execute(
      'INSERT INTO users (id, name, email, password, phone, points, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, password, phone, 0, createdAt]
    );

    res.json({
      success: true,
      user: {
        id: userId,
        name,
        email,
        phone,
        points: 0,
        createdAt,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===================================================
// DEPOSIT ROUTES - Replace dbOperations
// ===================================================

// Add Deposit (exact match dengan dbOperations.addDeposit)
app.post('/api/deposits', async (req, res) => {
  try {
    const { id, userId, type, typeName, weight, points, photo, createdAt } = req.body;

    // Call stored procedure (sama dengan sistem lama - langsung approved)
    await pool.execute(
      'CALL AddDeposit(?, ?, ?, ?, ?, ?, ?, ?)',
      [id, userId, type, typeName, weight, points, photo, createdAt]
    );

    res.json({ success: true, message: 'Deposit added successfully' });

  } catch (error) {
    console.error('Add deposit error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get User Deposits (exact match dengan dbOperations.getUserDeposits)
app.get('/api/deposits/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [deposits] = await pool.execute(
      'SELECT * FROM deposits WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );

    res.json(deposits);

  } catch (error) {
    console.error('Get deposits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get All Deposits (untuk admin)
app.get('/api/deposits', async (req, res) => {
  try {
    const [deposits] = await pool.execute(
      'SELECT * FROM deposits_with_users ORDER BY deposit_date DESC'
    );

    res.json(deposits);

  } catch (error) {
    console.error('Get all deposits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===================================================
// USER ROUTES - Replace AppContext functions
// ===================================================

// Get User Info (replace getCurrentUser)
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ? AND is_active = true',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      points: user.points,
      createdAt: user.createdAt,
      role: user.role
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update User Points (replace updateUserPoints)
app.put('/api/users/:id/points', async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    await pool.execute(
      'UPDATE users SET points = points + ? WHERE id = ?',
      [points, id]
    );

    // Get updated user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    res.json({ success: true, user: users[0] });

  } catch (error) {
    console.error('Update points error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===================================================
// CONFIG ROUTES - Serve wasteTypes & rewardOptions
// ===================================================

// Get Waste Types (dari database, sync dengan config.js)
app.get('/api/config/waste-types', async (req, res) => {
  try {
    const [wasteTypes] = await pool.execute(
      'SELECT * FROM waste_types WHERE is_active = true ORDER BY name'
    );

    res.json(wasteTypes);

  } catch (error) {
    console.error('Get waste types error:', error);
    res.status(500).json([]);
  }
});

// Get Reward Options (dari database, sync dengan config.js)
app.get('/api/config/reward-options', async (req, res) => {
  try {
    const [rewards] = await pool.execute(
      'SELECT * FROM reward_options WHERE is_active = true ORDER BY name'
    );

    res.json(rewards);

  } catch (error) {
    console.error('Get reward options error:', error);
    res.status(500).json([]);
  }
});

// ===================================================
// ADMIN ROUTES - Untuk approval sistem
// ===================================================

// Get Pending Deposits
app.get('/api/admin/deposits/pending', async (req, res) => {
  try {
    const [deposits] = await pool.execute(
      'SELECT * FROM pending_deposits ORDER BY deposit_date DESC'
    );

    res.json(deposits);

  } catch (error) {
    console.error('Get pending deposits error:', error);
    res.status(500).json([]);
  }
});

// Approve Deposit
app.post('/api/admin/deposits/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, adminNotes } = req.body;

    await pool.execute(
      'CALL AdminApproveDeposit(?, ?, ?)',
      [id, adminId || 'admin123', adminNotes || '']
    );

    res.json({ success: true, message: 'Deposit approved successfully' });

  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reject Deposit  
app.post('/api/admin/deposits/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, rejectionReason } = req.body;

    await pool.execute(
      'CALL AdminRejectDeposit(?, ?, ?)',
      [id, adminId || 'admin123', rejectionReason]
    );

    res.json({ success: true, message: 'Deposit rejected successfully' });

  } catch (error) {
    console.error('Reject deposit error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get Admin Stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    // Total pending deposits
    const [pendingCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM deposits WHERE status = "pending"'
    );

    // Today's deposits
    const [todayDeposits] = await pool.execute(
      'SELECT COUNT(*) as count FROM deposits WHERE DATE(createdAt) = CURDATE()'
    );

    // Total users
    const [totalUsers] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "user"'
    );

    // Total weight processed
    const [totalWeight] = await pool.execute(
      'SELECT COALESCE(SUM(weight), 0) as total FROM deposits WHERE status = "approved"'
    );

    res.json({
      pendingCount: pendingCount[0].count,
      todayDeposits: todayDeposits[0].count,
      totalUsers: totalUsers[0].count,
      totalWeight: totalWeight[0].total
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({});
  }
});

// ===================================================
// REWARD ROUTES - Untuk redeem system
// ===================================================

// Redeem Reward
app.post('/api/rewards/redeem', async (req, res) => {
  try {
    const { userId, rewardId, pointsUsed, idrAmount, walletInfo } = req.body;

    await pool.execute(
      'CALL RedeemReward(?, ?, ?, ?, ?)',
      [userId, rewardId, pointsUsed, idrAmount, walletInfo]
    );

    res.json({ success: true, message: 'Reward redeemed successfully' });

  } catch (error) {
    console.error('Redeem reward error:', error);
    if (error.message.includes('Insufficient points')) {
      res.status(400).json({ success: false, message: 'Insufficient points' });
    } else {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});

// Get User Redemptions
app.get('/api/rewards/redemptions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [redemptions] = await pool.execute(`
      SELECT rr.*, ro.name as reward_name, ro.logo 
      FROM reward_redemptions rr
      JOIN reward_options ro ON rr.reward_id = ro.id
      WHERE rr.userId = ?
      ORDER BY rr.createdAt DESC
    `, [userId]);

    res.json(redemptions);

  } catch (error) {
    console.error('Get redemptions error:', error);
    res.status(500).json([]);
  }
});

// ===================================================
// TRANSACTIONS ROUTES
// ===================================================

// Get User Transactions (replace dbOperations.getUserTransactions)
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [transactions] = await pool.execute(
      'SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );

    res.json(transactions);

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json([]);
  }
});

// ===================================================
// MIGRATION ROUTE - Import dari localStorage
// ===================================================

// Import Users dari localStorage
app.post('/api/migrate/users', async (req, res) => {
  try {
    const { users } = req.body; // Array dari localStorage

    for (const user of users) {
      await pool.execute(
        'INSERT IGNORE INTO users (id, name, email, password, phone, points, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user.id, user.name, user.email, user.password, user.phone, user.points || 0, user.createdAt]
      );
    }

    res.json({ success: true, message: `Imported ${users.length} users` });

  } catch (error) {
    console.error('Import users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Import Deposits dari localStorage
app.post('/api/migrate/deposits', async (req, res) => {
  try {
    const { deposits } = req.body; // Array dari localStorage

    for (const deposit of deposits) {
      await pool.execute(
        'INSERT IGNORE INTO deposits (id, userId, type, typeName, weight, points, photo, createdAt, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [deposit.id, deposit.userId, deposit.type, deposit.typeName, deposit.weight, deposit.points, deposit.photo, deposit.createdAt, 'approved']
      );
    }

    res.json({ success: true, message: `Imported ${deposits.length} deposits` });

  } catch (error) {
    console.error('Import deposits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===================================================
// TEST ROUTES
// ===================================================

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'EcoPoints API is running!',
    timestamp: new Date().toISOString(),
    config: {
      pointsToIDR: 10,
      minRedeemAmount: 1000
    }
  });
});

// ===================================================
// ERROR HANDLING
// ===================================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ===================================================
// START SERVER
// ===================================================

app.listen(PORT, () => {
  console.log(`🚀 EcoPoints API running on port ${PORT}`);
  console.log(`📊 Admin dashboard: http://localhost:${PORT}/api/admin/stats`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

// ===================================================
// .env file untuk backend
// ===================================================
/*
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecopoints

# Server Configuration  
PORT=5000
NODE_ENV=development

# CORS (optional)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
*/