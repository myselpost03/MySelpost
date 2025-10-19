import React, { useState } from "react";

const Demo = () => {
  const [adLoaded, setAdLoaded] = useState(false);

  const loadAd = () => {
    // Remove old script if any
    const existingScript = document.getElementById("adsterra-script");
    if (existingScript) existingScript.remove();

    // Clear ad container
    const adContainer = document.getElementById("ad-container");
    if (adContainer) adContainer.innerHTML = "";

    // Create the required Adsterra container div with the **same ID**
    const innerContainer = document.createElement("div");
    innerContainer.id = "container-61abb6ea6099c52057a640165e20675a";
    adContainer.appendChild(innerContainer);

    // Append Adsterra script
    const script = document.createElement("script");
    script.id = "adsterra-script";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "//pl27196664.effectivegatecpm.com/61abb6ea6099c52057a640165e20675a/invoke.js";

    script.onload = () => {
      console.log("Ad script loaded successfully.");
      setAdLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load ad script.");
      setAdLoaded(false);
    };

    adContainer.appendChild(script);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {adLoaded ? (
        <p style={{ fontWeight: "bold", color: "green" }}>Sponsored Content 🌟</p>
      ) : (
        <p style={{ fontWeight: "bold", color: "#555" }}>Loading Ad...</p>
      )}

      {/* Ad display container */}
      <div
        id="ad-container"
        style={{
          marginTop: "20px",
          padding: "15px",
          minHeight: "100px",
          border: "2px dashed #007bff",
          borderRadius: "10px",
          background: "#f9f9f9",
        }}
      ></div>

      {/* Button to reload ad */}
      <button
        onClick={loadAd}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Load New Ad
      </button>
    </div>
  );
};

export default Demo;
