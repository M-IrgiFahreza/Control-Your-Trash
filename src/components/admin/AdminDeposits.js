import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Alert from '../../ui/Alert';
import Loading from '../../ui/Loading';

const AdminDeposits = () => {
  const { user, supabaseOperations } = useApp();
  const [deposits, setDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState('all');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {
    try {
      setIsLoading(true);
      const result = await supabaseOperations.getAllDeposits();
      if (result.success) {
        setDeposits(result.data);
      } else {
        setAlert({ type: 'error', message: 'Failed to load deposits' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error loading deposits' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (depositId) => {
    try {
      setIsProcessing(true);
      const result = await supabaseOperations.updateDepositStatus(
        depositId,
        'approved',
        adminNotes,
        user.id
      );

      if (result.success) {
        setAlert({
          type: 'success',
          message: 'Deposit approved successfully!',
        });
        await loadDeposits();
        setSelectedDeposit(null);
        setAdminNotes('');
      } else {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to approve deposit' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (depositId) => {
    if (!adminNotes.trim()) {
      setAlert({
        type: 'error',
        message: 'Please provide a reason for rejection',
      });
      return;
    }

    try {
      setIsProcessing(true);
      const result = await supabaseOperations.updateDepositStatus(
        depositId,
        'rejected',
        adminNotes,
        user.id
      );

      if (result.success) {
        setAlert({ type: 'success', message: 'Deposit rejected' });
        await loadDeposits();
        setSelectedDeposit(null);
        setAdminNotes('');
      } else {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to reject deposit' });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#d97706' },
      approved: { bg: '#c6f6d5', text: '#2f855a' },
      rejected: { bg: '#fed7d7', text: '#c53030' },
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

  const filteredDeposits = deposits.filter((deposit) => {
    if (filter === 'all') return true;
    return deposit.status === filter;
  });

  if (isLoading) {
    return <Loading message="Loading deposits..." />;
  }

  return (
    <div className="container fade-in">
      <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
        ♻️ Manage Deposits
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
          All ({deposits.length})
        </button>
        <button
          className={`nav-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({deposits.filter((d) => d.status === 'pending').length})
        </button>
        <button
          className={`nav-tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved ({deposits.filter((d) => d.status === 'approved').length})
        </button>
        <button
          className={`nav-tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({deposits.filter((d) => d.status === 'rejected').length})
        </button>
      </div>

      {/* Deposits List */}
      <div className="card">
        {filteredDeposits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
            <h4 style={{ marginBottom: '0.5rem' }}>No deposits found</h4>
            <p>No deposits match the current filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Waste Type</th>
                  <th>Weight</th>
                  <th>Points</th>
                  <th>Delivery Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((deposit) => (
                  <tr key={deposit.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600' }}>
                          {deposit.profiles?.name || 'Unknown'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {deposit.profiles?.email}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          📱 {deposit.profiles?.phone}
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
                        <span>{deposit.waste_name}</span>
                      </div>
                    </td>
                    <td>{deposit.weight}kg</td>
                    <td style={{ color: '#38a169', fontWeight: 'bold' }}>
                      {deposit.points}
                    </td>
                    <td>
                      {deposit.delivery_method === 'pickup' ? (
                        <span>
                          🚚 Pickup
                          <br />
                          <small style={{ color: '#666' }}>
                            {deposit.pickup_date &&
                              new Date(
                                deposit.pickup_date
                              ).toLocaleDateString()}
                          </small>
                        </span>
                      ) : (
                        <span>🚗 Self Drop-off</span>
                      )}
                    </td>
                    <td>{getStatusBadge(deposit.status)}</td>
                    <td>
                      {new Date(deposit.created_at).toLocaleDateString(
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
                          onClick={() => setSelectedDeposit(deposit)}
                        >
                          👁️ View
                        </button>
                        {deposit.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-primary"
                              style={{
                                fontSize: '0.8rem',
                                padding: '0.25rem 0.5rem',
                              }}
                              onClick={() => {
                                setSelectedDeposit(deposit);
                                setAdminNotes('');
                              }}
                            >
                              ✅ Approve
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{
                                fontSize: '0.8rem',
                                padding: '0.25rem 0.5rem',
                              }}
                              onClick={() => {
                                setSelectedDeposit(deposit);
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

      {/* Deposit Detail Modal */}
      {selectedDeposit && (
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
              Deposit Details
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
                <strong>Name:</strong> {selectedDeposit.profiles?.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedDeposit.profiles?.email}
              </div>
              <div>
                <strong>Phone:</strong> {selectedDeposit.profiles?.phone}
              </div>
            </div>

            {/* Waste Info */}
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f0fff4',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '0.5rem' }}>♻️ Waste Information</h4>
              <div>
                <strong>Type:</strong> {selectedDeposit.waste_name}
              </div>
              <div>
                <strong>Weight:</strong> {selectedDeposit.weight}kg
              </div>
              <div>
                <strong>Points:</strong> {selectedDeposit.points}
              </div>
              <div>
                <strong>Delivery:</strong>{' '}
                {selectedDeposit.delivery_method === 'pickup'
                  ? '🚚 Pickup'
                  : '🚗 Self Drop-off'}
              </div>
              {selectedDeposit.pickup_date && (
                <div>
                  <strong>Pickup Date:</strong>{' '}
                  {new Date(selectedDeposit.pickup_date).toLocaleDateString()}
                </div>
              )}
              <div>
                <strong>Status:</strong>{' '}
                {getStatusBadge(selectedDeposit.status)}
              </div>
              <div>
                <strong>Submitted:</strong>{' '}
                {new Date(selectedDeposit.created_at).toLocaleString()}
              </div>
            </div>

            {/* Photo */}
            {selectedDeposit.photo_url && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>📷 Waste Photo</h4>
                <img
                  src={selectedDeposit.photo_url}
                  alt="Waste"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '2px solid #38a169',
                  }}
                />
              </div>
            )}

            {/* Admin Notes */}
            {selectedDeposit.status !== 'pending' &&
              selectedDeposit.admin_notes && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: '#fff8dc',
                    borderRadius: '8px',
                  }}
                >
                  <h4 style={{ marginBottom: '0.5rem' }}>📝 Admin Notes</h4>
                  <p>{selectedDeposit.admin_notes}</p>
                  {selectedDeposit.approved_at && (
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#666',
                        marginTop: '0.5rem',
                      }}
                    >
                      Processed on:{' '}
                      {new Date(selectedDeposit.approved_at).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

            {/* Action Form for Pending Deposits */}
            {selectedDeposit.status === 'pending' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>✍️ Admin Action</h4>
                <div className="form-group">
                  <label htmlFor="adminNotes">
                    Notes (optional for approval, required for rejection)
                  </label>
                  <textarea
                    id="adminNotes"
                    className="form-control"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    placeholder="Add notes about this deposit..."
                  />
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
                  setSelectedDeposit(null);
                  setAdminNotes('');
                }}
                disabled={isProcessing}
              >
                Close
              </button>

              {selectedDeposit.status === 'pending' && (
                <>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(selectedDeposit.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : '❌ Reject'}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApprove(selectedDeposit.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : '✅ Approve'}
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

export default AdminDeposits;
