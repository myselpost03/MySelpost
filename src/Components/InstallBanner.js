import React, { useEffect, useState } from 'react';
import i18n from '../i18n';
import '../Styles/InstallBanner.css';

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    //setShowPopup(true);

     if (deferredPrompt) {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');

         
        }
        setDeferredPrompt(null);
      } else {
        alert(
          'To install the app on iPhone or unsupported devices, ' +
            "please tap the Share button in Safari and select 'Add to Home Screen'."
        );
      }
  };

  const handleCancel = () => {
    setShowBanner(false);
  };

  const handleBrandSelect = async (brand) => {
    setShowPopup(false);

    if (brand === 'Iphone' || brand === 'None of these') {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');

         
        }
        setDeferredPrompt(null);
      } else {
        alert(
          'To install the app on iPhone or unsupported devices, ' +
            "please tap the Share button in Safari and select 'Add to Home Screen'."
        );
      }
    } else {
      console.log(`User selected ${brand}, not showing install prompt.`);
    }
  };

  return (
    <div>
      {/* ✅ Bottom Banner */}
      {showBanner && (
        <div className="install-banner">
          <div className="banner-right">
            <button className="banner-btn install" onClick={handleInstallClick}>
              Install
            </button>
            <button className="banner-btn cancel">
              Later
            </button>
          </div>
        </div>
      )}

      {/* ✅ Brand Selection Popup */}
      {showPopup && (
        <div className="brands-popup-overlay">
          <div className="brands-popup">
            <h3>{i18n.t('selectBrand')}</h3>
            <ul className="brand-list">
              {[
                'Xiaomi (Redmi, Poco)',
                'Vivo',
                'Samsung',
                'Huawei',
                'Oppo',
                'Realme',
                'iPhone',
                i18n.t('none'),
              ].map((brand) => (
                <li
                  key={brand}
                  onClick={() => handleBrandSelect(brand)}
                  className="brand-item"
                >
                  {brand}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallBanner;
