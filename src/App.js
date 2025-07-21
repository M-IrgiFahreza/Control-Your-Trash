import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Deposit from './components/Deposit';
import Rewards from './components/Rewards';
import History from './components/History';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Loading from './components/ui/Loading';
// Import Admin Dashboard yang baru
import AdminDashboard from './components/admin/AdminDashboard';
import './styles/App.css';

const App = () => {
  const { user, isLoading } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="app">
        <Header />
        {authMode === 'login' ? (
          <Login onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  // ===== ADMIN INTERFACE =====
  if (user.role === 'admin') {
    return (
      <div className="app">
        <Header />
        <AdminDashboard />
      </div>
    );
  }

  // ===== USER INTERFACE (original) =====
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'deposit':
        return <Deposit />;
      case 'rewards':
        return <Rewards />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Header />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

export default App;