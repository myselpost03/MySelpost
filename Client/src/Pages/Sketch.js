import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Link } from "react-router-dom";
import first from "../Assets/1.jpg";
import second from "../Assets/2.jpg";
import Lottie from "lottie-react";
import arrow from "../Assets/arrow.json";
import "../Styles/Sketch.css";

const Sketch = () => {
  const [count, setCount] = useState(0);
  const target = 1500;
  const duration = 3000;
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let start = 0;
    const stepTime = Math.max(Math.floor(duration / target), 1);

    const counter = setInterval(() => {
      start += Math.floor(target / (duration / stepTime));
      if (start >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(counter);
  }, []);

  return (
    <div>
      <Header />
      <div className="sketch-image-row">
        <div className="sketch-image-block">
          <p className="sketch-label">Sketch</p>
          <img src={first} alt="Sketch Example 1" className="sketch-img-1" />
        </div>

        <div className="arrow-animation-desktop">
          <Lottie
            animationData={arrow}
            loop={true}
            style={{ height: "120px", width: "120px" }}
          />
        </div>

        <div className="sketch-image-block">
          <p className="sketch-label">Result</p>
          <img src={second} alt="Sketch Example 2" className="sketch-img-2" />
        </div>
      </div>

      <div className="counter-container">
        {/* Image Section */}

        {/* Text Section */}
        <div className="sketchy-text-wrapper">
          <p className="sketchy-text">
            <span className="sketchy-number">{count.toLocaleString()}+</span>{" "}
            users turned their sketches into a working website and app.
          </p>
        </div>
      </div>

      {/* Floating Action Button Group */}
      {/* Floating Action Button Group */}
      <div className="fab-container">
        {showAlert && (
          <div className="fab-options">
            <Link to="/app-sketch" className="fab-option">
              ✨ Create App
            </Link>
            <Link to="/web-sketch" className="fab-option">
              🌐 Create Website
            </Link>
          </div>
        )}

        <button
          className="fab-button"
          onClick={() => setShowAlert(!showAlert)}
          title="Create something"
        >
          ✏️
        </button>
      </div>
    </div>
  );
};

export default Sketch;
