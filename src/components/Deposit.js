import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbOperations } from '../utils/database';
import { wasteTypes, APP_CONFIG } from '../utils/config';
import Alert from './ui/Alert';

const Deposit = () => {
  const { user, updateUserPoints } = useApp();
  const [selectedType, setSelectedType] = useState(null);
  const [weight, setWeight] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file) {
      // Validate file type
      if (!APP_CONFIG.allowedFileTypes.includes(file.type)) {
        setAlert({ type: 'error', message: 'Please upload a valid image file (JPEG, PNG, WebP)' });
        return;
      }

      // Validate file size
      if (file.size > APP_CONFIG.maxFileSize) {
        setAlert({ type: 'error', message: 'File size must be less than 5MB' });
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedType || !weight || !photo) {
      setAlert({ type: 'error', message: 'Please fill in all fields and upload a photo' });
      return;
    }

    const weightNum = parseFloat(weight);
    if (weightNum <= 0 || weightNum > 100) {
      setAlert({ type: 'error', message: 'Weight must be between 0.1kg and 100kg' });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const points = Math.round(weightNum * selectedType.pointsPerKg);
      
      const deposit = {
        id: Date.now().toString(),
        userId: user.id,
        type: selectedType.id,
        typeName: selectedType.name,
        weight: weightNum,
        points,
        photo: photoPreview,
        createdAt: new Date().toISOString()
      };

      dbOperations.addDeposit(deposit);
      updateUserPoints(points);
      
      setAlert({ type: 'success', message: `Deposit successful! You earned ${points} points.` });
      
      // Reset form
      setSelectedType(null);
      setWeight('');
      setPhoto(null);
      setPhotoPreview(null);
      setIsLoading(false);
    }, 1000);
  };

  const calculatedPoints = selectedType && weight ? 
    Math.round(parseFloat(weight || 0) * selectedType.pointsPerKg) : 0;

  return (
    <div className="container fade-in">
      <h1 style={{ marginBottom: '2rem', color: '#38a169' }}>
        ♻️ Deposit Waste
      </h1>

      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>Select Waste Type</h3>
          <div className="waste-types">
            {wasteTypes.map(type => (
              <div
                key={type.id}
                className={`waste-type-card ${selectedType?.id === type.id ? 'selected' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                <span className="waste-icon">{type.icon}</span>
                <div className="waste-name">{type.name}</div>
                <div className="waste-points">{type.pointsPerKg} pts/kg</div>
              </div>
            ))}
          </div>
          {selectedType && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: '#f0fff4', 
              borderRadius: '8px',
              border: '1px solid #38a169'
            }}>
              <p style={{ margin: 0, color: '#2f855a' }}>
                <strong>{selectedType.name}</strong>: {selectedType.description}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>Upload Photo</h3>
            <div 
              className="file-upload-area"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="preview-image" />
              ) : (
                <>
                  <div className="upload-icon">📷</div>
                  <p>Click or drag to upload waste photo</p>
                  <small style={{ color: '#666' }}>
                    Supported: JPEG, PNG, WebP (max 5MB)
                  </small>
                </>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="card">
            <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>Weight & Points</h3>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                className="form-control"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
                min="0.1"
                max="100"
                placeholder="0.0"
              />
            </div>
            
            {selectedType && weight && (
              <div style={{ 
                background: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                marginTop: '1rem'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>
                  {calculatedPoints} Points
                </div>
                <div style={{ color: '#666' }}>
                  {weight}kg × {selectedType.pointsPerKg} pts/kg
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  ≈ IDR {(calculatedPoints * APP_CONFIG.pointsToIDR).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            disabled={isLoading || !selectedType || !weight || !photo}
          >
            {isLoading ? 'Processing...' : `🎯 Deposit & Earn ${calculatedPoints} Points`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Deposit;