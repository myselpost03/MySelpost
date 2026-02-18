import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SketchyHeader from "../Components/SketchyHeader";
import AdsterraBanner from '../Components/AdsterraBanner';
import '../Styles/Demo.css';

const EnterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [error, setError] = useState('');

  const loadingSteps = [
    { threshold: 25, text: "Establishing secure connection..." },
    { threshold: 50, text: `Searching database for @${username}...` },
    { threshold: 75, text: "Analyzing profile metadata..." },
    { threshold: 90, text: "Finalizing request tokens..." },
    { threshold: 100, text: "Position Assigned!" }
  ];

  useEffect(() => {
    let interval;
    if (status === 'loading') {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 3) + 1;
          const step = loadingSteps.find(s => next <= s.threshold);
          if (step) setLoadingText(step.text);

          if (next >= 100) {
            clearInterval(interval);
            // Redirect to the new /queue route after a short delay
            setTimeout(() => {
              navigate('/queue', { state: { username } });
            }, 1200);
            return 100;
          }
          return next;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [status, username, navigate]);

  const handleStartProcess = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }
    setError('');
    setStatus('loading');
  };

  return (
    <div className='banner-cont'>
      <div className='viewer-banner'><AdsterraBanner /></div>
      <SketchyHeader title="InstaView" onBack={() => navigate(-1)} />
      
      <div className="container">
        <div className="card">
          <h1 className="logo-ins">InstaView</h1>
          
          {status === 'idle' ? (
            <div className="fade-in">
              <p className="subtitle">Enter username to start extraction</p>
              <form onSubmit={handleStartProcess}>
                <div className="input-group">
                  <span className="input-prefix">@</span>
                  <input
                    type="text"
                    placeholder="username"
                    className={`input-field-custom ${error ? 'input-error' : ''}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <button className="btn-primary">Proceed</button>
              </form>
            </div>
          ) : (
            <div className="loading-ui fade-in">
              <div className="spinner"></div>
              <h3 className="loading-status-text">{loadingText}</h3>
              <div className="progress-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="percentage">{progress}%</p>
            </div>
          )}
        </div>
      </div>
      <div className="viewer-banner-2"><AdsterraBanner /></div>
      <div className="viewer-banner-2"><AdsterraBanner /></div>
    </div>
  );
};

export default EnterPage;