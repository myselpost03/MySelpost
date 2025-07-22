import React from 'react';
import '../Styles/Demo.css';

const Demo = () => {
  return (
    <div className="pencil-bg">
      <svg
        className="doodle"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curvy wave */}
        <path
          d="M10 200 Q 50 150, 90 200 T 170 200 T 250 200 T 330 200"
          className="sketch-line"
        />

        {/* Spiral-like swirl */}
        <path
          d="M200 200 
             m -30,0 
             a 30,30 0 1,0 60,0 
             a 30,30 0 1,0 -60,0 
             m 10,0 
             a 20,20 0 1,0 40,0 
             a 20,20 0 1,0 -40,0 
             m 10,0 
             a 10,10 0 1,0 20,0 
             a 10,10 0 1,0 -20,0"
          className="sketch-line"
        />

        {/* Random zig-zag lightning shape */}
        <path
          d="M50 350 L100 300 L130 330 L160 280 L190 310 L220 260 L250 290"
          className="sketch-line"
        />
      </svg>

      <h1 className="sketchy-text">Cool Pencil Doodle Animation</h1>
    </div>
  );
};

export default Demo;
