import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/RewardPlatform.css';

const RewardPlatform = () => {
  const navigate = useNavigate();

  const creditUserReward = async (userId, amount) => {
    console.log(`Credit ₹${amount} to user ${userId}`);
  };

  useEffect(() => {
    // 1. Load SDK
    if (!window.loadOfferWallSDK) {
      const script = document.createElement("script");
      script.src = "https://wall.giga.pub/api/v1/loader.js?projectId=6133";
      script.async = true;
      document.head.appendChild(script);
    }

    // 2. Initialize SDK
    (window.loadGigaSDKCallbacks || (window.loadGigaSDKCallbacks = [])).push(
      () => {
        window.loadOfferWallSDK({
          projectId: "6133",
        })
          .then((sdk) => {
            window.gigaOfferWallSDK = sdk;

            // Listen for reward
            sdk.on("rewardClaim", async (data) => {
              console.log("Reward claim received:", data);
              await creditUserReward(data.userId, data.amount);
              sdk.confirmReward(data.rewardId, data.hash);
            });
          })
          .catch((error) => {
            console.error("Error loading SDK:", error);
          });
      }
    );
  }, []);

  const openOfferWall = () => {
    if (window.gigaOfferWallSDK) {
      window.gigaOfferWallSDK.open();
    } else {
      alert("Loading games... please wait.");
    }
  };

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">TRUSTED<span>EARNING</span></div>
        <button className="cta-nav" onClick={() => navigate('/dashboard')}>Check Balance</button>
      </nav>

      <header className="hero">
        <div className="badge">No Sign-up Required</div>
        <div className="badge">🇮🇳 India's Most Trusted Gaming Rewards</div>
        <h1>Play. Earn. <span className="highlight">Withdraw.</span></h1>
        <p>Join thousands of Indian gamers earning daily rewards. Play simple games as a guest and watch your earnings grow.</p>
        
        <div className="hero-btns">
          <button className="btn-primary" onClick={openOfferWall}>Play & Earn Now</button>
          <button className="btn-outline" onClick={() => navigate('/dashboard')}>View Dashboard</button>
        </div>
        
        <div className="trust-note">
          <small>⚡️ Real-time coin tracking. Instant UPI withdrawals available.</small>
        </div>
      </header>

      <section className="guest-flow">
        <h2>How Game Earning Works</h2>
        <div className="flow-grid">
          <div className="flow-item">
            <div className="icon">🎮</div>
            <h4>1. Play</h4>
            <p>Select from hundreds of fun games. No downloads required.</p>
          </div>
          <div className="flow-item">
            <div className="icon">💰</div>
            <h4>2. Win</h4>
            <p>Earn coins for every level reached and milestone achieved.</p>
          </div>
          <div className="flow-item">
            <div className="icon">🏦</div>
            <h4>3. Cash Out</h4>
            <p>Convert your coins into real cash and withdraw via UPI instantly.</p>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="stat-item"><h3>50K+</h3><p>Gamers Online</p></div>
        <div className="stat-item"><h3>₹10L+</h3><p>Total Payouts</p></div>
        <div className="stat-item"><h3>4.8/5</h3><p>Platform Rating</p></div>
      </section>

      <section className="testimonials" style={{ marginTop: '3rem' }}>
        <h2>What Our Gamers Say</h2>
        <div className="testimonial-track">
          <div className="t-card">
            <p>"The best way to earn during my free time. The games are actually fun!"</p>
            <h4>— Rahul S., Mumbai</h4>
          </div>
          <div className="t-card">
            <p>"Professional platform. I play for an hour daily and withdraw directly to UPI."</p>
            <h4>— Priya M., Bangalore</h4>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Trusted Earning India • Made with ❤️ for Indian Gamers</p>
      </footer>
    </div>
  );
};

export default RewardPlatform;