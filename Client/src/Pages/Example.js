import React, { useState } from 'react';
import Header from '../Components/Header';
import third from "../Assets/3.jpg";
import fourth from "../Assets/4.jpg";
import fifth from "../Assets/5.jpg";
import sixth from "../Assets/6.jpg";
import seventh from "../Assets/7.jpg";
import eight from "../Assets/8.png";
import ninth from "../Assets/9.jpg";
import tenth from "../Assets/10.png";
import '../Styles/Example.css';

const imagePairs = [
  { sketch: fifth, result: sixth },
  { sketch: seventh, result: eight },
  { sketch: ninth, result: tenth }
];

const Example = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < imagePairs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const { sketch, result } = imagePairs[currentIndex];

  return (
    <div>
      <Header />
      <div className="example-slide-container">
        <div className="example-slide">
          <div className="example-block">
            <p className="example-label">Sketch</p>
            <img src={sketch} alt={`Sketch ${currentIndex + 1}`} className="example-img" />
          </div>
          <div className="example-block">
            <p className="example-label">Result</p>
            <img src={result} alt={`Result ${currentIndex + 1}`} className="example-img" />
          </div>
        </div>

        <div className="slide-buttons">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="slide-btn">Previous</button>
          <button onClick={handleNext} disabled={currentIndex === imagePairs.length - 1} className="slide-btn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Example;
