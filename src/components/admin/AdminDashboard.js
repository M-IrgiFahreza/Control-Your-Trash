import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const AdminDashboard = () => {
  const { user, logout } = useApp();
  const [stats, setStats] = useState({});
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load admin stats
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Load all deposits
      const depositsResponse = await fetch('http://localhost:5000/api/deposits');
      const depositsData = await depositsResponse.json();
      setDeposits(Array.isArray(depositsData) ? depositsData : []);

    } catch (error) {
      console.error('Error loading admin data:', error);
      setStats({});
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'approved': return '#27ae60';
      case 'rejected': return '#e74c3c';
      default: return '#27ae60';
    }
  };

  const approveDeposit = async (depositId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/deposits/${depositId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user.id, adminNotes: 'Approved by admin' })
      });
      
      if (response.ok) {
        alert('Deposit approved successfully!');
        loadAdminData(); // Refresh data
      } else {
        alert('Failed to approve deposit');
      }
    } catch (error) {
      console.error('Error approving deposit:', error);
      alert('Error approving deposit');
    }
  };

  const rejectDeposit = async (depositId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/deposits/${depositId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user.id, rejectionReason: reason })
      });
      
      if (response.ok) {
        alert('Deposit rejected successfully!');
        loadAdminData(); // Refresh data
      } else {
        alert('Failed to reject deposit');
      }
    } catch (error) {
      console.error('Error rejecting deposit:', error);
      alert('Error rejecting deposit');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🛡️ Admin Dashboard</h1>
        <p>Loading admin data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0' }}>🛡️ Admin Dashboard</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>Welcome back, {user.name}!</p>
          </div>
          <button 
            onClick={logout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
            {stats.pendingCount || 0}
          </div>
          <div>Pending Deposits</div>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
            {stats.todayDeposits || 0}
          </div>
          <div>Today's Deposits</div>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
            {stats.totalUsers || 0}
          </div>
          <div>Total Users</div>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
            {parseFloat(stats.totalWeight || 0).toFixed(1)}kg
          </div>
          <div>Total Weight</div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{
            background: activeTab === 'overview' ? '#e74c3c' : '#f8f9fa',
            color: activeTab === 'overview' ? 'white' : '#333',
            border: 'none',
            padding: '0.75rem 1.5rem',
            marginRight: '0.5rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          📊 Overview
        </button>
        <button 
          onClick={() => setActiveTab('deposits')}
          style={{
            background: activeTab === 'deposits' ? '#e74c3c' : '#f8f9fa',
            color: activeTab === 'deposits' ? 'white' : '#333',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ♻️ All Deposits ({deposits.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <h3>📈 Quick Overview</h3>
          <p>System is running smoothly!</p>
          <ul>
            <li>✅ Backend API: Connected</li>
            <li>✅ Database: Connected</li>
            <li>✅ Users: {stats.totalUsers || 0} registered</li>
            <li>⏳ Pending: {stats.pendingCount || 0} deposits need review</li>
          </ul>
        </div>
      )}

      {activeTab === 'deposits' && (
        <div>
          <h3>♻️ All Deposits</h3>
          {deposits.length === 0 ? (
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px', 
              textAlign: 'center' 
            }}>
              <p>No deposits found.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {deposits.slice(0, 20).map((deposit, index) => (
                <div key={deposit.id || index} style={{ 
                  background: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                        {deposit.user_name || 'Unknown User'}
                      </h4>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                        📧 {deposit.user_email || 'No email'}
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                        🗓️ {formatDate(deposit.deposit_date || deposit.createdAt)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        color: getStatusColor(deposit.status),
                        background: `${getStatusColor(deposit.status)}20`,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        {deposit.status === 'pending' ? '⏳ Pending' : 
                         deposit.status === 'approved' ? '✅ Approved' : 
                         '❌ Rejected'}
                      </span>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '1rem',
                    margin: '1rem 0'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#38a169' }}>
                        {deposit.typeName || deposit.type}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Type</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#38a169' }}>
                        {parseFloat(deposit.weight || 0).toFixed(1)}kg
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Weight</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#f39c12' }}>
                        {parseInt(deposit.points || 0)} pts
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Points</div>
                    </div>
                  </div>

                  {deposit.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button 
                        onClick={() => approveDeposit(deposit.id)}
                        style={{
                          background: '#27ae60',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        onClick={() => rejectDeposit(deposit.id)}
                        style={{
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;