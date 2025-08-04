import React, { useState } from "react";
import "../Styles/LazyProfileImage.css"; // We’ll create this CSS file

const LazyProfileImage = ({ src }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="lazy-profile-image-wrapper">
      {!loaded && <div className="skeleton-loader" />}
      <img
        src={src}
        alt="Profile"
        loading="lazy"
onLoad={() => {
  console.log("Image loaded"); // ← should show in console
  setLoaded(true);
}}
onError={() => {
  console.log("Image failed to load");
  setLoaded(true); // hide loader even if image fails
}}
        className={`profile-image ${loaded ? "loaded" : "hidden"}`}
      />
    </div>
  );
};

export default LazyProfileImage;
