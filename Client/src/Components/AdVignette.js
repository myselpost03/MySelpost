// AdVignette.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AdVignette = () => {
  const location = useLocation();

  useEffect(() => {
    const key = `vignette_${location.pathname}`;

    // Already shown on this page in this session
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, 'true');

    const script = document.createElement('script');
    script.dataset.zone = '10376766';
    script.src = 'https://n6wxm.com/vignette.min.js';
    script.async = true;

    document.body.appendChild(script);

    // Optional cleanup: remove script on unmount (not strictly necessary)
    return () => {
      document.body.removeChild(script);
    };
  }, [location.pathname]);

  return null;
};

export default AdVignette;
