import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient';

const GAMES_LIST = [
  {
    id: 'ludo',
    title: 'Ludo with Friends',
    embedUrl: 'https://zv1y2i8p.play.gamezop.com/g/SkhljT2fdgb',
  },
  {
    id: 'blazingblades',
    title: 'Blazing Blades',
    embedUrl: 'https://zv1y2i8p.play.gamezop.com/g/UYiznUAya',
  },
  {
    id: 'bottleshoot',
    title: 'Bottle Shoot',
    embedUrl: 'https://zv1y2i8p.play.gamezop.com/g/B1fSpMkP51m',
  },
  {
    id: 'citycricket',
    title: 'City Cricket',
    embedUrl: 'https://zv1y2i8p.play.gamezop.com/g/HJP4afkvqJQ',
  },
  {
    id: 'fruitchop',
    title: 'Fruit Chop',
    embedUrl: 'https://zv1y2i8p.play.gamezop.com/g/rkWfy2pXq0r',
  },
  {
    id: 'trickytrip',
    title: 'Tricky Trip',
    embedUrl: 'https://zv1y2i8p.play.gamezop.com/g/NJ3xGOyfb5l',
  },
  {
    id: 'pumpkinsmasher',
    title: 'Pumpkin Smasher',
    embedUrl: 'https://zv1y2i8p.play.gamezop.com/g/rJXlRtBWd4',
  },
];

export default function Demo() {
  const [activeGame, setActiveGame] = useState(null);
  const [coins, setCoins] = useState(0); // Starts with 0 coins
  const navigate = useNavigate();
  const gameWrapperRef = useRef(null);

  // Modal State for Coin Purchase / Watch Ad Popup
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const [selectedGameToActivate, setSelectedGameToActivate] = useState(null);

  // User & Streak Tracking States
  const [userId, setUserId] = useState('');
  const [streakDays, setStreakDays] = useState(0);
  const [todayGames, setTodayGames] = useState(0);
  const [playedGamesToday, setPlayedGamesToday] = useState([]);
  const [isStreakPending, setIsStreakPending] = useState(false);
  const [isFullyUnlocked, setIsFullyUnlocked] = useState(false);
  const [loadingStreak, setLoadingStreak] = useState(true);

  // Cooldown & 30-Second Session Tracking
  const gameStartTimeRef = useRef(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [cooldownMessage, setCooldownMessage] = useState('');

  // Initialize User ID and Load Streak Progress from Supabase
  useEffect(() => {
    let id = '';
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      id = String(window.Telegram.WebApp.initDataUnsafe.user.id);
    } else {
      id = localStorage.getItem('app_user_uuid');
      if (!id) {
        id = 'user_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('app_user_uuid', id);
      }
    }
    setUserId(id);
    fetchStreakData(id);
  }, []);

  // Cooldown timer interval countdown
  useEffect(() => {
    let timer;
    if (cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            setCooldownMessage('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const fetchStreakData = async (id) => {
    try {
      const { data } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', id)
        .single();

      if (data) {
        const lastActive = data.last_active_date
          ? new Date(data.last_active_date)
          : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let currentStreak = data.streak_days || 0;
        let gamesToday = data.today_games || 0;
        let pending = false;

        if (lastActive) {
          lastActive.setHours(0, 0, 0, 0);
          const diffDays = Math.floor(
            (today - lastActive) / (1000 * 60 * 60 * 24),
          );

          if (diffDays > 1 && currentStreak < 15) {
            pending = true;
          } else if (diffDays === 1 && gamesToday < 7) {
            pending = true;
          }
        }

        setStreakDays(currentStreak);
        setTodayGames(gamesToday);
        setIsStreakPending(pending);
        if (currentStreak >= 15) {
          setIsFullyUnlocked(true);
        }
      }
    } catch (err) {
      console.log('No streak record found, initializing default.');
    } finally {
      setLoadingStreak(false);
    }
  };

  // Helper: Evaluates if current game session reached 30 seconds
  const evaluateAndSaveGameSession = async (gameId) => {
    if (!gameStartTimeRef.current) return true;

    const elapsedMs = Date.now() - gameStartTimeRef.current;
    const elapsedSeconds = elapsedMs / 1000;

    if (elapsedSeconds < 30) {
      setCooldownSeconds(60);
      setCooldownMessage(
        '⚠️ Please play for at least 30 seconds. Now wait 1 minute before playing the game.',
      );
      return false;
    }

    if (playedGamesToday.includes(gameId)) return true;

    const updatedPlayed = [...playedGamesToday, gameId];
    setPlayedGamesToday(updatedPlayed);

    const newTodayGames = Math.min(todayGames + 1, 7);
    setTodayGames(newTodayGames);

    let newStreakDays = streakDays;
    if (newTodayGames >= 7 && todayGames < 7) {
      newStreakDays = Math.min(streakDays + 1, 15);
      setStreakDays(newStreakDays);
      if (newStreakDays >= 15) {
        setIsFullyUnlocked(true);
      }
    }

    setIsStreakPending(false);

    try {
      await supabase.from('user_streaks').upsert(
        [
          {
            user_id: userId,
            unlock_type: 'free',
            streak_days: newStreakDays,
            today_games: newTodayGames,
            last_active_date: new Date().toISOString(),
            completed: newStreakDays >= 15,
          },
        ],
        { onConflict: 'user_id' },
      );
    } catch (err) {
      console.error('Error saving progress:', err);
    }

    return true;
  };

  // Handle clicking a game from sidebar
  const handleSelectGameClick = async (game) => {
    if (cooldownSeconds > 0) return;
    if (activeGame?.id === game.id) return;

    if (activeGame) {
      const success = await evaluateAndSaveGameSession(activeGame.id);
      if (!success) {
        setActiveGame(null);
        gameStartTimeRef.current = null;
        return;
      }
    }

    // Check if user already played this game today (no activation fee needed if already completed today)
    if (playedGamesToday.includes(game.id)) {
      setActiveGame(game);
      gameStartTimeRef.current = Date.now();
      return;
    }

    // Check if user has at least 50 coins to activate the game
    if (coins < 50) {
      setSelectedGameToActivate(game);
      setShowCoinPopup(true);
      return;
    }

    // Deduct 50 coins and activate game
    setCoins((prev) => prev - 50);
    setActiveGame(game);
    gameStartTimeRef.current = Date.now();
  };

  // Watch Ad rewards 50 coins and immediately activates game if waiting
  const handleWatchAd = () => {
    setCoins((prev) => prev + 50);
    if (selectedGameToActivate) {
      setShowCoinPopup(false);
      // Automatically deduct 50 coins and launch game
      setCoins((prev) => prev - 50);
      setActiveGame(selectedGameToActivate);
      gameStartTimeRef.current = Date.now();
      setSelectedGameToActivate(null);
    }
  };

  // Purchase coins adds 50 coins (or more) and activates game
  const handlePurchaseCoins = () => {
    setCoins((prev) => prev + 50);
    if (selectedGameToActivate) {
      setShowCoinPopup(false);
      setCoins((prev) => prev - 50);
      setActiveGame(selectedGameToActivate);
      gameStartTimeRef.current = Date.now();
      setSelectedGameToActivate(null);
    }
  };

  const handleExitGame = async () => {
    if (!activeGame) return;

    await evaluateAndSaveGameSession(activeGame.id);

    setActiveGame(null);
    gameStartTimeRef.current = null;
  };

  const toggleFullScreen = () => {
    const elem = gameWrapperRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  return (
    <div style={styles.appContainer}>
      <style>{`
        body {
          background-color: #0b0f19;
          margin: 0;
          color: #f8fafc;
        }
        .custom-game-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-game-scroll::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 4px;
        }
        .custom-game-scroll::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        .custom-game-scroll::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .welcome-icon-glow {
          animation: pulseGlow 3s infinite ease-in-out;
        }
      `}</style>

      {/* Header Bar */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => navigate('/')} style={styles.backBtn}>
            ← Back to Queue
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            style={{
              ...styles.badge,
              backgroundColor: isStreakPending ? '#7f1d1d' : '#064e3b',
              borderColor: isStreakPending ? '#f87171' : '#34d399',
            }}
          >
            <span
              style={{
                fontWeight: '700',
                color: isStreakPending ? '#fca5a5' : '#6ee7b7',
                fontSize: '0.85rem',
              }}
            >
              🔥 Streak: {streakDays}/15 Days{' '}
              {isStreakPending ? '(Pending)' : ''}
            </span>
          </div>
        </div>
      </header>

      {cooldownSeconds > 0 && (
        <div style={styles.cooldownBanner}>
          <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>
            {cooldownMessage}
          </span>
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: '800',
              color: '#f87171',
              marginTop: '4px',
            }}
          >
            Play in: 00:
            {cooldownSeconds < 10 ? `0${cooldownSeconds}` : cooldownSeconds}
          </div>
        </div>
      )}

      <div style={styles.progressBanner}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span
            style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f1f5f9' }}
          >
            Play 7 Games — ({todayGames}/7 completed)
          </span>
          <span
            style={{
              whiteSpace: 'nowrap',
              fontSize: '0.9rem',
              color: todayGames >= 7 ? '#34d399' : '#fbbf24',
              fontWeight: 'bold',
            }}
          >
            {todayGames >= 7 ? '✅ Today’s Goal Met!' : '⏳ In Progress'}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#334155',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(todayGames / 7) * 100}%`,
              height: '100%',
              backgroundColor: '#6366f1',
              transition: 'width 0.3s ease',
            }}
          ></div>
        </div>
      </div>

      {isFullyUnlocked && (
        <div style={styles.unlockSuccessBox}>
          <h3
            style={{
              margin: '0 0 6px 0',
              color: '#065f46',
              fontSize: '1.2rem',
            }}
          >
            🎉 Congratulations! 15-Day Streak Completed!
          </h3>
          <p
            style={{
              margin: '0 0 12px 0',
              color: '#047857',
              fontSize: '0.95rem',
            }}
          >
            You have successfully finished all tasks for 15 days. Your profile
            is now fully unlocked.
          </p>
          <button onClick={() => navigate('/')} style={styles.unlockNowBtn}>
            🚀 View Unlocked Profile Now
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <div style={styles.mainLayout}>
        {/* Game Selector Sidebar - Hidden when a game is active */}
        {!activeGame && (
          <nav style={styles.gameSelector}>
            <h3 style={styles.selectorTitle}>Select Game (Costs 50 Coins)</h3>
            <div className="custom-game-scroll" style={styles.buttonList}>
              {GAMES_LIST.map((game) => {
                const playedToday = playedGamesToday.includes(game.id);
                return (
                  <button
                    key={game.id}
                    onClick={() => handleSelectGameClick(game)}
                    disabled={cooldownSeconds > 0}
                    style={{
                      ...styles.gameButton,
                      backgroundColor: playedToday ? '#064e3b' : '#1e293b',
                      color: '#ffffff',
                      fontWeight: playedToday ? '700' : '500',
                      border: playedToday
                        ? '1px solid #34d399'
                        : '1px solid #334155',
                      opacity: cooldownSeconds > 0 ? 0.6 : 1,
                      cursor: cooldownSeconds > 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <span>{game.title}</span>
                    {playedToday && (
                      <span
                        style={{
                          color: '#34d399',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓ Played
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Game Area - Expands to full width when sidebar is hidden */}
        <main
          style={{
            ...styles.gameContainer,
            maxWidth: activeGame ? '100%' : '820px',
          }}
        >
          <div style={styles.gameHeaderRow}>
            <h2 style={styles.gameTitle}>
              {activeGame ? activeGame.title : 'Ready to Play & Build Streak?'}
            </h2>

            {activeGame && (
              <div style={styles.actionButtons}>
                <button
                  onClick={handleExitGame}
                  style={styles.exitBtn}
                  title="Exit Game & Save Progress"
                >
                  <span>Exit & Save</span>
                </button>
                <button
                  onClick={toggleFullScreen}
                  style={styles.fullscreenBtn}
                  title="Full Screen"
                >
                  <span>Full Screen</span>
                </button>
              </div>
            )}
          </div>

          <div ref={gameWrapperRef} style={styles.iframeWrapper}>
            {activeGame ? (
              <iframe
                src={activeGame.embedUrl}
                title={activeGame.title}
                style={styles.iframe}
                allowFullScreen
              />
            ) : (
              <div style={styles.vibrantWelcomeCard}>
                <div className="welcome-icon-glow" style={styles.iconCircle}>
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="6" width="20" height="12" rx="4" />
                    <line x1="6" y1="12" x2="10" y2="12" />
                    <line x1="8" y1="10" x2="8" y2="14" />
                  </svg>
                </div>
                <h3 style={styles.welcomeHeading}>
                  Play 7 Games Daily for 15 Days
                </h3>
                <p style={styles.welcomeSubtext}>
                  Each game costs 50 coins to activate. Watch ads or purchase
                  coins to get started! Play for at least 30 seconds per game.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* COIN ACTIVATION POPUP MODAL */}
      {showCoinPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ fontSize: '38px', marginBottom: '10px' }}>🪙</div>
            <h3
              style={{
                margin: '0 0 8px 0',
                color: '#1e293b',
                fontSize: '1.2rem',
              }}
            >
              Activate Game (50 Coins)
            </h3>
            <p
              style={{
                margin: '0 0 20px 0',
                color: '#64748b',
                fontSize: '0.9rem',
                lineHeight: '1.4',
              }}
            >
              You need 50 coins to activate this game. Watch an ad to get 50
              free coins!
            </p>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <button onClick={handleWatchAd} style={styles.purchaseBtn}>
                📺 Watch Ad (Get 50 Coins)
              </button>

              <button
                onClick={() => setShowCoinPopup(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #334155',
    flexWrap: 'wrap',
    gap: '12px',
  },
  backBtn: {
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    padding: '8px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#f8fafc',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid',
    padding: '6px 14px',
    borderRadius: '24px',
  },
  coinBadge: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    padding: '6px 14px',
    borderRadius: '24px',
  },
  coinText: {
    fontWeight: '700',
    color: '#fbbf24',
    fontSize: '0.95rem',
  },
  cooldownBanner: {
    backgroundColor: '#451a03',
    border: '1px solid #f97316',
    borderRadius: '12px',
    padding: '14px 18px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#ffedd5',
  },
  progressBanner: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '14px',
    padding: '16px 20px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  unlockSuccessBox: {
    backgroundColor: '#d1fae5',
    border: '1px solid #34d399',
    borderRadius: '14px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  unlockNowBtn: {
    marginTop: '10px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  mainLayout: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  gameSelector: {
    flex: '1 1 260px',
    minWidth: '260px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
  },
  selectorTitle: {
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '1.05rem',
    color: '#f8fafc',
    fontWeight: '700',
  },
  buttonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '140px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  gameButton: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    textAlign: 'left',
    fontSize: '0.95rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameContainer: {
    flex: '3 1 500px',
    width: '100%',
    maxWidth: '820px',
    display: 'flex',
    flexDirection: 'column',
  },
  gameHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    minHeight: '36px',
  },
  gameTitle: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#ffffff',
    fontWeight: '700',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  exitBtn: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  fullscreenBtn: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  iframeWrapper: {
    position: 'relative',
    width: '100%',
    height: '62vh',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.5)',
    border: '1px solid #334155',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: '#000000',
  },
  vibrantWelcomeCard: {
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle at 50% 30%, #312e81 0%, #1e1b4b 60%, #0f172a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#ffffff',
  },
  iconCircle: {
    width: '74px',
    height: '74px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  welcomeHeading: {
    margin: '0 0 10px 0',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  welcomeSubtext: {
    margin: 0,
    fontSize: '0.98rem',
    color: '#cbd5e1',
    maxWidth: '420px',
    lineHeight: '1.5',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '360px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  },
  adBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.92rem',
    cursor: 'pointer',
  },
  purchaseBtn: {
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.92rem',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.88rem',
    cursor: 'pointer',
  },
};
