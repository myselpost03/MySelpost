import React from "react";
import Header from "../Components/Header";
import first from "../Assets/doodle.png";
import second from "../Assets/doodle-result.jpg";
import Lottie from "lottie-react";
import arrow from "../Assets/arrow.json";
import "../Styles/Sketch.css";

const DoodleExample = () => {

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
