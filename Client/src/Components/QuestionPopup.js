import React, { useState } from "react";
import "../Styles/ScratchPopup.css"; // merged CSS for both

const QuestionPopup = ({ question, options, onClose, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    setSelected(index);
    if (onAnswer) onAnswer(index);
  };

  return (
    <div className="scratch-popup-overlay">
      <div className="scratch-popup-container">
        <button className="scratch-popup-close-circle" onClick={onClose}>
          ✖
        </button>
        <h2 className="scratch-popup-title">🤔 Question Time!</h2>
        <p className="scratch-popup-question">{question}</p>
        <div className="scratch-popup-options">
          {options.map((opt, idx) => (
            <button
              key={idx}
              className={`scratch-popup-option ${
                selected === idx ? "scratch-selected" : ""
              }`}
              onClick={() => handleSelect(idx)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionPopup;
