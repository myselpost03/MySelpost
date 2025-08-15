import React from "react";
import imgSrc from "../Assets/Car-1.jpg";
import "../Styles/FeaturedRoast.css";

const FeaturedRoast = () => {
  const randomTexts = [
    "Life is short, make it spicy.",
    "Even coffee is jealous of this roast.",
    "This one’s hotter than your ex’s new flame.",
    "A roast so good, you’ll forget your password.",
    "Warning: May cause excessive smirking."
  ];

  const randomText = randomTexts[Math.floor(Math.random() * randomTexts.length)];

  return (
    <div>
      <div className="featured-roast-card">
        <h2 className="featured-roast-header">ROAST OF THE DAY</h2>
        <div className="featured-roast-img-cont">
          <img src={imgSrc} alt="featured roast" />
        </div>
      </div>

      {/* New text-only card */}
      <div className="roast-text-card">
        <p>{randomText}</p>
      </div>
    </div>
  );
};

export default FeaturedRoast;
