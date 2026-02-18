import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import OneSignal from 'react-onesignal';
import AdsterraNativeBanner from '../Components/AdsterraNativeBanner';

const Sketch = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- New State for Onboarding ---
  const [showModal, setShowModal] = useState(false);
  const [gender, setGender] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const COLORS = {
    gradient: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
    bg: '#FFF5F7',
    textMain: '#2D3748',
    textMuted: '#718096',
    primary: '#ff758c',
    border: '#FED7E2',
    white: '#FFFFFF',
    success: '#ED64A6',
    disabled: '#FFD1DC',
    insta: '#E4405F',
  };
  const spinnerStyle = {
    width: '24px',
    height: '24px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #ff758c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };
  // --- OneSignal Permission Check ---
  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Check existing permission
        if (Notification.permission === 'granted') {
          setNotificationAllowed(true);
          await OneSignal.User.PushSubscription.optIn();
        } else {
          setNotificationAllowed(false);
        }
      } catch (err) {
        console.error(err);
        setNotificationAllowed(false);
      } finally {
        setCheckingPermission(false);
      }
    };

    checkPermission();
  }, []);

  const handleSubscribe = async () => {
    try {
      const permission = await OneSignal.Notifications.requestPermission();

      if (permission === true || Notification.permission === 'granted') {
        await OneSignal.User.PushSubscription.optIn();

        const playerId = OneSignal.User.PushSubscription.id;
        console.log('✅ Player ID:', playerId);

        setNotificationAllowed(true);
      } else {
        console.log('❌ Permission denied');
        setNotificationAllowed(false);
      }
    } catch (err) {
      console.error('❌ Error subscribing:', err);
      setNotificationAllowed(false);
    }
  };
  // Check localStorage on mount
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('user_onboarded');
    if (!hasOnboarded) {
      setShowModal(true);
    }
  }, []);

  const handleOnboardingSubmit = () => {
    if (gender && agreed) {
      localStorage.setItem('user_onboarded', 'true');
      localStorage.setItem('user_gender', gender);

      setShowModal(false); // close modal first
      setIsLoading(true); // show main loader

      setTimeout(() => {
        setIsLoading(false); // hide loader after 3 seconds
      }, 3000);
    }
  };
  const handleFile = (selectedFile) => {
    if (
      selectedFile &&
      (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png')
    ) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const convertImage = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const targetType =
          file.type === 'image/jpeg' ? 'image/png' : 'image/jpeg';
        const extension = targetType === 'image/png' ? 'png' : 'jpg';
        const dataUrl = canvas.toDataURL(targetType, 0.9);
        const link = document.createElement('a');
        link.download = `converted_${Date.now()}.${extension}`;
        link.href = dataUrl;
        link.click();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // --- Styles ---
  const containerStyle = {
    minHeight: '100vh',
    background: COLORS.gradient,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    color: COLORS.textMain,
    position: 'relative',
    filter: showModal ? 'blur(8px)' : 'none', // Blur content when modal is active
    pointerEvents: showModal ? 'none' : 'auto', // Disable interaction
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    pointerEvents: 'auto', // Re-enable pointer events for the modal itself
  };

  const modalStyle = {
    background: '#fff',
    padding: '40px',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: COLORS.white,
    padding: '32px',
    borderRadius: '28px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    margin: 'auto',
  };

  const topButtonStyle = {
    flex: 1,
    padding: '16px 10px',
    borderRadius: '20px',
    border: `2px solid ${COLORS.border}`,
    background: COLORS.white,
    color: COLORS.primary,
    fontWeight: '800',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  };

  const orDividerStyle = {
    display: 'flex',
    alignItems: 'center',
    margin: '28px 0',
    color: COLORS.textMuted,
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const lineStyle = {
    flex: 1,
    height: '1px',
    background: COLORS.border,
    margin: '0 12px',
  };

  const dropZoneStyle = {
    border: `2px dashed ${isDragging ? COLORS.primary : COLORS.border}`,
    borderRadius: '20px',
    padding: '24px',
    textAlign: 'center',
    backgroundColor: isDragging ? '#FFF5F7' : '#FCFCFC',
    cursor: 'pointer',
  };

  const convertButtonStyle = {
    width: '100%',
    padding: '18px',
    borderRadius: '16px',
    border: 'none',
    background: file && !showModal ? COLORS.gradient : COLORS.disabled,
    color: COLORS.white,
    fontSize: '16px',
    fontWeight: '700',
    cursor: file && !showModal ? 'pointer' : 'not-allowed',
    marginTop: '20px',
  };

  const handleInsta = () => navigate('/viewer');
  const handleChat = () => navigate('/guest-user');

  return (
    <>
      <style>
        {`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`}
      </style>
      {isLoading && (
        <>
         
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              zIndex: 2000,
              color: '#fff',
            }}
          > <Header />
            <div
              style={{
                width: '50px',
                height: '50px',
                border: '5px solid rgba(255,255,255,0.3)',
                borderTop: '5px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />

           
          </div>
        </>
      )}
      {/* Onboarding Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginBottom: '10px' }}>Welcome!</h2>
            <p
              style={{
                color: COLORS.textMuted,
                fontSize: '14px',
                marginBottom: '24px',
              }}
            >
              Please complete this to continue.
            </p>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label
                style={{
                  fontWeight: '700',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                I am:
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: `1px solid ${COLORS.border}`,
                }}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div
              style={{
                marginBottom: '24px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <label
                htmlFor="terms"
                style={{ fontSize: '13px', color: COLORS.textMain }}
              >
                I agree to the Terms and Conditions
              </label>
            </div>
            {/* Notification Button inside Modal */}
            {!notificationAllowed ? (
              <button
                onClick={handleSubscribe}
                style={{
                  width: '100%',
                  marginBottom: '15px',
                  background: '#f8f9fa',
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textMain,
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                🔔 Enable Notifications to Continue
              </button>
            ) : (
              <div
                style={{
                  color: COLORS.success,
                  fontSize: '13px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                ✅ Notifications Enabled
              </div>
            )}
            <button
              onClick={handleOnboardingSubmit}
              disabled={!gender || !agreed || !notificationAllowed || isLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background:
                  gender && agreed && notificationAllowed ? COLORS.gradient : COLORS.disabled,
                color: '#fff',
                fontWeight: '700',
                cursor:
                  gender && agreed && notificationAllowed && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {isLoading ? (
                <>
                  <div style={spinnerStyle}></div>
                  Please wait...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={containerStyle}>
        <Header />
        {!showModal && (
          <div style={{ marginTop: '20%' }}>
            <AdsterraNativeBanner />
          </div>
        )}
        <main style={{ flex: 1, display: 'flex', padding: '20px' }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={topButtonStyle} onClick={handleInsta}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                  alt="Instagram"
                  style={{ width: '24px', height: '24px' }}
                />
                InstaViewer
              </button>
              <button style={topButtonStyle} onClick={handleChat}>
                <span style={{ fontSize: '22px' }}>🌏</span> Chat Foreigners
              </button>
            </div>

            <div style={orDividerStyle}>
              <div style={lineStyle}></div>
              Quick Convert
              <div style={lineStyle}></div>
            </div>

            <div
              style={dropZoneStyle}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {!preview ? (
                <>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                    ☁️
                  </div>
                  <p
                    style={{ fontWeight: '700', fontSize: '14px', margin: '0' }}
                  >
                    Drop or Click
                  </p>
                  <p
                    style={{
                      color: COLORS.textMuted,
                      fontSize: '11px',
                      margin: '4px 0 0 0',
                    }}
                  >
                    PNG or JPG
                  </p>
                </>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                  }}
                >
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: `2px solid ${COLORS.primary}`,
                    }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <p
                      style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}
                    >
                      {file.name.substring(0, 15)}...
                    </p>
                    <p
                      style={{
                        fontSize: '10px',
                        color: COLORS.textMuted,
                        margin: 0,
                      }}
                    >
                      Ready to convert
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              style={convertButtonStyle}
              disabled={!file}
              onClick={convertImage}
            >
              {file
                ? `Download ${file.type === 'image/jpeg' ? 'PNG' : 'JPG'}`
                : 'Select Image First'}
            </button>
          </div>
        </main>

        <footer
          style={{
            padding: '20px',
            textAlign: 'center',
            color: COLORS.white,
            fontSize: '11px',
            fontWeight: '600',
          }}
        >
          PRIVACY FIRST • CLIENT-SIDE PROCESSING
        </footer>
      </div>
    </>
  );
};

export default Sketch;
