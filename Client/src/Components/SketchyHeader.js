import React from "react";
import "../Styles/SketchyHeader.css";

const SketchyHeader = ({ title, onBack, onBlock, block }) => {
  return (
    <div className="sketchy-header">
      <button className="back-button" onClick={onBack}>
        ←
      </button>
      <h1 className="header-title">{title}</h1>
      <h3 className="block-button" onClick={onBlock}>{block}</h3>
    </div>
  );
};

export default SketchyHeader;
