import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const History = () => {
  const { user, getUserDeposits } = useApp();
  const [userDeposits, setUserDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadUserDeposits();
    }
  }, [user?.id]);

  const loadUserDeposits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const deposits = await getUserDeposits();
      
      // SAFETY CHECK: Pastikan deposits adalah array
      const depositsArray = Array.isArray(deposits) ? deposits : [];
      
      // Sort by date (newest first) dengan error handling
      const sortedDeposits = depositsArray.sort((a, b) => {
        try {
          const dateA = new Date(a.createdAt || a.deposit_date || 0);
          const dateB = new Date(b.createdAt || b.deposit_date || 0);
          return dateB - dateA;
        } catch (err) {
          console.warn('Error sorting deposits:', err);
          return 0;
        }
      });
      
      setUserDeposits(sortedDeposits);
      
    } catch (error) {
      console.error('Error loading user deposits:', error);
      setError('Failed to load deposit history');
      setUserDeposits([]); // Set empty array kalau error
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: '#f39c12', text: '⏳ Pending', bg: '#fff9e6' },
      'approved': { color: '#27ae60', text: '✅ Approved', bg: '#f0fff4' },
      'rejected': { color: '#e74c3c', text: '❌ Rejected', bg: '#fff5f5' }
    };
    
    const config = statusConfig[status] || statusConfig['approved'];
    
    return (
      <span style={{
        color: config.color,
        backgroundColor: config.bg,
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: '500',
        border: `1px solid ${config.color}20`
      }}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container fade-in">
        <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
          📊 Deposit History
        </h1>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container fade-in">
        <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
          📊 Deposit History
        </h1>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={loadUserDeposits}
            style={{ marginTop: '1rem' }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
        📊 Deposit History
      </h1>

      {userDeposits.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No Deposits Yet</h3>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            Start contributing to the environment by depositing your waste!
          </p>
          <button className="btn btn-primary">
            ♻️ Make Your First Deposit
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {userDeposits.map((deposit, index) => (
            <div key={deposit.id || index} className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{ 
                    color: '#38a169', 
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.2rem'
                  }}>
                    {deposit.typeName || deposit.type || 'Unknown Type'}
                  </h3>
                  <p style={{ 
                    color: '#666', 
                    margin: 0,
                    fontSize: '0.9rem'
                  }}>
                    {formatDate(deposit.createdAt || deposit.deposit_date)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {getStatusBadge(deposit.status || 'approved')}
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>
                    {parseFloat(deposit.weight || 0).toFixed(1)}kg
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Weight</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f39c12' }}>
                    {parseInt(deposit.points || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Points</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ecc71' }}>
                    IDR {(parseInt(deposit.points || 0) * 10).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Value</div>
                </div>
              </div>

              {deposit.photo && (
                <div style={{ marginTop: '1rem' }}>
                  <img 
                    src={deposit.photo} 
                    alt="Deposit" 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }} 
                  />
                </div>
              )}

              {deposit.admin_notes && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  borderLeft: '4px solid #38a169'
                }}>
                  <strong style={{ color: '#38a169', fontSize: '0.9rem' }}>Admin Notes:</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#555' }}>
                    {deposit.admin_notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;