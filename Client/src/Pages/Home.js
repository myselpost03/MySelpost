import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Styles/Home.css';
import SketchyAlert from '../Components/SketchyAlert';
import { supabase } from '../Utils/supabaseClient';
import { trackEvent } from '../Utils/analytics';
import AdsterraBanner from '../Components/AdsterraBanner';
import AdsterraNativeBanner from '../Components/AdsterraNativeBanner';

const Home = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ gender: '', age: '' });
  const [loadingInsta, setLoadingInsta] = useState(true);
  const handlePrivate = () => {
    navigate('/private');
  };

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser?.id) {
        setUser(null);
        return;
      }

      // Fetch fresh user data from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', storedUser.id)
        .single();

      if (error) {
        console.error('Failed to fetch user from DB:', error.message);
        setUser(null);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);

      // Show profile modal only if age or gender missing
      if (!data.gender || !data.age) {
        setShowProfileModal(true);
      } else {
        setShowProfileModal(false);
      }
    };

    fetchAndSetUser();
  }, [navigate]);

  useEffect(() => {
    // TIMER LOGIC: Hide loading after 3 seconds
    const timer = setTimeout(() => {
      setLoadingInsta(false);
    }, 3000);

    const fetchAndSetUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser?.id) {
        setUser(null);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', storedUser.id)
        .single();

      if (error) {
        console.error('Failed to fetch user from DB:', error.message);
        setUser(null);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);

      if (!data.gender || !data.age) {
        setShowProfileModal(true);
      } else {
        setShowProfileModal(false);
      }
    };

    fetchAndSetUser();

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    if (name === 'age') {
      // allow only numbers
      if (!/^\d*$/.test(value)) return;

      // restrict to 2 digits
      if (value.length > 2) return;

      let num = parseInt(value, 10);

      // if user has typed 2 digits, enforce min/max
      if (value.length === 2 && !isNaN(num)) {
        if (num < 13) num = 13;
        if (num > 99) num = 99;
        setProfileForm((prev) => ({ ...prev, [name]: String(num) }));
        return;
      }
    }

    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async () => {
    trackEvent({
      action: 'button_click',
      category: 'Home Page',
      label: 'Submit Gender & Age Button',
    });
    if (!profileForm.gender || !profileForm.age) return;

    const { error } = await supabase
      .from('users')
      .update({
        gender: profileForm.gender,
        age: parseInt(profileForm.age),
      })
      .eq('id', user.id);

    if (!error) {
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowProfileModal(false);
    } else {
      console.error('Update failed:', error.message);
    }
  };

  const handleChatClick = () => {
    navigate('/chat-entrance');
  };

  const handleBuildAppClick = () => {
    trackEvent({
      action: 'button_click',
      category: 'Home Page',
      label: 'Sketch App Button',
    });
    setShowBuildModal(true);
  };

  const closeAlert = () => setShowAlert(false);
  const closeBuildModal = () => setShowBuildModal(false);

  const handleBuildChoice = (type) => {
    setShowBuildModal(false);
    if (type === 'sketch') {
      navigate('/sketch');
    } else if (type === 'prompt') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        navigate('/prompt');
      } else {
        setShowAlert(true);
      }
    }
  };

  const handleClick = async () => {
    await handleProfileSubmit();
  };

  const handleVideo = () => {
    navigate('/community');
  };

  return (
    <div className="background-animated">
      <div className={showAlert || showBuildModal ? 'blurred' : ''}>
        <Header />
        {/* 1. Native Ad: No negative margins, just simple padding */}
        <div className="ad-wrapper-native-protected">
          <div className="ad-container-inner-protected">
            <AdsterraNativeBanner />
          </div>
        </div>
        <div className="ad-wrapper-banner-protected">
          <div className="ad-container-inner-protected">
            <AdsterraBanner />
          </div>
        </div>
        {/* 2. Main Content: Use flex-grow to push the bottom ad down */}
        <main className="home-main-content">
          <div className="button-container">
            <div
              className="community"
              style={{ display: 'flex', padding: '20px' }}
            >
              {loadingInsta ? (
                /* SHOW THIS DURING THE 3 SECONDS */
                <div
                  style={{
                    marginTop: '-50px',
                    color: '#000',
                    fontWeight: 'bold',
                  }}
                >
                  <span className="loading-label">Loading instaviewer...</span>
                </div>
              ) : (
                /* SHOW THIS AFTER 3 SECONDS */
                <div
                  className="viewPrivate"
                  onClick={handlePrivate}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '-50px',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                    alt="Instagram"
                    style={{ width: '25px', height: '25px' }}
                  />
                  <span>Insta Account Viewer</span>
                </div>
              )}
            </div>
            {/* <span
                className="or-text"
                style={{
                  marginRight: '20px',
                  marginLeft: '20px',
                  marginTop: '20px',
                }}
              >
                OR
              </span>
            <button className="sketchy-button-insta" onClick={handleChatClick}>
              Chat Foreign Girls or Boys (Free)
            </button>*/}
          </div>
        </main>

        <Footer />
      </div>

      {showBuildModal && (
        <div className="modal-overlay">
          <div className="sketchy-alert-box build-app-modal">
            <h3>🚀 Build App</h3>
            <p>Choose how you want to build:</p>
            <div className="modal-buttons">
              <button
                className="sketchy-button"
                onClick={() => handleBuildChoice('sketch')}
              >
                Sketch (Free)
              </button>
              <button
                className="sketchy-button"
                onClick={() => handleBuildChoice('prompt')}
              >
                Prompt (Paid)
              </button>
            </div>
            <button onClick={closeBuildModal} className="sketchy-close-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
      {showAlert && (
        <div className="modal-overlay">
          <div className="sketchy-alert-box register-alert-modal">
            <p>
              To use the Prompt option, you must first{' '}
              <Link to="/register" className="sketchy-link">
                register
              </Link>
              .
            </p>
            <button onClick={closeAlert} className="sketchy-close-btn">
              Got it!
            </button>
          </div>
        </div>
      )}
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
      {showProfileModal && (
        <div className="popup-wrapper">
          <div className="popup-card">
            <h3 className="popup-title">Hey there!</h3>
            <p className="popup-text">
              Tell us your age and gender to continue.
            </p>

            <div className="option-row">
              <label className="option-box">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={profileForm.gender === 'male'}
                  onChange={handleProfileChange}
                />{' '}
                Male
              </label>
              <label className="option-box">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={profileForm.gender === 'female'}
                  onChange={handleProfileChange}
                />{' '}
                Female
              </label>
            </div>

            <input
              type="number"
              className="input-field"
              placeholder="Enter your age"
              name="age"
              value={profileForm.age}
              onChange={handleProfileChange}
            />

            <button className="submit-funky-btn" onClick={handleClick}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
