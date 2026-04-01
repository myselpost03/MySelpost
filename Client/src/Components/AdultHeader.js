import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Header.css';
import { supabase } from '../Utils/supabaseClient';
import bcrypt from 'bcryptjs';
import SketchyAlert from '../Components/SketchyAlert';
import { trackEvent } from '../Utils/analytics';
import { useTranslation } from 'react-i18next';
import AdultPopup from '../Components/AdultPopup';
import Tip from '../Pages/Tip';
const AdultHeader = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [emailValid, setEmailValid] = useState(true);
  const [credentialsValid, setCredentialsValid] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false); // 👈 Add this
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showZoomed, setShowZoomed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t, i18n } = useTranslation();
  const [adLoaded, setAdLoaded] = useState(false); // track ad load
  const [countryCode, setCountryCode] = useState('US'); // Default to US

  const [adVisible, setAdVisible] = useState(false);
  const [closeAdCountdown, setCloseAdCountdown] = useState(5); // 5 seconds countdown
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
  const handleUpgrade = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

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
    if (isMobile) navigate(path);
  };

  return (
    <header  style={{textAlign: 'center', backgroundColor: '#111', padding: '10px', display: 'flex', justifyContent: 'space-between'}}>
      <div className="logo-container" style={{textAlign: 'center'}}>
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
      {countryCode === 'IN' ? (
        <AdultPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      ) : (
        <AdultPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      )}
    </header>
  );
};

export default AdultHeader;
