import React from 'react';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { user, logout } = useApp();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span>🌱</span>
          EcoPoints
        </div>
        {user && (
          <div className="nav-buttons">
            <div className="user-info">
              <span>Welcome, {user.name}</span>
              <div className="points-display">
                ⭐ {user.points.toLocaleString()} Points
              </div>
            </div>
            <button className="btn btn-danger" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;