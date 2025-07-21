import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Loading from '../../ui/Loading';
import Alert from '../../ui/Alert';

const AdminUsers = () => {
  const { supabaseOperations } = useApp();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDeposits, setUserDeposits] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const result = await supabaseOperations.getAllUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        setAlert({ type: 'error', message: 'Failed to load users' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error loading users' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserActivity = async (userId) => {
    try {
      // Load user deposits
      const depositsResult = await supabaseOperations.getUserDeposits(userId);
      if (depositsResult.success) {
        setUserDeposits(depositsResult.data);
      }

      // Load user transactions
      const transactionsResult =
        await supabaseOperations.getUserTransactions(userId);
      if (transactionsResult.success) {
        setUserTransactions(transactionsResult.data);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error loading user activity' });
    }
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    await loadUserActivity(user.id);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#d97706' },
      approved: { bg: '#c6f6d5', text: '#2f855a' },
      rejected: { bg: '#fed7d7', text: '#c53030' },
      completed: { bg: '#c6f6d5', text: '#2f855a' },
      failed: { bg: '#fed7d7', text: '#c53030' },
    };

    const color = colors[status] || { bg: '#e2e8f0', text: '#4a5568' };

    return (
      <span
        style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '600',
          background: color.bg,
          color: color.text,
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return <Loading message="Loading users..." />;
  }

  return (
    <div className="container fade-in">
      <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
        👥 User Management
      </h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="search">🔍 Search Users</label>
          <input
            type="text"
            id="search"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
          />
        </div>
      </div>

      <div className="grid grid-2">
        {/* Users List */}
        <div className="card">
          <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>
            Users ({filteredUsers.length})
          </h3>

          {filteredUsers.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '2rem', color: '#666' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
              <p>No users found</p>
            </div>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    border:
                      selectedUser?.id === user.id
                        ? '2px solid #38a169'
                        : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background:
                      selectedUser?.id === user.id ? '#f0fff4' : '#f7fafc',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => handleUserSelect(user)}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ fontWeight: '600', marginBottom: '0.25rem' }}
                      >
                        {user.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          color: '#666',
                          marginBottom: '0.25rem',
                        }}
                      >
                        📧 {user.email}
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          color: '#666',
                          marginBottom: '0.25rem',
                        }}
                      >
                        📱 {user.phone || 'No phone'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: '#38a169',
                        }}
                      >
                        {user.points?.toLocaleString() || 0}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        points
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="card">
          {selectedUser ? (
            <>
              <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>
                User Details: {selectedUser.name}
              </h3>

              {/* User Info */}
              <div
                style={{
                  marginBottom: '2rem',
                  padding: '1rem',
                  background: '#f7fafc',
                  borderRadius: '8px',
                }}
              >
                <h4 style={{ marginBottom: '1rem' }}>👤 Profile Information</h4>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Name:</strong> {selectedUser.name}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Phone:</strong> {selectedUser.phone || 'Not provided'}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Points:</strong>{' '}
                  {selectedUser.points?.toLocaleString() || 0}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Joined:</strong>{' '}
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Activity Stats */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>📊 Activity Summary</h4>
                <div className="grid grid-3">
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      background: '#f0fff4',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#38a169',
                      }}
                    >
                      {userDeposits.length}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      Total Deposits
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      background: '#f0fff4',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#38a169',
                      }}
                    >
                      {userDeposits
                        .reduce((sum, d) => sum + d.weight, 0)
                        .toFixed(1)}
                      kg
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      Total Weight
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      background: '#f0fff4',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#38a169',
                      }}
                    >
                      {
                        userTransactions.filter((t) => t.type === 'redeem')
                          .length
                      }
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      Redemptions
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Deposits */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>♻️ Recent Deposits</h4>
                {userDeposits.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      color: '#666',
                      background: '#f7fafc',
                      borderRadius: '8px',
                    }}
                  >
                    No deposits yet
                  </div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {userDeposits.slice(0, 5).map((deposit) => (
                      <div
                        key={deposit.id}
                        style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          background: 'white',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600' }}>
                              {deposit.waste_name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                              {deposit.weight}kg • {deposit.points} points •
                              {deposit.delivery_method === 'pickup'
                                ? ' 🚚 Pickup'
                                : ' 🚗 Self Drop'}
                            </div>
                          </div>
                          <div>{getStatusBadge(deposit.status)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Transactions */}
              <div>
                <h4 style={{ marginBottom: '1rem' }}>💳 Recent Transactions</h4>
                {userTransactions.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      color: '#666',
                      background: '#f7fafc',
                      borderRadius: '8px',
                    }}
                  >
                    No transactions yet
                  </div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {userTransactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          background: 'white',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600' }}>
                              {transaction.type === 'redeem'
                                ? `${transaction.reward_type} - IDR ${transaction.amount?.toLocaleString()}`
                                : `Earned ${transaction.amount} points`}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                              {transaction.type === 'redeem' &&
                                transaction.phone_number && (
                                  <>📱 {transaction.phone_number} • </>
                                )}
                              {new Date(
                                transaction.created_at
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <div>{getStatusBadge(transaction.status)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              style={{ textAlign: 'center', padding: '3rem', color: '#666' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Select a User</h4>
              <p>
                Click on a user from the list to view their details and
                activity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
