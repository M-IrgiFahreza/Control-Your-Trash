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

    if (!formData.email.trim()) {
      setAlert({ type: 'error', message: 'Email is required' });
      return;
    }

    if (!formData.phone.trim()) {
      setAlert({ type: 'error', message: 'Phone is required' });
      return;
    }

    setIsLoading(true);

    try {
      // Call register function from AppContext
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim()
      });

      if (result.success) {
        setAlert({ type: 'success', message: 'Registration successful! Welcome to EcoPoints!' });
        // User akan otomatis login via AppContext
      } else {
        setAlert({ type: 'error', message: result.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAlert({ type: 'error', message: 'Network error. Please check if backend is running.' });
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

  // Test connection button
  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      if (data.message) {
        setAlert({ type: 'success', message: '✅ Backend connected successfully!' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: '❌ Backend not accessible. Please check if server is running.' });
    }
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
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              placeholder="08123456789"
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
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
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
            {isLoading ? 'Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        {/* Debug Panel */}
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
            🔧 Debug: Test backend connection
          </p>
          <button 
            type="button"
            onClick={testConnection}
            style={{
              background: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              width: '100%'
            }}
          >
            🧪 Test Backend Connection
          </button>
        </div>

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
      </div>
    </div>
  );
};

export default Register;