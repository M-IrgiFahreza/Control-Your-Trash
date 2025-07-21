import React from 'react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'deposit', label: 'Deposit', icon: '♻️' },
    { id: 'rewards', label: 'Rewards', icon: '🎁' },
    { id: 'history', label: 'History', icon: '📊' }
  ];

  return (
    <nav className="nav">
      <div className="container">
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-tab ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;