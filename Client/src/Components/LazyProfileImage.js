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
        laoding="lazy"
        onLoad={() => setLoaded(true)}
        className={`profile-image ${loaded ? "loaded" : "hidden"}`}
      />
    </div>
  );
};

export default LazyProfileImage;
