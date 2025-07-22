import React from "react";
import "../Styles/SketchyHeader.css";

const SketchyHeader = ({ title, onBack }) => {
  return (
    <div className="sketchy-header">
      <button className="back-button" onClick={onBack}>
        ←
      </button>
      <h1 className="header-title">{title}</h1>
    </div>
  );
};

export default SketchyHeader;
