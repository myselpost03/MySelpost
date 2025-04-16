import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Link, useNavigate } from "react-router-dom";
import first from "../Assets/doodle.png";
import second from "../Assets/doodle-result.jpg";
import Lottie from "lottie-react";
import arrow from "../Assets/arrow.json";
import draw from "../Assets/draw.png"; // Add your image for the new FAB
import "../Styles/Sketch.css";

const DoodleExample = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <div className="sketch-image-row">
        <div className="sketch-image-block">
          <p className="sketch-label">Doodle</p>
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
    </div>
  );
};

export default DoodleExample;
