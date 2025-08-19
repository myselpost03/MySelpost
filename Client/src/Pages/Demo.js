import React from "react";
import "../Styles/Demo.css";

export default function Demo() {
  return (
    <div className="alert-wrapper">
      <div className="custom-alert">
        <div className="alert-header">
          <h2>Coming soon: <span>Roast Me</span></h2>
        </div>
        <div className="alert-body">
          <p>
            Take your pic and let your friends roast you in <strong>real-time</strong>!  
            Compete with a timer and see who’s the best at roasting.
          </p>
          <div className="alert-timer">
            ⏱ Timer: <span>00:30</span> seconds
          </div>
        </div>
      </div>
    </div>
  );
}
