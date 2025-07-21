import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { APP_CONFIG } from '../utils/config';

const Dashboard = () => {
  const { user, getUserDeposits } = useApp();
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWeight: 0,
    totalPoints: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
    }
  }, [user?.id]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      
      // Get deposits with proper error handling
      const deposits = await getUserDeposits();
      const depositsArray = Array.isArray(deposits) ? deposits : [];
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthDeposits = depositsArray.filter(d => {
        if (!d.createdAt) return false;
        try {
          const depositDate = new Date(d.createdAt);
          return depositDate.getMonth() === currentMonth && depositDate.getFullYear() === currentYear;
        } catch (error) {
          console.warn('Invalid date in deposit:', d);
          return false;
        }
      });

      setStats({
        totalDeposits: depositsArray.length,
        totalWeight: depositsArray.reduce((sum, d) => sum + (parseFloat(d.weight) || 0), 0),
        totalPoints: depositsArray.reduce((sum, d) => sum + (parseInt(d.points) || 0), 0),
        thisMonth: thisMonthDeposits.length
      });
      
    } catch (error) {
      console.error('Error loading user stats:', error);
      // Set default stats jika error
      setStats({
        totalDeposits: 0,
        totalWeight: 0,
        totalPoints: 0,
        thisMonth: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container fade-in">
        <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
          🏠 Dashboard
        </h1>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
        🏠 Dashboard
      </h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalDeposits}</div>
          <div className="stat-label">Total Deposits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalWeight.toFixed(1)}kg</div>
          <div className="stat-label">Total Weight</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalPoints.toLocaleString()}</div>
          <div className="stat-label">Points Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.thisMonth}</div>
          <div className="stat-label">This Month</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>🎯 Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary">
              ♻️ Deposit Waste
            </button>
            <button className="btn btn-secondary">
              💎 Redeem Points
            </button>
            <button className="btn btn-secondary">
              📊 View History
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>🌟 Current Balance</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38a169', textAlign: 'center', margin: '1rem 0' }}>
            {(user?.points || 0).toLocaleString()} Points
          </div>
          <p style={{ textAlign: 'center', color: '#666' }}>
            ≈ IDR {((user?.points || 0) * (APP_CONFIG?.pointsToIDR || 10)).toLocaleString()}
          </p>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            💰 Redeem Now
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>🌱 Environmental Impact</h3>
        <div className="grid grid-3">
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌍</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>
              {(stats.totalWeight * 2.3).toFixed(1)}kg
            </div>
            <div style={{ color: '#666' }}>CO₂ Reduced</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💧</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>
              {(stats.totalWeight * 15.7).toFixed(0)}L
            </div>
            <div style={{ color: '#666' }}>Water Saved</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>
              {(stats.totalWeight * 1.2).toFixed(1)}kWh
            </div>
            <div style={{ color: '#666' }}>Energy Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;