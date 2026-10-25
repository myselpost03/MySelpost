import React, { useEffect, useRef } from 'react';

const AdsterraBanner = () => {
  const adRef = useRef(null);

  useEffect(() => {
    // Clear any previous ad content before loading new one
    if (adRef.current) {
      adRef.current.innerHTML = '';
    }

    const isMobile = window.innerWidth < 768;
    const script = document.createElement('script');
    
    // --- REPLACE THE KEYS BELOW WITH YOUR ACTUAL ADSTERRA KEYS ---
    if (isMobile) {
      // Mobile 320x50 Script
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://www.highperformanceformat.com/f81726d4889225ca5cb2d872ae5e7544/invoke.js'; 
      // Note: You usually need the config variable for Adsterra as well:
      window.atOptions = {
         'key' : 'f81726d4889225ca5cb2d872ae5e7544',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
      };
    } else {
      // Desktop 728x90 Script
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://www.highperformanceformat.com/4849511058af9f3ecf86ed5c6ab215a1/invoke.js';
      window.atOptions = {
        'key' : '4849511058af9f3ecf86ed5c6ab215a1',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    }

    if (adRef.current) {
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div 
      ref={adRef} 
      className="adsterra-banner-unit"
      style={{ minHeight: window.innerWidth < 768 ? '50px' : '90px' }}
    />
  );
};

export default AdsterraBanner;