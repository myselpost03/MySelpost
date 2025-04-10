import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Pricing.css"; // optional external CSS for more control

const Pricing = () => {
  const navigate = useNavigate();

  const handleFree = () => {
    return navigate("/sketch");
  };

  const handlePaid = () => {
    return navigate("/prompt");
  };

  return (
    <div className="pricing-page">
      <Header />

      <div className="pricing-container">
        <div className="plans-wrapper">
          {/* Sketch Plan */}
          <div className="plan-card free">
            <h2 className="plan-name">🎨 Sketch</h2>
            <p className="plan-price">Free</p>
            <ul className="plan-features">
              <li>📦 Delivery Time: 7 Days</li>
              <li>🖍️ Monthly Points: 1</li>
              <li>💡 Submit using hand-drawn sketches</li>
              {/*<li>📢 Supported by ads</li>*/}
            </ul>

            <button className="select-button" onClick={handleFree}>
              Start Free
            </button>
          </div>

          {/* Prompt Plan */}
          <div className="plan-card paid">
            <h2 className="plan-name">✏️ Prompt</h2>
            <p className="plan-price">Paid</p>
            <p className="plan-price">$5/month</p>
            <ul className="plan-features">
              <li>⚡ Delivery Time: 3 Days</li>
              <li>🖍️ Monthly Points: 3</li>
              <li>💬 Describe your idea in text</li>
              {/*<li>🚫 No ads</li>*/}
            </ul>
            <button className="select-button" onClick={handlePaid}>
              Unlock Prompt Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
