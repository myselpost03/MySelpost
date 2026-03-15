import React, {useState, useEffect} from 'react';
import UPI from './UPI';
import Tip from './Tip';
import '../Styles/Result.css';

const Result = ({
  username,
  carouselItems,
  carouselIndex,
  setCarouselIndex,
  postImages,
  handleContentLocker,
  setPreviewImage
}) => {
  // Add a safety check here
  const current = carouselItems && carouselItems[carouselIndex];
const [showPopup, setShowPopup] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
  useEffect(() => {
      fetch('https://ipwho.is/?fields=country_code')
        .then((res) => res.json())
        .then((data) => setCountryCode(data?.country_code || 'US'))
        .catch(() => setCountryCode('US'));
    }, []);
  const nextSlide = () =>
    setCarouselIndex((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
  const prevSlide = () =>
    setCarouselIndex((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );

  // If data isn't ready yet, return null to prevent the crash
  if (!current) return null;
  
  return (
    <div className="carousel-root">
      <div className="carousel-header-main">
        <h2 className="results-title">
          Results for Target User
        </h2>
      </div>

      <div className="modern-carousel">
        <div className="carousel-nav-header">
          <button className="nav-arrow" onClick={prevSlide}>
            ‹
          </button>

          <div className="carousel-title-box">
            <span className="type-icon">{current.icon}</span>
            <h3 className="carousel-main-title">{current.title}</h3>
            <div className="indicator-dots">
              {carouselItems.map((_, i) => (
                <div
                  key={i}
                  className={`dot-bar ${i === carouselIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          <button className="nav-arrow" onClick={nextSlide}>
            ›
          </button>
        </div>

        {/* Content Area - No 'key' here to prevent flickering */}
        <div className="carousel-content-area">
          {current.type === 'media' ? (
            <div className="modern-grid fade-in">
            {postImages.map((img, index) => {
              const isUnlocked = index === 0; // First image logic
              return (
                <div 
                  key={img.id} 
                  className={`modern-blur-item ${isUnlocked ? 'unlocked-preview' : ''}`}
                  onClick={() => isUnlocked && setPreviewImage(img.url)}
                >
                  <img 
                    src={img.url} 
                    alt="" 
                    className="img-layer" 
                    style={isUnlocked ? { filter: 'none', transform: 'none' } : {}} 
                  />
                  
                  {!isUnlocked && (
                    <div className="lock-overlay-v2">
                      <span className="lock-icon-mini">🔒</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          ) : (
            <div className="modern-list fade-in">
              {[...Array(current.count)].map((_, i) => (
                <div key={i} className="modern-list-item">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-line" />
                  <span className="lock-tag">Encrypted</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="unlock-full-btn" onClick={handleContentLocker}>
          Download All Posts
        </button>
      </div>
       {countryCode === 'IN' ? (
                <UPI isOpen={showPopup} onClose={() => setShowPopup(false)} />
              ) : (
                <Tip isOpen={showPopup} onClose={() => setShowPopup(false)} />
              )}
    </div>
  );
};

export default Result;
