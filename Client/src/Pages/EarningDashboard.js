import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/game-logo.png'
import '../Styles/EarningDashboard.css';

const EarningDashboard = () => {
  const [balance, setBalance] = useState(2450.50);
  const [showPopup, setShowPopup] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const navigate = useNavigate();

  const WITHDRAWAL_LIMIT = 30000;

  const handleWithdraw = () => {
    if (balance < WITHDRAWAL_LIMIT) {
      setShowPopup(true);
    } else {
      alert("Processing your withdrawal...");
    }
  };

  const activities = [
    { id: 1, task: "Level 10 reached", amount: "+ ₹50", time: "2m ago", type: "game" },
    { id: 2, task: "Daily Check-in", amount: "+ ₹10", time: "1h ago", type: "bonus" },
    { id: 3, task: "Friend joined", amount: "+ ₹100", time: "3h ago", type: "referral" },
  ];

  // Screen Redirection Logic
  if (gameStarted) {
    return (
      <div className="holographic-shell game-view">
        <div className="main-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
          <button className="btn-close" style={{ marginBottom: '20px' }} onClick={() => setGameStarted(false)}>
            ← Back to Home
          </button>
          <div className="game-container" style={{ background: '#1a1a2e', borderRadius: '20px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #4d4dff' }}>
            <h2 style={{ color: '#fff' }}>Game Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="holographic-shell">
      <div className="shape sphere-1"></div>
      <div className="shape sphere-2"></div>

      <div className="main-content">
        {/* Balance Card */}
        <section className="balance-card">
          <p>Current Balance</p>
          <h2>₹{balance}</h2>
          <div className="card-actions">
            <button className="btn-primary" onClick={handleWithdraw}>Withdraw Funds</button>
          </div>
        </section>

        {/* --- SEPARATE GAME SECTION --- */}
        <h3 className="section-title">Play & Earn</h3>
        <section className="game-promo-card" onClick={() => navigate('/game')} style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: '25px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
        }}>
          <div className="promo-info">
            <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>Game</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '5px 0' }}>Earn by playing Morning Sprint game.</p>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: '10px' }}>Play Now</button>
          </div>
          <div className="promo-image">
             <img 
               src={logo}
               alt="Game Icon" 
               style={{ width: '110px', height: '80px', filter: 'drop-shadow(2px 4px 6px black)' }} 
             />
          </div>
        </section>
        {/* --------------------------- */}

        <h3 className="section-title">Boost Your Earnings</h3>
        <div className="action-grid">
          <button className="action-tile telegram">
            <span className="tile-icon">✈️</span>
            <div className="tile-text">
              <span className="tile-label">Join Telegram</span>
              <span className="tile-sub">+ ₹500</span>
            </div>
          </button>

          <button className="action-tile invite">
            <span className="tile-icon">👋</span>
            <div className="tile-text">
              <span className="tile-label">Invite Friends</span>
              <span className="tile-sub">+ ₹2,500</span>
            </div>
          </button>
        </div>

        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-list">
          {activities.map(item => (
            <div key={item.id} className="activity-item">
              <div className={`icon-circle ${item.type}`}>
                {item.type === 'game' ? '🎮' : '💎'}
              </div>
              <div className="activity-info">
                <h4>{item.task}</h4>
                <p>{item.time}</p>
              </div>
              <div className="activity-amt">{item.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className="modal-overlay">
          <div className="popup-card">
            <div className="popup-icon">⚠️</div>
            <h3>Minimum Limit Not Reached</h3>
            <p>To ensure platform security, withdrawals can only be processed once you earn <strong>₹{WITHDRAWAL_LIMIT.toLocaleString()}</strong>.</p>
            <div className="progress-container">
               <div className="progress-bar" style={{ width: `${(balance / WITHDRAWAL_LIMIT) * 100}%` }}></div>
            </div>
            <p className="progress-text">You need ₹{(WITHDRAWAL_LIMIT - balance).toLocaleString()} more</p>
            <button className="btn-close" onClick={() => setShowPopup(false)}>Keep Earning</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningDashboard;