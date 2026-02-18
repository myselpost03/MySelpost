import { useEffect } from 'react';

const AdsterraScripts = () => {
  useEffect(() => {
    // Array of your Adsterra script URLs
    const scriptUrls = [
      "https://pl27876548.effectivegatecpm.com/17/d5/ae/17d5ae4bb492601ab780e9a9f3aba122.js",
      "https://pl27706119.effectivegatecpm.com/0a/b1/6a/0ab16ae65f47e55e8162dc4e1411217c.js"
    ];

    const scripts = scriptUrls.map(url => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      return script;
    });

    // Cleanup scripts when the component unmounts to prevent memory leaks/conflicts
    return () => {
      scripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

  return null; // This component doesn't render any HTML
};

export default AdsterraScripts;