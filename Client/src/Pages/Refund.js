import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/refund.css';

const Refund = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleRefundSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="insta-container">
      <div className="demo-card" style={{ minHeight: '550px' }}>
        {/* --- Header --- */}
        <div style={{ marginBottom: '20px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>←</button>
          <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Refund Portal</h1>
        </div>

        {!submitted ? (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ fontSize: '3rem' }}>💸</div>
              <h2 style={{ fontSize: '1.1rem', color: '#333' }}>100% Satisfaction Guaranteed</h2>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Not happy with the result? No problem. We process all refunds within 24 hours.
              </p>
            </div>

            <form onSubmit={handleRefundSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#999', marginLeft: '5px' }}>Your Email</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. john@gmail.com" 
                  className="input-field" 
                  style={{ marginTop: '5px' }}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#999', marginLeft: '5px' }}>REASON FOR REFUND</label>
                <select className="input-field" style={{ marginTop: '5px', background: '#fff' }}>
                  <option>Didn't get what expected</option>
                  <option>Changed my mind</option>
                  <option>Technical error</option>
                  <option>Other</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px', background: '#000' }}>
                Claim Instant Refund
              </button>
            </form>

           {/* <div style={{ marginTop: '30px', padding: '15px', borderRadius: '10px', background: '#f8f9fa', border: '1px dashed #ccc' }}>
              <p style={{ fontSize: '0.7rem', color: '#777', margin: 0, lineHeight: '1.4' }}>
                Note: Once a refund is initiated, your position in the queue will be permanently deleted and access will be revoked.
              </p>
            </div>*/}
          </div>
        ) : (
          <div className="fade-in" style={{ textAlign: 'center', marginTop: '50px' }}>
            <div className="success-icon" style={{ fontSize: '4rem' }}>✅</div>
            <h2 style={{ color: '#2ecc71' }}>Request Received</h2>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Your refund for <strong>$1.00</strong> is being processed.<br />
              Ref ID: <strong>#IV-{Math.floor(Math.random() * 90000) + 10000}</strong>
            </p>
            <div style={{ margin: '20px auto', width: '100%', height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
              <div className="progress-bar-fill" style={{ width: '40%', background: '#2ecc71' }}></div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#999' }}>Status: Verifying Transaction...</p>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '30px' }}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Refund;