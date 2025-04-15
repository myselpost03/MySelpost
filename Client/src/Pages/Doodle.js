import React, { useRef, useEffect, useState } from 'react';
import Header from "../Components/Header";
import '../Styles/Doodle.css';
import { FaEraser, FaTimes } from 'react-icons/fa';

const Doodle = () => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [ctx, setCtx] = useState(null);
  const [isErasing, setIsErasing] = useState(false);
  const [eraserSize, setEraserSize] = useState(20);
  const [showEraserControls, setShowEraserControls] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.75;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineWidth = 4;
    context.strokeStyle = '#ffffff';
    setCtx(context);

    // Set initial cursor
    canvas.style.cursor = 'crosshair';
  }, []);

  useEffect(() => {
    if (ctx) {
      ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    }
    // Update cursor based on eraser mode
    if (canvasRef.current) {
      canvasRef.current.style.cursor = isErasing ? 
        `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${eraserSize}" height="${eraserSize}" viewBox="0 0 ${eraserSize} ${eraserSize}"><rect x="0" y="0" width="${eraserSize}" height="${eraserSize}" fill="white" opacity="0.7" rx="${eraserSize/4}" ry="${eraserSize/4}"/></svg>') ${eraserSize/2} ${eraserSize/2}, auto` : 
        'crosshair';
    }
  }, [isErasing, eraserSize, ctx]);

  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const endDrawing = () => {
    isDrawing.current = false;
    ctx?.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing.current || !ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = isErasing ? eraserSize : 4;
    ctx.lineTo(x - rect.left, y - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - rect.left, y - rect.top);
  };

  const clearCanvas = () => {
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    setShowEraserControls(!showEraserControls);
  };

  const handleEraserSizeChange = (e) => {
    setEraserSize(parseInt(e.target.value));
  };

  return (
    <div className="doodle-bw-wrapper">
      <Header />
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="bw-canvas"
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={endDrawing}
          onTouchMove={draw}
        />
        <div className="canvas-controls">
          <button 
            className={`eraser-btn ${isErasing ? 'active' : ''}`} 
            onClick={toggleEraser}
            title="Eraser"
          >
            <FaEraser />
          </button>
          
          {showEraserControls && (
            <div className="eraser-controls">
              <input
                type="range"
                min="5"
                max="100"
                value={eraserSize}
                onChange={handleEraserSizeChange}
                className="eraser-slider"
              />
              <span className="eraser-size">{eraserSize}px</span>
            </div>
          )}
          
          <button className="clear-all-btn" onClick={clearCanvas} title="Clear All">
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Doodle;