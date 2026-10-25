import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import '../Styles/Trash.css';
import logo from '../Assets/Current.png';
import { supabaseChat } from '../Utils/supabaseGroupChat';

const EarningDashboard = () => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('trust_balance');
    return saved ? parseInt(saved) : 0;
  });

  const [activeTask, setActiveTask] = useState(() => {
    const saved = localStorage.getItem('trust_activeTask');
    return saved ? JSON.parse(saved) : null;
  });

  const [isTaskCompletedToday, setIsTaskCompletedToday] = useState(() => {
    const saved = localStorage.getItem('trust_isTaskCompletedToday');
    return saved === 'true';
  });

  const [showFeedback, setShowFeedback] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  // 1. Professional Game Feed Data
  const gameFeed = [
    { id: 1, title: "Stickman", reward: 30, time: 30, icon: "🎲", difficulty: "Easy" },
    { id: 2, title: "Gun Master", reward: 50, time: 45, icon: "🏏", difficulty: "Medium" },
    { id: 3, title: "Bubble Shooter Rush", reward: 20, time: 20, icon: "🧼", difficulty: "Easy" },
    { id: 4, title: "Cyber Strike Quest", reward: 100, time: 60, icon: "🔫", difficulty: "Hard" },
  ];
// Dummy function (replace with backend API call)
const creditUserReward = async (userId, amount) => {
  console.log(`Credit ${amount} to user ${userId}`);
};
  useEffect(() => {
    const hasResponded = localStorage.getItem('trust_feedback_submitted');
    if (!hasResponded) setShowFeedback(true);
  }, []);
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

              // ?? IMPORTANT: Replace with your backend logic
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

  // 3. Open Offerwall
  const openOfferWall = () => {
    if (window.gigaOfferWallSDK) {
      window.gigaOfferWallSDK.open();
    } else {
      alert("Offerwall not loaded yet");
    }
  };

  // 2. Data Persistence
  useEffect(() => {
    localStorage.setItem('trust_balance', balance);
    localStorage.setItem('trust_isTaskCompletedToday', isTaskCompletedToday);
    if (activeTask) localStorage.setItem('trust_activeTask', JSON.stringify(activeTask));
  }, [balance, isTaskCompletedToday, activeTask]);

  const handleSelectGame = (game) => {
    setActiveTask(game);
    toast.success(`Task Started: ${game.title}`);
  };

  const handleCompleteTask = () => {
    if (!activeTask) return;
    
    // Simulate verification
    const toastId = toast.loading('Verifying gameplay duration...');
    
    setTimeout(() => {
      setBalance(prev => prev + activeTask.reward);
      setIsTaskCompletedToday(true);
      toast.success(`Success! ₹${activeTask.reward} added.`, { id: toastId });
    }, 2000);
  };

  const checkWithdrawal = () => {
    if (balance < 5000) {
      setAlertMessage('Minimum payout is ₹5,000. Continue completing tasks to reach your goal!');
    }
  };

  return (
    <div className="dashboard-app">
      <header className="header-section">
        <img src={logo} alt="Trusted Earning" className="game-logo" />
        <div className="stats-badge">
          {isTaskCompletedToday ? 'Daily Limit Reached' : 'Active Status: Ready'}
        </div>
      </header>

      {/* Wallet Section */}
      <section className="wallet-card">
        <p className="wallet-label">Available Balance</p>
        <div className="balance-display">₹{balance.toLocaleString()}</div>
        <div className="withdraw-info">Withdrawal available via UPI / Amazon Pay</div>
        <button className="btn-withdraw" onClick={checkWithdrawal}>Withdraw Funds</button>
      </section>

      {/* Main Task Area */}
      <section className="roadmap-section">
        <h4 className="section-title">
          {isTaskCompletedToday ? 'Excellent Work!' : activeTask ? 'Current Active Mission' : 'Select a Game to Earn'}
        </h4>

        {isTaskCompletedToday ? (
          <div className="completed-card animate-pop-in">
            <div className="completed-icon">🏆</div>
            <h3>Task Finished</h3>
            <p>Your daily rewards have been credited.</p>
            <div className="status-badge-glow">Next Games Available in 12h</div>
          </div>
        ) : activeTask ? (
          <div className="active-task-container animate-pop-in">
            <div className="task-header">
              <span className="task-icon">{activeTask.icon}</span>
              <div>
                <h3>{activeTask.title}</h3>
                <p>Objective: Play for {activeTask.time} minutes</p>
              </div>
            </div>
            <div className="reward-tag">Potential Reward: ₹{activeTask.reward}</div>
            <button className="btn-primary-action" onClick={handleCompleteTask}>
              Launch Game Now
            </button>
            <button className="btn-cancel-small" onClick={() => setActiveTask(null)}>Choose different game</button>
          </div>
        ) : (
          <div className="game-feed-grid">
            {gameFeed.map((game) => (
              <div key={game.id} className="game-card" onClick={() => handleSelectGame(game)}>
                <div className="game-card-top">
                  <span className="game-card-icon">{game.icon}</span>
                  <span className={`difficulty-label ${game.difficulty.toLowerCase()}`}>{game.difficulty}</span>
                </div>
                <h4>{game.title}</h4>
                <div className="game-card-footer">
                  <span>⏱️ {game.time}m</span>
                  <span className="reward-text">₹{game.reward}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Alerts & Modals */}
      {alertMessage && (
        <div className="alert-overlay">
          <div className="alert-card">
            <div className="alert-icon">🔒</div>
            <h3>Withdrawal Locked</h3>
            <p>{alertMessage}</p>
            <button className="btn-confirm" onClick={() => setAlertMessage(null)}>Understand</button>
          </div>
        </div>
      )}

      <Toaster position="bottom-center" />
    </div>
  );
};

export default EarningDashboard;