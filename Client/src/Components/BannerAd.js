import React, { useState, useEffect } from "react";

const BannerAd = () => {
  const [adLoaded, setAdLoaded] = useState(false);

  const loadAd = () => {
    if (adLoaded) return; // Prevent loading twice

    // Create ad options script
    const scriptOptions = document.createElement("script");
    scriptOptions.type = "text/javascript";
    scriptOptions.innerHTML = `
      atOptions = {
        'key' : '4849511058af9f3ecf86ed5c6ab215a1',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    document.body.appendChild(scriptOptions);

    // Create invoke script
    const scriptInvoke = document.createElement("script");
    scriptInvoke.type = "text/javascript";
    scriptInvoke.src = "//www.highperformanceformat.com/4849511058af9f3ecf86ed5c6ab215a1/invoke.js";
    document.getElementById("ad-container").appendChild(scriptInvoke);

    setAdLoaded(true);
  };

  useEffect(() => {
    loadAd();
  }, []);

  return (
    <div>
      {/* Sticky bottom banner ad container */}
      <div
        id="ad-container"
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: "100%",
          background: "#f9f9f9",
          textAlign: "center",
          zIndex: 9999,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
         
        }}
      >
        
      </div>
    </div>
  );
};

export default BannerAd;
