import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import overlay from "../Assets/overlay.png";
import ScratchPopup from "../Components/ScratchPopup";
import QuestionPopup from "../Components/QuestionPopup";
import toast, { Toaster } from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import i18n from "../i18n";
import "../Styles/Demo.css";

const Demo = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [openScratchPostId, setOpenScratchPostId] = useState(null);
  const [openQuestionPostId, setOpenQuestionPostId] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [baseImage, setBaseImage] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionDone, setSelectionDone] = useState(false);
  const [caption, setCaption] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scratches, setScratches] = useState(
    () => parseInt(localStorage.getItem("scratches")) || 30
  );

  const baseCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const overlayImgRef = useRef(null);
  const startPoint = useRef(null);

  const canvasWidth = 300;
  const canvasHeight = 450;

  useEffect(() => {
    const hasSeenToast = localStorage.getItem("seenAllToast");

    if (activeTab === "all" && !hasSeenToast) {
      toast("Swipe left or right to see more posts", {
        id: "swipe-hint", // prevent duplicates
        icon: "ℹ️",
        duration: 6000,
      });

      // Mark as shown so it won't appear again
      localStorage.setItem("seenAllToast", "true");
    }
  }, [activeTab]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (scratches <= 0) {
        toast.error("No scratches left! Swiping is disabled.", {
          duration: 5000,
        });
        return; // prevent swipe
      }
      if (currentIndex < posts.length - 1) setCurrentIndex(currentIndex + 1);
    },
    onSwipedRight: () => {
      if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const timeAgo = (date) => {
    const inputDate = new Date(date + "Z"); // 👈 Ensures it's treated as UTC
    const seconds = Math.floor((new Date() - inputDate) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value >= 1) return `${value}${key[0]} ${i18n.t("ago")}`;
    }

    return i18n.t("justNow");
  };

  useEffect(() => {
    const img = new Image();
    img.src = overlay;
    img.onload = () => (overlayImgRef.current = img);
  }, []);

  useEffect(() => {
    localStorage.setItem("scratches", scratches);
  }, [scratches]);

  useEffect(() => {
    if (!baseImage) return;
    const ctx = baseCanvasRef.current.getContext("2d");
    baseCanvasRef.current.width = canvasWidth;
    baseCanvasRef.current.height = canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(baseImage, 0, 0, canvasWidth, canvasHeight);
    drawOverlay();
  }, [baseImage]);

  const drawOverlay = () => {
    const ctx = overlayCanvasRef.current.getContext("2d");
    overlayCanvasRef.current.width = canvasWidth;
    overlayCanvasRef.current.height = canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (activeTab === "edit" && isSelecting && selection) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        selection.x,
        selection.y,
        selection.width,
        selection.height
      );
    }
  };

  const handleMouseDown = (e) => {
    if (activeTab !== "edit") return;
    setIsSelecting(true);
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    startPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!isSelecting || activeTab !== "edit") return;
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelection({
      x: Math.min(startPoint.current.x, x),
      y: Math.min(startPoint.current.y, y),
      width: Math.abs(x - startPoint.current.x),
      height: Math.abs(y - startPoint.current.y),
    });
    drawOverlay();
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    drawOverlay();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setBaseImage(img);
      setImageSrc(img.src);
      setSelection(null);
      setSelectionDone(false);
      setQuestion("");
      setCaption("");
      setOptions(["", "", "", ""]);
      setAnswerIndex(0);
    };
  };

  const postForUsers = () => {
    if (!selection || !baseImage)
      return toast.error("Select an area first!", { duration: 5000 });
    if (!caption) return toast.error("Enter a caption!");
    if (!question || options.some((o) => o === "")) {
      return toast.error("Set your question and all 4 options!", {
        duration: 5000,
      });
    }

    setPosts([
      {
        id: Date.now(),
        src: imageSrc,
        selection,
        caption,
        question,
        options,
        answerIndex,
        locked: true,
        createdAt: new Date().toISOString(), // 👈 add this
      },
      ...posts,
    ]);

    // Reset editor
    setActiveTab("all");
    setImageSrc(null);
    setBaseImage(null);
    setSelection(null);
    setQuestion("");
    setCaption("");
    setOptions(["", "", "", ""]);
    setAnswerIndex(0);
  };

  const navigate = useNavigate();
  const handleMessageAlert = () => {
    toast.error(
      <div style={{ cursor: "default" }}>
        You have to{" "}
        <span
          style={{
            color: "#F75270",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          log in
        </span>{" "}
        to message her.
      </div>,
      { duration: 5000 }
    );
  };

  return (
    <div className="demo-outer">
      <div className="demo-container">
        <div className="scratch-title-cont">
          <strong className="scratch-title">MISS SCRATCH</strong>
        </div>

        {/* Floating Action Button */}
        {activeTab === "all" && (
          <button className="scratch-fab" onClick={() => setActiveTab("edit")}>
            ＋
          </button>
        )}

        {/* Edit Tab */}
        {activeTab === "edit" && (
          <div>
            <input type="file" accept="image/*" onChange={handleUpload} />
            <div
              className="image-wrapper"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={(e) => handleMouseDown(e.touches[0])}
              onTouchMove={(e) => handleMouseMove(e.touches[0])}
              onTouchEnd={handleMouseUp}
            >
              <canvas ref={baseCanvasRef} className="scratch-canvas" />
              <canvas ref={overlayCanvasRef} className="scratch-canvas" />
            </div>

            {baseImage && !selectionDone && (
              <div className="portion-select-instruction-cont">
                <p className="portion-select-instruction">
                  👉 Select portion of your image by dragging.
                </p>
              </div>
            )}

            {selection && !selectionDone && (
              <button
                style={{ marginTop: "10px" }}
                onClick={() => setSelectionDone(true)}
              >
                Done Selecting
              </button>
            )}

            {selection && selectionDone && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  placeholder="Enter caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter your question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                {options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={options[idx]}
                    onChange={(e) => {
                      const copy = [...options];
                      copy[idx] = e.target.value;
                      setOptions(copy);
                    }}
                  />
                ))}
                <select
                  value={answerIndex}
                  onChange={(e) => setAnswerIndex(Number(e.target.value))}
                >
                  {options.map((_, idx) => (
                    <option key={idx} value={idx}>
                      Correct Answer: Option {idx + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectionDone && (
              <button onClick={postForUsers} style={{ marginTop: "10px" }}>
                Post for All
              </button>
            )}
          </div>
        )}

        {/* Posts Swipe Area */}
        {activeTab === "all" && (
          <div
            {...handlers}
            className="swipe-container"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {posts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              <div
                className="swipe-wrapper"
                style={{
                  display: "flex",
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: "transform 0.3s ease",
                  width: `${posts.length * 100}%`,
                }}
              >
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="swipe-slide"
                    style={{
                      flex: "0 0 100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PostView
                      post={post}
                      overlayImg={overlayImgRef.current}
                      scratches={scratches}
                      setScratches={setScratches}
                      handleMessageAlert={handleMessageAlert}
                      onOpenScratch={() => setOpenScratchPostId(post.id)}
                      onOpenQuestion={() => setOpenQuestionPostId(post.id)}
                      timeAgo={timeAgo} // 👈 pass function
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Popups */}
        {openScratchPostId && (
          <ScratchPopup onClose={() => setOpenScratchPostId(null)} />
        )}

        {openQuestionPostId && (
          <QuestionPopup
            question={posts.find((p) => p.id === openQuestionPostId)?.question}
            options={posts.find((p) => p.id === openQuestionPostId)?.options}
            onClose={() => setOpenQuestionPostId(null)}
            onAnswer={(idx) => {
              const postIndex = posts.findIndex(
                (p) => p.id === openQuestionPostId
              );
              if (postIndex === -1) return;

              const updatedPosts = [...posts];
              const post = updatedPosts[postIndex];

              if (idx === post.answerIndex) {
                post.locked = false;
                post.correctCount = (post.correctCount || 0) + 1; // increment
                post.showFinger = true; // trigger finger animation
                setScratches((prev) => prev - 1);
                toast.success("Correct! You can scratch the image now.");
              } else {
                toast.error("Wrong guess! Try again.");
              }

              setPosts(updatedPosts);
              setOpenQuestionPostId(null);
            }}
          />
        )}

        <Toaster />
      </div>
    </div>
  );
};

// ---------------- PostView ----------------
const PostView = ({
  post,
  overlayImg,
  scratches,
  handleMessageAlert,
  onOpenScratch,
  onOpenQuestion,
  timeAgo,
}) => {
  const baseRef = useRef(null);
  const overlayRef = useRef(null);
  const isScratching = useRef(false);
  const canvasWidth = 300;
  const canvasHeight = 450;
  const [fullReveal, setFullReveal] = useState(false);
  const { correctCount = 0, showFinger = false } = post;

  useEffect(() => {
    localStorage.setItem(`post-${post.id}-correct`, correctCount);
  }, [correctCount, post.id]);

  useEffect(() => {
    const baseCanvas = baseRef.current;
    const baseCtx = baseCanvas.getContext("2d");
    baseCanvas.width = canvasWidth;
    baseCanvas.height = canvasHeight;

    const img = new Image();
    img.src = post.src;
    img.onload = () => {
      baseCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      baseCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    };

    const overlayCanvas = overlayRef.current;
    const ctxOverlay = overlayCanvas.getContext("2d");
    overlayCanvas.width = canvasWidth;
    overlayCanvas.height = canvasHeight;

    if (!overlayImg) return;

    ctxOverlay.clearRect(0, 0, canvasWidth, canvasHeight);
    ctxOverlay.drawImage(overlayImg, 0, 0, canvasWidth, canvasHeight);

    // Initial circular reveal
    const centerX = post.selection.x + post.selection.width / 2;
    const centerY = post.selection.y + post.selection.height / 2;
    const radius = Math.min(post.selection.width, post.selection.height) / 2;

    ctxOverlay.globalCompositeOperation = "destination-out";
    ctxOverlay.beginPath();
    ctxOverlay.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctxOverlay.fill();
    ctxOverlay.globalCompositeOperation = "source-over";
  }, [post, overlayImg]);

  const handleScratch = (e) => {
    if (post.locked) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = overlayRef.current.getContext("2d");

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        className={`image-wrapper ${fullReveal ? "full-reveal" : ""}`}
        style={{ position: "relative" }}
        onMouseDown={() => (isScratching.current = true)}
        onMouseUp={() => (isScratching.current = false)}
        onMouseMove={(e) => isScratching.current && handleScratch(e)}
        onTouchStart={(e) => handleScratch(e.touches[0])}
        onTouchMove={(e) => handleScratch(e.touches[0])}
      >
        {post.createdAt && (
          <div className="scratch-posted-time">{timeAgo(post.createdAt)}</div>
        )}

        <canvas ref={baseRef} className="scratch-canvas" />
        <canvas ref={overlayRef} className="scratch-canvas" />

        {showFinger && (
          <div
            className="finger-animation"
            style={{
              left: post.selection.x + post.selection.width / 2 - 15,
              top: post.selection.y + post.selection.height / 2 - 15,
            }}
          >
            👆
          </div>
        )}

        {post.locked && (
          <button
            style={{
              position: "absolute",
              bottom: "5px",
              left: "5px",
              zIndex: 10,
            }}
            onClick={onOpenQuestion}
            className="answer-question"
          >
            Answer Question
          </button>
        )}
      </div>

      {post.caption && (
        <div className="scratch-first-bottom-cont">
          <strong
            className={`scratch-cap ${post.locked ? "blurred" : "shine"}`}
          >
            {post.caption}
          </strong>
        </div>
      )}

      {/* Bottom Buttons */}
      <div className="scratch-second-bottom-cont">
        <button className="notify-me">Notify Me</button>
        <button className="share-scratch-btn" onClick={handleMessageAlert}>
          Message
        </button>
        <button
          className="scratches-used"
          onClick={() => {
            if (scratches <= 0) {
              toast.error("All scratches used! Come back in 24h.", {
                duration: 5000,
              });

              return;
            }
            onOpenScratch(); // open scratch popup for THIS post
          }}
        >
          {scratches}/30 Scratches
        </button>
      </div>

      <button className="meter-btn">
        ✅ {post.correctCount || 0} Correct Guesses
      </button>
    </div>
  );
};

export default Demo;
