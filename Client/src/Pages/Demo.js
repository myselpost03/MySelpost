import React from "react";
import "../Styles/Demo.css";

const Demo = () => {
  return (
    <div className="steps-container-horizontal">
      <div className="step-card delay-0">
        <span className="icon">📝</span>
        <p>Sketch Your Idea</p>
      </div>

      <div className="arrow delay-1">→</div>

      <div className="step-card delay-2">
        <span className="icon">⚙️</span>
        <p>AI Builds the App</p>
      </div>

      <div className="arrow delay-3">→</div>

      <div className="step-card delay-4">
        <span className="icon">📲</span>
        <p>Share or Download</p>
      </div>
    </div>
  );
};

export default Demo;
