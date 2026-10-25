import React, { useEffect, useState } from 'react';
import i18n from '../i18n';
import '../Styles/BrandSelection.css';

const BrandSelection = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent automatic mini-banner
      setDeferredPrompt(e); // Save event for later
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    setShowPopup(true); // Show phone brand selection popup
  };

  const handleBrandSelect = async (brand) => {
    setShowPopup(false);

    if (brand === 'Iphone' || brand === 'None of these') {
      if (deferredPrompt) {
        // Android: show native install prompt
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      } else {
        // iPhone / other: show instructions
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
      <button onClick={handleInstallClick} className="install-button">
        {i18n.t('installApp')}
      </button>

      {showPopup && (
        <div className="brands-popup-overlay">
          <div className="brands-popup">
            <h3> {i18n.t('selectBrand')} </h3>
            <ul className="brand-list">
              {[
                'Xiaomi (Redmi, Poco)',
                'Vivo',
                'Samsung',
                'Huawei',
                'Oppo',
                'Realme',
                'Iphone',
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

export default BrandSelection;
