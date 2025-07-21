import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbOperations } from '../utils/database';
import { rewardOptions, APP_CONFIG } from '../utils/config';
import Alert from './ui/Alert';

const Rewards = () => {
  const { user, updateUserPoints } = useApp();
  const [alert, setAlert] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setAmount('');
  };

  const confirmRedeem = () => {
    if (!amount || parseFloat(amount) < APP_CONFIG.minRedeemAmount) {
      setAlert({ type: 'error', message: `Minimum amount is IDR ${APP_CONFIG.minRedeemAmount.toLocaleString()}` });
      return;
    }

    const amountNum = parseFloat(amount);
    const pointsNeeded = Math.ceil(amountNum / APP_CONFIG.pointsToIDR);

    if (pointsNeeded > user.points) {
      setAlert({ type: 'error', message: 'Insufficient points' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const transaction = {
        id: Date.now().toString(),
        userId: user.id,
        rewardId: selectedReward.id,
        rewardName: selectedReward.name,
        amount: amountNum,
        pointsUsed: pointsNeeded,
        status: 'completed',
        createdAt: new Date().toISOString()
      };

      dbOperations.addTransaction(transaction);
      updateUserPoints(-pointsNeeded);

      setAlert({ 
        type: 'success', 
        message: `Successfully redeemed IDR ${amountNum.toLocaleString()} to ${selectedReward.name}!` 
      });

      setSelectedReward(null);
      setAmount('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container fade-in">
      <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
        🎁 Redeem Rewards
      </h1>

      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#38a169', marginBottom: '0.5rem' }}>Your Current Balance</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#38a169' }}>
            {user.points.toLocaleString()} Points
          </div>
          <p style={{ color: '#666' }}>≈ IDR {(user.points * APP_CONFIG.pointsToIDR).toLocaleString()}</p>
        </div>
      </div>

      <div className="reward-cards">
        {rewardOptions.map(reward => {
          const canRedeem = user.points >= reward.minPoints;
          return (
            <div key={reward.id} className="reward-card">
              <div className="reward-header">
                <div className={`reward-logo ${reward.id}-logo`}>
                  {reward.logo}
                </div>
                <div>
                  <h3 style={{ color: '#2d3748' }}>{reward.name}</h3>
                  <p style={{ color: '#666', margin: 0 }}>
                    Min. {reward.minPoints.toLocaleString()} points
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {reward.description}
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Exchange rate: {reward.rate} points = IDR {APP_CONFIG.pointsToIDR * reward.rate}.toLocaleString()
                </p>
              </div>

              <button 
                className={`btn ${canRedeem ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%' }}
                onClick={() => handleRedeem(reward)}
                disabled={!canRedeem}
              >
                {canRedeem ? '💎 Redeem Now' : '🔒 Not Enough Points'}
              </button>
            </div>
          );
        })}
      </div>

      {selectedReward && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '400px', margin: '1rem' }}>
            <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>
              Redeem {selectedReward.name}
            </h3>

            <div className="form-group">
              <label htmlFor="amount">Amount (IDR)</label>
              <input
                type="number"
                id="amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={APP_CONFIG.minRedeemAmount}
                step="1000"
                placeholder={APP_CONFIG.minRedeemAmount.toString()}
              />
            </div>

            {amount && (
              <div style={{ 
                background: '#f7fafc', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Amount:</strong> IDR {parseFloat(amount || 0).toLocaleString()}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Points needed:</strong> {Math.ceil(parseFloat(amount || 0) / APP_CONFIG.pointsToIDR)}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Remaining:</strong> {user.points - Math.ceil(parseFloat(amount || 0) / APP_CONFIG.pointsToIDR)} points
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedReward(null)}
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={confirmRedeem}
                style={{ flex: 1 }}
                disabled={isLoading || !amount}
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;