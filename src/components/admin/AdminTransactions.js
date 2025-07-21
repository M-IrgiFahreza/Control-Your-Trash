import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Alert from '../../ui/Alert';
import Loading from '../../ui/Loading';

const AdminTransactions = () => {
  const { user, supabaseOperations } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState('all');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const result = await supabaseOperations.getAllTransactions();
      if (result.success) {
        // Filter only redemption transactions
        setTransactions(result.data.filter((t) => t.type === 'redeem'));
      } else {
        setAlert({ type: 'error', message: 'Failed to load transactions' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error loading transactions' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    try {
      setIsProcessing(true);
      const result = await supabaseOperations.updateTransactionStatus(
        transactionId,
        'completed',
        adminNotes,
        user.id
      );

      if (result.success) {
        setAlert({
          type: 'success',
          message: 'Transaction approved and completed!',
        });
        await loadTransactions();
        setSelectedTransaction(null);
        setAdminNotes('');
      } else {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to approve transaction' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (transactionId) => {
    if (!adminNotes.trim()) {
      setAlert({
        type: 'error',
        message: 'Please provide a reason for rejection',
      });
      return;
    }

    try {
      setIsProcessing(true);
      const result = await supabaseOperations.updateTransactionStatus(
        transactionId,
        'failed',
        adminNotes,
        user.id
      );

      if (result.success) {
        setAlert({ type: 'success', message: 'Transaction rejected' });
        await loadTransactions();
        setSelectedTransaction(null);
        setAdminNotes('');
      } else {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to reject transaction' });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#d97706' },
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

  const getRewardIcon = (rewardType) => {
    const icons = {
      gopay: '💚',
      shopee: '🛒',
      ovo: '💜',
    };
    return icons[rewardType] || '💳';
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  if (isLoading) {
    return <Loading message="Loading transactions..." />;
  }

  return (
    <div className="container fade-in">
      <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
        💳 Manage Transactions
      </h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Filter Tabs */}
      <div className="nav-tabs">
        <button
          className={`nav-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({transactions.length})
        </button>
        <button
          className={`nav-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({transactions.filter((t) => t.status === 'pending').length})
        </button>
        <button
          className={`nav-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed (
          {transactions.filter((t) => t.status === 'completed').length})
        </button>
        <button
          className={`nav-tab ${filter === 'failed' ? 'active' : ''}`}
          onClick={() => setFilter('failed')}
        >
          Failed ({transactions.filter((t) => t.status === 'failed').length})
        </button>
      </div>

      {/* Transactions List */}
      <div className="card">
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💸</div>
            <h4 style={{ marginBottom: '0.5rem' }}>No transactions found</h4>
            <p>No transactions match the current filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>E-Wallet</th>
                  <th>Amount</th>
                  <th>Points Used</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600' }}>
                          {transaction.profiles?.name || 'Unknown'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {transaction.profiles?.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span>{getRewardIcon(transaction.reward_type)}</span>
                        <span>{transaction.reward_type?.toUpperCase()}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>
                      IDR {transaction.amount?.toLocaleString()}
                    </td>
                    <td style={{ color: '#e53e3e', fontWeight: 'bold' }}>
                      -{transaction.points_used}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>
                        <div>
                          <strong>Name:</strong> {transaction.full_name}
                        </div>
                        <div>
                          <strong>Phone:</strong> {transaction.phone_number}
                        </div>
                        {transaction.ewallet_number && (
                          <div>
                            <strong>E-wallet:</strong>{' '}
                            {transaction.ewallet_number}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(transaction.status)}</td>
                    <td>
                      {new Date(transaction.created_at).toLocaleDateString(
                        'id-ID',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          className="btn btn-secondary"
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.25rem 0.5rem',
                          }}
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          👁️ View
                        </button>
                        {transaction.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-primary"
                              style={{
                                fontSize: '0.8rem',
                                padding: '0.25rem 0.5rem',
                              }}
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setAdminNotes('');
                              }}
                            >
                              ✅ Complete
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{
                                fontSize: '0.8rem',
                                padding: '0.25rem 0.5rem',
                              }}
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setAdminNotes('');
                              }}
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}
          >
            <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>
              Transaction Details
            </h3>

            {/* User Info */}
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f7fafc',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '0.5rem' }}>👤 User Information</h4>
              <div>
                <strong>Name:</strong> {selectedTransaction.profiles?.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedTransaction.profiles?.email}
              </div>
              <div>
                <strong>User Phone:</strong>{' '}
                {selectedTransaction.profiles?.phone}
              </div>
            </div>

            {/* Transaction Info */}
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f0fff4',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '0.5rem' }}>
                💳 Transaction Information
              </h4>
              <div>
                <strong>E-Wallet:</strong>{' '}
                {getRewardIcon(selectedTransaction.reward_type)}{' '}
                {selectedTransaction.reward_type?.toUpperCase()}
              </div>
              <div>
                <strong>Amount:</strong> IDR{' '}
                {selectedTransaction.amount?.toLocaleString()}
              </div>
              <div>
                <strong>Points Used:</strong> {selectedTransaction.points_used}
              </div>
              <div>
                <strong>Status:</strong>{' '}
                {getStatusBadge(selectedTransaction.status)}
              </div>
              <div>
                <strong>Requested:</strong>{' '}
                {new Date(selectedTransaction.created_at).toLocaleString()}
              </div>
            </div>

            {/* Recipient Info */}
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#fff8dc',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '0.5rem' }}>
                📱 Recipient Information
              </h4>
              <div>
                <strong>Full Name:</strong> {selectedTransaction.full_name}
              </div>
              <div>
                <strong>Phone Number:</strong>{' '}
                {selectedTransaction.phone_number}
              </div>
              {selectedTransaction.ewallet_number && (
                <div>
                  <strong>E-wallet Number:</strong>{' '}
                  {selectedTransaction.ewallet_number}
                </div>
              )}
            </div>

            {/* Admin Notes */}
            {selectedTransaction.status !== 'pending' &&
              selectedTransaction.admin_notes && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: '#e6fffa',
                    borderRadius: '8px',
                  }}
                >
                  <h4 style={{ marginBottom: '0.5rem' }}>📝 Admin Notes</h4>
                  <p>{selectedTransaction.admin_notes}</p>
                  {selectedTransaction.processed_at && (
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#666',
                        marginTop: '0.5rem',
                      }}
                    >
                      Processed on:{' '}
                      {new Date(
                        selectedTransaction.processed_at
                      ).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

            {/* Action Form for Pending Transactions */}
            {selectedTransaction.status === 'pending' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>✍️ Admin Action</h4>
                <div className="form-group">
                  <label htmlFor="adminNotes">
                    Notes (optional for completion, required for rejection)
                  </label>
                  <textarea
                    id="adminNotes"
                    className="form-control"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    placeholder="Add notes about this transaction processing..."
                  />
                </div>

                <div
                  style={{
                    padding: '1rem',
                    background: '#f0fff4',
                    borderRadius: '8px',
                    border: '1px solid #38a169',
                    marginTop: '1rem',
                  }}
                >
                  <h5 style={{ color: '#2f855a', marginBottom: '0.5rem' }}>
                    💡 Processing Instructions:
                  </h5>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.5rem',
                      color: '#2f855a',
                    }}
                  >
                    <li>Verify recipient information matches user's request</li>
                    <li>
                      Process the e-wallet transfer manually through your system
                    </li>
                    <li>Mark as "Complete" only after successful transfer</li>
                    <li>
                      Mark as "Reject" if transfer fails or information is
                      invalid
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedTransaction(null);
                  setAdminNotes('');
                }}
                disabled={isProcessing}
              >
                Close
              </button>

              {selectedTransaction.status === 'pending' && (
                <>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(selectedTransaction.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : '❌ Reject'}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApprove(selectedTransaction.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : '✅ Complete Transfer'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
