import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Alert from '../ui/Alert';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    if (formData.password.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    if (!formData.name.trim()) {
      setAlert({ type: 'error', message: 'Name is required' });
      return;
    }

    if (!formData.phone.trim()) {
      setAlert({ type: 'error', message: 'Phone number is required' });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        setAlert({ 
          type: 'success', 
          message: result.message || 'Registration successful! Please check your email to verify your account.' 
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: ''
        });
      } else {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Registration failed. Please try again.' });
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
      <div className="card fade-in" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#38a169' }}>
          🌱 Join EcoPoints
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
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="08123456789"
            />
            <small style={{ color: '#666' }}>
              Required for e-wallet redemptions
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              minLength={6}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Confirm your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p>Already have an account?</p>
          <button 
            className="btn btn-secondary" 
            onClick={onSwitchToLogin}
            style={{ marginTop: '0.5rem' }}
            disabled={isLoading}
          >
            🔑 Login
          </button>
        </div>

        {/* Registration Benefits */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f0fff4', 
          borderRadius: '8px',
          border: '1px solid #38a169'
        }}>
          <h4 style={{ color: '#2f855a', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            🎁 Join EcoPoints and Get:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#2f855a', fontSize: '0.8rem' }}>
            <li>Earn points for every waste deposit</li>
            <li>Exchange points for e-wallet credits</li>
            <li>Track your environmental impact</li>
            <li>Contribute to a cleaner planet</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;