import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>{message}</p>
      </div>
    </div>
  );
};

export default Loading;
