import React, { useState, useMemo } from "react";
import "../Styles/Profile.css";

const Demo = ({ src, totalLikes = 400, rows = 20, cols = 20 }) => {
  const [likes, setLikes] = useState(0);

  // Memoize grid so it's created only once
  const grid = useMemo(() => {
    const tempGrid = [];
    let counter = 0;
    for (let r = rows - 1; r >= 0; r--) {
      if ((rows - r) % 2 === 1) {
        for (let c = 0; c < cols; c++) {
          tempGrid.push({ row: r, col: c, index: counter++ });
        }
      } else {
        for (let c = cols - 1; c >= 0; c--) {
          tempGrid.push({ row: r, col: c, index: counter++ });
        }
      }
    }
    return tempGrid;
  }, [rows, cols]);

  return (
    <div className="mosaic-container">
      <img src={src} alt="Avatar" className="mosaic-image" />
      {grid.map((block) => (
        <div
          key={block.index}
          className="pixel-block"
          style={{
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
            top: `${(block.row * 100) / rows}%`,
            left: `${(block.col * 100) / cols}%`,
            opacity: block.index < likes ? 0 : 1,
            pointerEvents: "none",
            willChange: "opacity",
          }}
        ></div>
      ))}
      <button
        className="like-btn"
        onClick={() => setLikes((prev) => Math.min(prev + 1, totalLikes))}
      >
        ❤️ Like ({likes})
      </button>
    </div>
  );
};

export default Demo;
