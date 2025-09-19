import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import overlay from "../Assets/overlay.png";
import ScratchPopup from "../Components/ScratchPopup";
import QuestionPopup from "../Components/QuestionPopup";
import WrongGuessPopup from "../Components/WrongGuessPopup";
import toast, { Toaster } from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import i18n from "../i18n";
import { supabase } from "../Utils/supabaseClient";
import OneSignal from "react-onesignal";
import scratchPosts from "../JSON/scratchPosts.json";
import "../Styles/MissScratch.css";

const MissScratch = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState(scratchPosts);
  const [openScratchPostId, setOpenScratchPostId] = useState(null);
  const [openQuestionPostId, setOpenQuestionPostId] = useState(null);
  const [wrongPopupPostId, setWrongPopupPostId] = useState(null);

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
  const [subscribed, setSubscribed] = useState(false);

  // --- Notification & OneSignal ---
  useEffect(() => {
    const isSubscribed =
      localStorage.getItem("notificationsEnabled") === "true";
    setSubscribed(isSubscribed);
  }, []);

  const handleSubscribe = async () => {
    try {
      await OneSignal.Notifications.requestPermission();
      if (Notification.permission === "granted") {
        await OneSignal.User.PushSubscription.optIn();
        const playerId = OneSignal.User.PushSubscription.id;

        const user = JSON.parse(localStorage.getItem("user"));
        const { data, error } = await supabase
          .from("players")
          .upsert(
            { player_id: playerId, user_id: user?.id },
            { onConflict: "player_id" }
          );

        if (error)
          console.error("? Error saving player to Supabase:", error.message);
        localStorage.setItem("notificationsEnabled", "true");
        setSubscribed(true);
      }
    } catch (err) {
      console.error("? Error subscribing for push:", err);
    }
  };

  // --- Toast for swipe hint ---
  useEffect(() => {
    const hasSeenToast = localStorage.getItem("seenAllToast");
    if (activeTab === "all" && !hasSeenToast) {
      toast(i18n.t("scratchSwipeGuide"), {
        id: "swipe-hint",
        duration: 6000,
      });
      localStorage.setItem("seenAllToast", "true");
    }
  }, [activeTab]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (scratches <= 0) {
        toast.error(i18n.t("noScratchesLeft"), {
          duration: 5000,
        });
        return;
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
    const inputDate = new Date(date + "Z");
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

  const [overlayImg, setOverlayImg] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = overlay;
    img.onload = () => setOverlayImg(img); 
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
      return toast.error(i18n.t("selectAreaFirst"), { duration: 5000 });
    if (!caption) return toast.error(i18n.t("enterCaption"));
    if (!question || options.some((o) => o === "")) {
      return toast.error(i18n.t("setQuestionOptions"), {
        duration: 5000,
      });
    }

    const newPost = {
      id: Date.now(),
      src: imageSrc,
      selection,
      caption,
      question,
      options,
      answerIndex,
      locked: true,
      createdAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
  };

  const navigate = useNavigate();

  const handleMessageAlert = () => {
    const user = localStorage.getItem("user");

    if(user){
      toast.error(i18n.t(""))
    } else{
       toast.error(
      <div style={{ cursor: "default" }}>
        {i18n.t("premiumMessageRequired")}{" "}
        <span
          style={{
            color: "#F75270",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          {i18n.t("logIn")}
        </span>{" "}
       {i18n.t("toMessageHer")}
      </div>,
      { duration: 5000 }
    );
    }
   
  };

  const scratchFABClick = () => {
    const user = localStorage.getItem("user");

    if (user) {
      toast(i18n.t("uploadPostWeek"), {
        icon: "⏳",
        duration: 6000,
      });
    } else {
      toast(i18n.t("guestCannotPost"), {
        icon: "ℹ️",
        duration: 6000,
      });
    }
  };

  return (
    <div className="demo-outer">
      <div className="demo-container">
        <div className="scratch-title-cont">
          <strong className="scratch-title">{i18n.t("missScratch")}</strong>
        </div>

        {/* Floating Action Button */}
        {activeTab === "all" && (
          <button className="scratch-fab" onClick={scratchFABClick}>
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
                  👉 {i18n.t("selectImagePortion")}
                </p>
              </div>
            )}

            {selection && !selectionDone && (
              <button
                style={{ marginTop: "10px" }}
                onClick={() => setSelectionDone(true)}
              >
                {i18n.t("doneSelecting")}
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
                      {i18n.t("correctAnswerOption")} {idx + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectionDone && (
              <button onClick={postForUsers} style={{ marginTop: "10px" }}>
                {i18n.t("postForAll")}
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
                      overlayImg={overlayImg}
                      scratches={scratches}
                      setScratches={setScratches}
                      handleMessageAlert={handleMessageAlert}
                      onOpenScratch={() => setOpenScratchPostId(post.id)}
                      onOpenQuestion={() => setOpenQuestionPostId(post.id)}
                      setWrongPopupPostId={setWrongPopupPostId}
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
                toast.success(i18n.t("correctScratchNow"));
              } else {
                post.wrongAttempt = true;
              }

              setPosts(updatedPosts);
              setOpenQuestionPostId(null);
            }}
          />
        )}

        {wrongPopupPostId && (
          <WrongGuessPopup
            onClose={() => setWrongPopupPostId(null)}
            onAd={() => {
              toast.success("💰 Payment flow goes here"); // replace with real flow
              setWrongPopupPostId(null);
            }}
          />
        )}

        <Toaster />
      </div>
    </div>
  );
};

// ---------------- PostView ----------------
// ---------------- PostView ----------------
const PostView = ({
  post,
  overlayImg,
  scratches,
  handleMessageAlert,
  onOpenScratch,
  onOpenQuestion,
  setWrongPopupPostId,
  timeAgo,
  handleSubscribe,
  subscribed,
}) => {
  const baseRef = useRef(null);
  const overlayRef = useRef(null);
  const isScratching = useRef(false);
  const canvasWidth = 300;
  const canvasHeight = 450;
  const [fullReveal, setFullReveal] = useState(false);

  useEffect(() => {
    if (!overlayImg || !post.src) return;

    const baseCanvas = baseRef.current;
    const overlayCanvas = overlayRef.current;

    baseCanvas.width = canvasWidth;
    baseCanvas.height = canvasHeight;
    overlayCanvas.width = canvasWidth;
    overlayCanvas.height = canvasHeight;

    const baseCtx = baseCanvas.getContext("2d");
    const overlayCtx = overlayCanvas.getContext("2d");

    // Load base image
    const img = new Image();
    img.src = post.src;
    img.onload = () => {
      baseCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      baseCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // Draw overlay immediately
      overlayCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      overlayCtx.drawImage(overlayImg, 0, 0, canvasWidth, canvasHeight);

      // Initial circular reveal
      const centerX = post.selection.x + post.selection.width / 2;
      const centerY = post.selection.y + post.selection.height / 2;
      const radius = Math.min(post.selection.width, post.selection.height) / 2;

      overlayCtx.globalCompositeOperation = "destination-out";
      overlayCtx.beginPath();
      overlayCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      overlayCtx.fill();
      overlayCtx.globalCompositeOperation = "source-over";
    };
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

        {post.showFinger && (
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
            className="answer-question"
            onClick={() => {
              if (post.wrongAttempt) {
                setWrongPopupPostId(post.id);
              } else {
                onOpenQuestion();
              }
            }}
          >
            {i18n.t("answerQuestion")}
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

      <div className="scratch-second-bottom-cont">
        <button
          className="notify-me"
          onClick={handleSubscribe}
          disabled={subscribed}
        >
          {i18n.t("notifyMe")}
        </button>
        <button className="share-scratch-btn" onClick={handleMessageAlert}>
          {i18n.t("scratchMessage")}
        </button>
        <button
          className="scratches-used"
          onClick={() => {
            if (scratches <= 0) {
              toast.error(i18n.t("allScratchesUsed"), {
                duration: 5000,
              });
              return;
            }
            if (post.locked) {
              toast(i18n.t("answerCorrectToScratch"), {
                icon: "❌",
              });
              return;
            }
            onOpenScratch();
          }}
        >
          {scratches}{i18n.t("scratchCount")}
        </button>
      </div>

      <button className="meter-btn">
        ✅ {post.correctCount || 0} {i18n.t("correctGuesses")}
      </button>
    </div>
  );
};

export default MissScratch;
