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

    setTimeout(() => {
      const result = login(formData.email, formData.password);
      if (!result.success) {
        setAlert({ type: 'error', message: result.message });
      }
      setIsLoading(false);
    }, 500);
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
          >
            📝 Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;