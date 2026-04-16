import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Header.css';
import { supabase } from '../Utils/supabaseClient';
import bcrypt from 'bcryptjs';
import SketchyAlert from '../Components/SketchyAlert';
import { trackEvent } from '../Utils/analytics';
import { useTranslation } from 'react-i18next';
import CommunityPopup from './CommunityPopup';

const Header = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [emailValid, setEmailValid] = useState(true);
  const [credentialsValid, setCredentialsValid] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false); // 👈 Add this
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t, i18n } = useTranslation();
  const [adLoaded, setAdLoaded] = useState(false); // track ad load
  const [countryCode, setCountryCode] = useState('US'); // Default to US

  const [adVisible, setAdVisible] = useState(false);
  const [closeAdCountdown, setCloseAdCountdown] = useState(5); // 5 seconds countdown
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);

  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  // Fetch user location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const ipData = await res.json();
        if (ipData && ipData.country) {
          setCountryCode(ipData.country);
        }
      } catch (e) {
        console.warn(
          'Geo location detection failed, defaulting to International.'
        );
      }
    };
    detectLocation();
  }, []);

  useEffect(() => {
    if (adVisible) {
      setCloseAdCountdown(5); // reset countdown every time ad opens

      const timer = setInterval(() => {
        setCloseAdCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [adVisible]);

  const loadAd = () => {
    const adContainer = document.getElementById('ad-container');
    if (!adContainer) return; // wait until container exists

    // Remove old script if any
    const existingScript = document.getElementById('adsterra-script');
    if (existingScript) existingScript.remove();

    adContainer.innerHTML = '';

    const innerContainer = document.createElement('div');
    innerContainer.id = 'container-61abb6ea6099c52057a640165e20675a';
    adContainer.appendChild(innerContainer);

    const script = document.createElement('script');
    script.id = 'adsterra-script';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src =
      '//pl27196664.effectivegatecpm.com/61abb6ea6099c52057a640165e20675a/invoke.js';

    script.onload = () => console.log('Ad script loaded.');
    script.onerror = () => console.error('Failed to load ad script.');

    adContainer.appendChild(script);
  };

  // Run loadAd when popup becomes visible
  useEffect(() => {
    if (adVisible) {
      setAdLoaded(false);
      loadAd();
    }
  }, [adVisible]);

  const handleCloseAd = () => {
    setAdVisible(false);
    navigate('/roast');
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setTimeout(() => {
      setLoading(false); // simulate delay or finish loading
    }, 500);
  }, []);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCredentials = async (email, password) => {
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        setCredentialsValid(false);
      } else {
        const match = await bcrypt.compare(password, data.password);
        setCredentialsValid(match);
      }
    } catch {
      setCredentialsValid(false);
    } finally {
      setChecking(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (name === 'email') {
      setEmailValid(isEmailValid(value));
    }

    clearTimeout(debounceTimeout.current);

    if (
      updatedForm.email &&
      updatedForm.password &&
      isEmailValid(updatedForm.email)
    ) {
      debounceTimeout.current = setTimeout(() => {
        validateCredentials(updatedForm.email, updatedForm.password);
      }, 500);
    } else {
      setCredentialsValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    trackEvent({
      action: 'button_click',
      category: 'Header',
      label: 'Desktop Login Button',
    });
    setLoggingIn(true);
    const { email, password } = formData;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) throw new Error('Invalid email');

      const match = await bcrypt.compare(password, data.password);
      if (!match) throw new Error('Incorrect password');

      const userObj = { id: data.id, name: data.name, email: data.email };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj); // ✅ Set user to trigger logout UI
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleChat = () => {
    navigate('/register');
  };

  const handleRoast = () => {
    trackEvent({
      action: 'button_click',
      category: 'Header',
      label: 'Roast Button',
    });
    navigate('/roast');
  };

  const handleMobileRedirect = (path) => {
    navigate(path);
  };

  return (
    <header className="header-my">
      <div className="logo-container">
        <Link to="/" className="logo-header">
          MySelpost
        </Link>
        {/*{user && !isMobile && (
          <div className="feature-banner-container">
            <div className="coming-soon-banner">Coming Soon</div>
            <button
              className="sketchy-feature-button"
              //onClick={() => setShowZoomed(true)}
            >
              ✨ Feature your Profile here
            </button>
          </div>
        )}*/}
      </div>

      {!user ? (
        <form className="nav-with-inputs">
          {' '}
          {/*onSubmit={handleSubmit}*/}
          {
            !isMobile ? (
              <>
                <input
                  className="nav-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  className="nav-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <nav className="nav">
                  <button
                    type="submit"
                    className="profile-button"
                    disabled={checking || loggingIn}
                  >
                    {loggingIn
                      ? 'Logging in...'
                      : checking
                      ? 'Checking...'
                      : t('Login')}
                  </button>

                  <button
                    type="button"
                    className="profile-button"
                    onClick={() => navigate('/register')}
                  >
                    {t('Register')}
                  </button>
                  <div className="roast-button-container"></div>
                </nav>
              </>
            ) : (
              <nav className="nav">
                <button
                  type="button"
                  onClick={() => handleMobileRedirect('/login')}
                  className="profile-button"
                >
                  {t('login')}
                </button>
                <button
                  type="button"
                  onClick={handleChat}
                  className="profile-button"
                >
                  {t('register')}
                </button>
              </nav>
            )
            /*} 
              
             
          )*/
          }
        </form>
      ) : (
        <div className="nav-logged-in">
          <div className="roast-button-container">
            {/*<button onClick={() => navigate('/roast')} className="profile-button">
              Roast
            </button>*/}
            {/*<span className="new-badge">New</span>*/}
          </div>

          <button
            style={{ textDecoration: 'none' }}
            onClick={() => navigate(`/profile/${user.id}`)}
            className="profile-button"
          >
            {t('profile')}
          </button>
        </div>
      )}
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
      {adVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              width: '90%',
              maxWidth: '400px',
            }}
          >
            <div className="ad-header">
              <span className="ad-label">Ad</span>
              <span className="ad-by">Powered by Adsterra</span>
            </div>
            <div
              id="ad-container"
              style={{
                marginTop: '20px',
                minHeight: '100px',
                border: '2px dashed #007bff',
                borderRadius: '10px',
                background: '#f9f9f9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {!adLoaded && <span>Loading Ad...</span>}
            </div>
            <button
              onClick={handleCloseAd}
              disabled={closeAdCountdown > 0} // disabled until countdown ends
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: closeAdCountdown > 0 ? '#555' : '#111', // different style while disabled
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: closeAdCountdown > 0 ? 'not-allowed' : 'pointer',
                position: 'relative',
              }}
            >
              Close Ad {closeAdCountdown > 0 && `(${closeAdCountdown})`}
            </button>
          </div>
        </div>
      )}
      
      {!isTelegram && (
        <CommunityPopup
          isOpen={showCommunityPopup}
          onClose={() => setShowCommunityPopup(false)}
        />
      )}
    </header>
  );
};

export default Header;
