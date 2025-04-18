import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEraser,
  FaTimes,
  FaUndo,
  FaRedo,
  FaFont,
  FaSave,
  FaPencilAlt,
  FaSquare,
  FaCircle,
  FaMinus,
} from "react-icons/fa";
import { SketchPicker } from "react-color";
import Header from "../Components/Header";
import "../Styles/Doodle.css";
import { supabase } from "../Utils/supabaseClient";

const AppDoodle = () => {
  // Canvas and drawing references
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [ctx, setCtx] = useState(null);
  const [modeSelected, setModeSelected] = useState(false);
  const [showDoodleAlert, setShowDoodleAlert] = useState(false);

  // Drawing state
  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(4);
  const [isErasing, setIsErasing] = useState(false);
  const [eraserSize, setEraserSize] = useState(20);
  const [showEraserControls, setShowEraserControls] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tool, setTool] = useState("pen"); // 'pen', 'eraser', 'text', 'rectangle', 'circle', 'line'
  const [textInput, setTextInput] = useState("");

  // Shape drawing state
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [previewCanvas, setPreviewCanvas] = useState(null);
  const [appName, setAppName] = useState("");

  // Undo/Redo functionality
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Text tool position
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [showTextInput, setShowTextInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Doodle points state
  const [canSubmit, setCanSubmit] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const lastSubmit = localStorage.getItem("lastSketchSubmit");

    if (lastSubmit) {
      const last = new Date(lastSubmit);
      const now = new Date();
      const daysPassed = Math.floor((now - last) / (1000 * 60 * 60 * 24));

      if (daysPassed >= 15) {
        setCanSubmit(true);
        setMessage("You have 1 sketch point available.");
      } else {
        const daysLeft = 15 - daysPassed;
        setCanSubmit(false);
        setMessage(
          `You used your 1 free sketch point. It will refill in ${daysLeft} day${
            daysLeft > 1 ? "s" : ""
          }.`
        );
      }
    } else {
      // No record, first time user
      setCanSubmit(true);
      setMessage("You have 1 sketch point available.");
    }
  }, []);

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

    // Create a preview canvas
    const preview = document.createElement("canvas");
    preview.width = canvas.width;
    preview.height = canvas.height;
    setPreviewCanvas(preview);

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
      ctx.fillStyle = color;
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

  // Get mouse/touch position
  const getPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top,
    };
  };

  // Start drawing
  const startDrawing = (e) => {
    if (tool === "text") {
      const pos = getPosition(e);
      setTextPosition(pos);
      setShowTextInput(true);
      return;
    }

    const pos = getPosition(e);

    if (["rectangle", "circle", "line"].includes(tool)) {
      setIsDrawingShape(true);
      setStartPos(pos);
      setCurrentPos(pos);
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

    ctx.lineWidth =
      tool === "eraser" ? eraserSize * pressure : brushSize * pressure;
    ctx.moveTo(pos.x, pos.y);
  };
  const drawShape = () => {
    if (!isDrawingShape || !ctx) return;

    // Clear the canvas and redraw the last saved state
    const lastState = new Image();
    lastState.src = drawingHistory[historyIndex];
    lastState.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(lastState, 0, 0);

      // Draw the current shape
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = brushSize;

      const width = currentPos.x - startPos.x;
      const height = currentPos.y - startPos.y;

      switch (tool) {
        case "rectangle":
          ctx.strokeRect(startPos.x, startPos.y, width, height);
          break;
        case "circle":
          const radius = Math.sqrt(width * width + height * height);
          ctx.beginPath();
          ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case "line":
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(currentPos.x, currentPos.y);
          ctx.stroke();
          break;
        default:
          break;
      }
    };
  };

  // Drawing function
  const draw = (e) => {
    if (!modeSelected) return;

    const pos = getPosition(e);

    if (isDrawingShape) {
      setCurrentPos(pos);
      drawShape(); // Call the new shape drawing function
      return;
    }

    if (!isDrawing.current || !ctx || tool === "text") return;

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

    ctx.lineWidth =
      tool === "eraser" ? eraserSize * pressure : brushSize * pressure;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };
  // Draw shape preview

  // End drawing
  const endDrawing = () => {
    if (!modeSelected) return;

    if (isDrawingShape) {
      // Finalize the shape by saving the canvas state
      saveCanvasState();
      setIsDrawingShape(false);
      return;
    }

    if (!isDrawing.current) return;

    isDrawing.current = false;
    saveCanvasState();

    if (!isDrawing.current) return;

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
    if (!canSubmit) return;
    if (isSubmitting) return;
    setIsSubmitting(true);

    const canvas = canvasRef.current;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");

    exportCtx.fillStyle = "#111";
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.drawImage(canvas, 0, 0);

    exportCanvas.toBlob(async (blob) => {
      if (!blob) {
        alert("Failed to export drawing!");
        setIsSubmitting(false);
        return;
      }

      try {
        const path = window.location.pathname
          .split("/")
          .filter(Boolean)
          .join("-");
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
        const email =
          user?.email?.replace(/[^a-zA-Z0-9._]/g, "_") || "anonymous";
        const safeAppName = appName
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "_");

        const fileName = `${path}_${email}_${safeAppName}.png`;

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
      } catch (err) {
        console.error("Error preparing upload:", err);
        alert("Something went wrong. Try again.");
      } finally {
        setIsSubmitting(false);
      }
    }, "image/png");
    localStorage.setItem("lastSketchSubmit", new Date().toISOString());

    setCanSubmit(false);
    setMessage("You used your 1 free doodle point. It will refill in 15 days.");
  };

  // Export canvas as PNG
  const exportAsPNG = () => {
    const canvas = canvasRef.current;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");

    exportCtx.fillStyle = "#111";
    exportCtx.fillRect(0, 0, canvas.width, canvas.height);
    exportCtx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  // Toggle tool
  const toggleTool = (selectedTool) => {
    setTool(selectedTool);

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

    // Cancel any ongoing shape drawing
    if (isDrawingShape) {
      setIsDrawingShape(false);
      // Restore canvas to last saved state
      loadCanvasState(drawingHistory[historyIndex]);
    }
  };

  const handleExample = () => {
    navigate("/doodle-example");
  };

  // Handle mode selection
  const handleModeSelect = () => {
    setModeSelected(true);
  };

  const handleWebMode = () => {
    navigate("/web-doodle");
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
            <button className="mode-btn" onClick={handleWebMode}>
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
                setShowTextInput(false);
              }}
              title="Pen"
            >
              <FaPencilAlt />
            </button>

            <button
              className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
              onClick={() => {
                toggleTool("eraser");
                setShowTextInput(false);
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

            <button
              className={`tool-btn ${tool === "rectangle" ? "active" : ""}`}
              onClick={() => toggleTool("rectangle")}
              title="Rectangle"
            >
              <FaSquare />
            </button>
          </div>

          {/* Color Picker */}
          <div className="color-picker-container">
            <button
              className={`tool-btn ${tool === "circle" ? "active" : ""}`}
              onClick={() => toggleTool("circle")}
              title="Circle"
            >
              <FaCircle />
            </button>

            <button
              className={`tool-btn ${tool === "line" ? "active" : ""}`}
              onClick={() => toggleTool("line")}
              title="Line"
            >
              <FaMinus />
            </button>
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
            <button className="examples-btn" onClick={handleExample}>
              See Example
            </button>

            {canSubmit ? (
              <>
                <div className="app-name-input-container">
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Type Your App Name..."
                    className="app-name-input"
                  />
                </div>
                <button
                  className={`submit-button ${isSubmitting ? "disabled" : ""}`}
                  onClick={handleSubmitDesign}
                  disabled={isSubmitting || !appName.trim()}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </>
            ) : (
              <p className="sketch-wait">{message}</p>
            )}
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

export default AppDoodle;
