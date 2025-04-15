import React, { useRef, useEffect, useState } from "react";
import {
  FaEraser,
  FaTimes,
  FaUndo,
  FaRedo,
  FaFont,
  FaSave,
  FaPencilAlt,
} from "react-icons/fa";
import { SketchPicker } from "react-color";
import Header from "../Components/Header";
import "../Styles/Doodle.css";
import animation from "../Assets/Animation.json";
import Lottie from "lottie-react";
import { supabase } from "../Utils/supabaseClient";

const Doodle = () => {
  // Canvas and drawing references
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [ctx, setCtx] = useState(null);
  const [modeSelected, setModeSelected] = useState(false); // New state for mode selection
  const [showDoodleAlert, setShowDoodleAlert] = useState(false);
  // Drawing state
  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(4);
  const [isErasing, setIsErasing] = useState(false);
  const [eraserSize, setEraserSize] = useState(20);
  const [showEraserControls, setShowEraserControls] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tool, setTool] = useState("pen"); // 'pen', 'eraser', 'text'
  const [textInput, setTextInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Undo/Redo functionality
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Text tool position
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [showTextInput, setShowTextInput] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!modeSelected) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.75;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineWidth = brushSize;
    context.strokeStyle = color;
    setCtx(context);
    saveCanvasState();
  }, [modeSelected]);

  // Update canvas operations based on tool
  useEffect(() => {
    if (!ctx || !modeSelected) return;

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      canvasRef.current.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${eraserSize}" height="${eraserSize}" viewBox="0 0 ${eraserSize} ${eraserSize}"><rect x="0" y="0" width="${eraserSize}" height="${eraserSize}" fill="white" opacity="0.7" rx="${
        eraserSize / 4
      }" ry="${eraserSize / 4}"/></svg>') ${eraserSize / 2} ${
        eraserSize / 2
      }, auto`;
    } else {
      ctx.globalCompositeOperation = "source-over";
      canvasRef.current.style.cursor = tool === "text" ? "text" : "crosshair";
    }
  }, [tool, eraserSize, ctx, modeSelected]);

  // Handle color change
  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = color;
    }
  }, [color, ctx]);

  // Handle brush size change
  useEffect(() => {
    if (ctx) {
      ctx.lineWidth = brushSize;
    }
  }, [brushSize, ctx]);

  // Save canvas state to history
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();

    setDrawingHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      return newHistory;
    });

    setHistoryIndex((prev) => prev + 1);
  };

  // Undo functionality
  const undo = () => {
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    loadCanvasState(drawingHistory[newIndex]);
  };

  // Redo functionality
  const redo = () => {
    if (historyIndex >= drawingHistory.length - 1) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    loadCanvasState(drawingHistory[newIndex]);
  };

  // Load canvas state from history
  const loadCanvasState = (imageData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    img.src = imageData;
  };

  // Start drawing
  const startDrawing = (e) => {
    if (!modeSelected) return;

    if (tool === "text") {
      const rect = canvasRef.current.getBoundingClientRect();
      setTextPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setShowTextInput(true);
      return;
    }

    isDrawing.current = true;
    ctx.beginPath();

    // Handle pressure sensitivity
    let pressure = 1;
    if (e.pressure !== undefined) {
      pressure = e.pressure;
    } else if (e.touches) {
      // Estimate pressure for touch devices
      const touch = e.touches[0];
      const touchRadius =
        touch.radiusX || touch.radiusY || touch.force * 10 || 1;
      pressure = Math.min(touchRadius / 10, 1);
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth =
      tool === "eraser" ? eraserSize * pressure : brushSize * pressure;
    ctx.moveTo(x - rect.left, y - rect.top);
  };

  // Drawing function
  const draw = (e) => {
    if (!isDrawing.current || !ctx || tool === "text" || !modeSelected) return;

    // Handle pressure sensitivity
    let pressure = 1;
    if (e.pressure !== undefined) {
      pressure = e.pressure;
    } else if (e.touches) {
      const touch = e.touches[0];
      const touchRadius =
        touch.radiusX || touch.radiusY || touch.force * 10 || 1;
      pressure = Math.min(touchRadius / 10, 1);
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth =
      tool === "eraser" ? eraserSize * pressure : brushSize * pressure;
    ctx.lineTo(x - rect.left, y - rect.top);
    ctx.stroke();
  };

  // End drawing
  const endDrawing = () => {
    if (!isDrawing.current || !modeSelected) return;

    isDrawing.current = false;
    saveCanvasState();
  };

  // Clear canvas
  const clearCanvas = () => {
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveCanvasState();
  };

  // Add text to canvas
  const addText = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    ctx.font = `${brushSize * 5}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPosition.x, textPosition.y);

    setShowTextInput(false);
    setTextInput("");
    saveCanvasState();
  };

  const handleSubmitDesign = async () => {
    const canvas = canvasRef.current;

    // Create a temp canvas with background color
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");

    // Fill background
    exportCtx.fillStyle = "#111";
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Draw actual canvas content
    exportCtx.drawImage(canvas, 0, 0);

    // Convert to Blob
    exportCanvas.toBlob(async (blob) => {
      if (!blob) return alert("Failed to export drawing!");

      const fileName = `drawing-${Date.now()}.png`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("doodle")
        .upload(fileName, blob, {
          contentType: "image/png",
        });

      if (error) {
        console.error("Upload error:", error.message);
        setShowDoodleAlert(false);
      } else {
        console.log("Upload success:", data);
        setShowDoodleAlert(true);
      }
    }, "image/png");
  };

  // Export canvas as PNG
  const exportAsPNG = () => {
    const canvas = canvasRef.current;

    // Create a temporary canvas
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");

    // Fill with dark background
    exportCtx.fillStyle = "#111"; // Your desired background color
    exportCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw current canvas onto the export canvas
    exportCtx.drawImage(canvas, 0, 0);

    // Export from the temp canvas
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  // Toggle tool
  const toggleTool = (selectedTool) => {
    setTool(selectedTool);

    // Hide text input when switching away from text tool
    if (tool === "text" && selectedTool !== "text") {
      setShowTextInput(false);
    }

    if (selectedTool === "eraser") {
      setIsErasing(true);
      setShowEraserControls(true);
    } else {
      setIsErasing(false);
      setShowEraserControls(false);
    }
  };

  // Handle mode selection
  const handleModeSelect = () => {
    setModeSelected(true);
  };

  if (!modeSelected) {
    return (
      <div className="doodle-bw-wrapper">
        <Header />
        <div className="mode-selection-container">
          <h2 className="select-mode">Select Mode</h2>
          <div className="mode-buttons">
            <button className="mode-btn" onClick={handleModeSelect}>
              App
            </button>
            <button className="mode-btn" onClick={handleModeSelect}>
              Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doodle-bw-wrapper">
      <Header />

      <div className="canvas-container">
        {!ctx && (
          <div className="centered-animation">
            <Lottie
              animationData={animation}
              loop={true}
              style={{ height: "120px", width: "120px" }}
            />
          </div>
        )}

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

        {/* Text Input Overlay */}
        {showTextInput && (
          <div
            className="text-input-overlay"
            style={{
              left: `${textPosition.x}px`,
              top: `${textPosition.y}px`,
            }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addText()}
              autoFocus
              className="text-input"
            />
            <button onClick={addText} className="text-submit-btn">
              Add
            </button>
          </div>
        )}

        {/* Canvas Controls */}
        <div className="canvas-controls">
          {/* Tool Selection */}

          <div className="tool-buttons">
            <button
              className={`tool-btn ${tool === "pen" ? "active" : ""}`}
              onClick={() => {
                toggleTool("pen");
                setShowTextInput(false); // Additional safeguard
              }}
              title="Pen"
            >
              <FaPencilAlt />
            </button>

            <button
              className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
              onClick={() => {
                toggleTool("eraser");
                setShowTextInput(false); // Additional safeguard
              }}
              title="Eraser"
            >
              <FaEraser />
            </button>

            <button
              className={`tool-btn ${tool === "text" ? "active" : ""}`}
              onClick={() => toggleTool("text")}
              title="Text"
            >
              <FaFont />
            </button>
          </div>

          {/* Color Picker */}
          <div className="color-picker-container">
            <button
              className="color-picker-btn"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Color Picker"
            >
              <div
                className="color-preview"
                style={{ backgroundColor: color }}
              />
            </button>

            {showColorPicker && (
              <div className="color-picker-popup">
                <SketchPicker
                  color={color}
                  onChangeComplete={(color) => {
                    setColor(color.hex);
                    setShowColorPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* Brush Size Controls */}
          <div className="brush-controls">
            <input
              type="range"
              min="1"
              max="50"
              value={tool === "eraser" ? eraserSize : brushSize}
              onChange={(e) =>
                tool === "eraser"
                  ? setEraserSize(parseInt(e.target.value))
                  : setBrushSize(parseInt(e.target.value))
              }
              className="brush-slider"
            />
            <span className="brush-size">
              {tool === "eraser" ? eraserSize : brushSize}px
            </span>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="action-btn"
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Undo"
            >
              <FaUndo />
            </button>

            <button
              className="action-btn"
              onClick={redo}
              disabled={historyIndex >= drawingHistory.length - 1}
              title="Redo"
            >
              <FaRedo />
            </button>

            <button
              className="action-btn"
              onClick={exportAsPNG}
              title="Save as PNG"
            >
              <FaSave />
            </button>

            <button
              className="action-btn clear-btn"
              onClick={clearCanvas}
              title="Clear All"
            >
              <FaTimes />
            </button>
          </div>
          <div className="examples-container">
            <button className="examples-btn">See Examples</button>
            <button
              className="examples-btn"
              style={{ marginTop: "10px" }}
              onClick={handleSubmitDesign}
            >
              Submit Design
            </button>
          </div>
        </div>
      </div>
      {showDoodleAlert && (
        <div className="custom-alert bonus">
          <p>
            <br />
            Your Sketch is submitted successfully! 🎉
          </p>
          <button onClick={() => setShowDoodleAlert(false)}>OK</button>
        </div>
      )}
    </div>
  );
};

export default Doodle;
