import React, { useState } from "react";

const Demo = () => {
  const [adLoaded, setAdLoaded] = useState(false);

  const loadAd = () => {
    if (adLoaded) return; // prevent loading twice

    // Script to define atOptions
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

    // Script to load the ad
    const scriptInvoke = document.createElement("script");
    scriptInvoke.type = "text/javascript";
    scriptInvoke.src = "//www.highperformanceformat.com/4849511058af9f3ecf86ed5c6ab215a1/invoke.js";
    document.body.appendChild(scriptInvoke);

    setAdLoaded(true);
  };

  return (
    <div>
      <h1>Welcome to the Specific Page</h1>
      <button onClick={loadAd}>Show Ad</button>

      {/* Optional placeholder if needed */}
      <div id="ad-container" style={{ marginTop: "20px" }}></div>
    </div>
  );
};

export default Demo;
