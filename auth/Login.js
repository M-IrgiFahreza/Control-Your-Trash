import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Alert from '../ui/Alert';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container">
      <div className="card fade-in" style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#38a169' }}>
          🌱 Login to EcoPoints
        </h2>
        
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)} 
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : '🔑 Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p>Don't have an account?</p>
          <button 
            className="btn btn-secondary" 
            onClick={onSwitchToRegister}
            style={{ marginTop: '0.5rem' }}
            disabled={isLoading}
          >
            📝 Create Account
          </button>
        </div>

        {/* Demo Accounts */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f0fff4', 
          borderRadius: '8px',
          border: '1px solid #38a169'
        }}>
          <h4 style={{ color: '#2f855a', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            🚀 Demo Accounts
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#2f855a' }}>
            <div><strong>Admin:</strong> admin@ecopoints.com / admin123</div>
            <div><strong>User:</strong> user@ecopoints.com / user123</div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.5rem 0 0 0' }}>
            Use these credentials to test the system
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;