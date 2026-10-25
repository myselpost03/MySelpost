import React from 'react';
import '../Styles/StarModal.css';

const StarModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="star-modal-overlay">
      <div className="star-modal-card">
        <div className="star-modal-icon">⭐</div>
        <h2 className="star-modal-title">Unlock Image Sending</h2>
        <p className="star-modal-text">Pay <strong>10 Stars</strong> to enable unlimited image sharing for this session.</p>
        
        <div className="star-modal-actions">
          <button className="star-modal-btn star-modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="star-modal-btn star-modal-btn-confirm" onClick={onConfirm}>
            Pay & Unlock
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarModal;