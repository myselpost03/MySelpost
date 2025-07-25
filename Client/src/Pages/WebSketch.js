import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/AppSketch.css";
import confetti from "canvas-confetti";
import { supabase } from "../Utils/supabaseClient";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";

const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const WebSketch = () => {
  const DAILY_FREE_LIMIT = 1000;

  const [cooldownActive, setCooldownActive] = useState(false);
  const [dailyCapReached, setDailyCapReached] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [showBonusAlert, setShowBonusAlert] = useState(false);
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);
  const [queuePosition, setQueuePosition] = useState(null);
  const [showTrafficMessage, setShowTrafficMessage] = useState(false);
  const [appName, setAppName] = useState("");
  const [creditCost] = useState(5); // Fixed cost for priority
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);
  const [userCredits, setUserCredits] = useState(() => {
    // Initialize credits from localStorage or default to 0
    const storedCredits = localStorage.getItem("userCredits");
    return storedCredits ? parseInt(storedCredits) : 0;
  });
  const [showWhyTwoDaysAlert, setShowWhyTwoDaysAlert] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const now = Date.now();
    const TWENTY_DAYS = 2 * 24 * 60 * 60 * 1000;

    const user = localStorage.getItem("user");
    if (user) {
      const coinTime = localStorage.getItem("coin");
      if (coinTime) {
        const lastUsed = parseInt(coinTime, 10);
        if (now - lastUsed < TWENTY_DAYS) {
          setCooldownActive(true);
          const remaining = new Date(lastUsed + TWENTY_DAYS - now);
          setTimeRemaining(
            `${
              remaining.getUTCDate() - 1
            }d ${remaining.getUTCHours()}h ${remaining.getUTCMinutes()}m`
          );
        } else {
          localStorage.removeItem("coin");
          setCooldownActive(false);
        }
      }
    } else {
      const cookieVal = getCookie("usedFreeSketch");
      if (cookieVal) {
        const lastUsed = parseInt(cookieVal, 10);
        if (now - lastUsed < TWENTY_DAYS) {
          setCooldownActive(true);
          const remaining = new Date(lastUsed + TWENTY_DAYS - now);
          setTimeRemaining(
            `${
              remaining.getUTCDate() - 1
            }d ${remaining.getUTCHours()}h ${remaining.getUTCMinutes()}m`
          );
        } else {
          setCookie("usedFreeSketch", "", -1);
          setCooldownActive(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    const checkDailyCap = async () => {
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();

      // 1. Check how many sketches submitted today
      const { count, error } = await supabase
        .from("sketch_requests")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart);

      if (!error && count >= DAILY_FREE_LIMIT) {
        setDailyCapReached(true);
        setShowTrafficMessage(Math.random() < 0.5); // 50% chance
      } else {
        setDailyCapReached(false);

        // 2. Check if waitlist slot has already been given today
        const { data: metaData, error: metaError } = await supabase
          .from("meta_flags")
          .select("value")
          .eq("key", "last_served")
          .single();

        const lastServedDate = metaData?.value;
        const todayDateStr = new Date().toISOString().split("T")[0];

        if (lastServedDate === todayDateStr) {
          // Already served someone today
          return;
        }

        // 3. Get the first waitlist user (FIFO)
        const { data: waitlistData, error: waitlistError } = await supabase
          .from("waitlist")
          .select("*")
          .order("position", { ascending: true })
          .limit(1);

        if (!waitlistError && waitlistData.length > 0) {
          const nextUser = waitlistData[0];

          // Serve this user (delete them from waitlist)
          await supabase.from("waitlist").delete().eq("id", nextUser.id);

          // 4. Update 'last_served' date
          const { error: updateError } = await supabase
            .from("meta_flags")
            .upsert({ key: "last_served", value: todayDateStr });

          if (updateError) console.error("Meta update failed", updateError);

          // 5. Reorder remaining waitlist
          const { data: remainingWaitlist, error: reorderError } =
            await supabase
              .from("waitlist")
              .select("*")
              .order("position", { ascending: true });

          if (!reorderError && remainingWaitlist.length > 0) {
            const updates = remainingWaitlist.map((user, index) => ({
              id: user.id,
              position: index + 1,
            }));

            const updatePromises = updates.map((u) =>
              supabase
                .from("waitlist")
                .update({ position: u.position })
                .eq("id", u.id)
            );

            await Promise.all(updatePromises);
          }

         // console.log(`Served waitlist user: ${nextUser.email}`);
        }
      }
    };

    checkDailyCap();
  }, []);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      validateEmail(value) ? "" : "Please enter a valid email address."
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Only .jpg and .png files are allowed.");
    }
  };

  const handlePriorityUpgrade = () => {
    setIsProcessingUpgrade(true);

    try {
      // 1. Verify user has enough credits
      if (userCredits < creditCost) {
        alert(`Not enough credits! You need ${creditCost} credits.`);
        setIsProcessingUpgrade(false);
        return;
      }

      // 2. Deduct credits
      const newCredits = userCredits - creditCost;
      setUserCredits(newCredits);
      localStorage.setItem("userCredits", newCredits.toString());

      // 3. Update build priority in localStorage
      const currentBuilds = JSON.parse(
        localStorage.getItem("userBuilds") || []
      );
      const updatedBuilds = currentBuilds.map((build) => ({
        ...build,
        priority: "high",
        status: "processing",
      }));
      localStorage.setItem("userBuilds", JSON.stringify(updatedBuilds));

      // 4. Visual feedback
      confetti({ particleCount: 100, spread: 70 });
      setShowCustomAlert({
        title: "Priority Activated!",
        message: "Your build is now processing with dedicated resources",
        type: "success",
      });

      // 5. Update local state
      setCooldownActive(false);
    } catch (error) {
      alert("Upgrade failed. Please try again.");
      console.error(error);
    } finally {
      setIsProcessingUpgrade(false);
    }
  };

  const handleUpload = async () => {
    if (!file || (!isLoggedIn && (!email || emailError))) return;

    setUploading(true);

    let userEmail = "";
    if (isLoggedIn) {
      const storedUser = localStorage.getItem("user");
      try {
        const parsed = JSON.parse(storedUser);
        userEmail = parsed?.email || "unknown";
      } catch (err) {
        userEmail = "unknown";
      }
    } else {
      userEmail = email;
    }

    const pagePath = window.location.pathname.replace(/[^\w]/g, "_");
    const fileExt = file.name.split(".").pop();
    const safeWebsiteName = appName.replace(/[^\w\s]/gi, "").replace(/\s+/g, "_");
    const uniqueName = `${userEmail}_${pagePath}_${safeWebsiteName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("sketches")
      .upload(uniqueName, file);

    if (uploadError) {
      alert("Upload failed!");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("sketches").getPublicUrl(uniqueName);

    setUploadedUrl(data.publicUrl);
    setShowCustomAlert(true);
    setTimeout(() => setShowCustomAlert(false), 7000);

    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    const now = Date.now();
    if (isLoggedIn) {
      localStorage.setItem("coin", now.toString());
    } else {
      setCookie("usedFreeSketch", now.toString(), 20);
    }

    // ⬇️ Record in DB for global cap
    await supabase.from("sketch_requests").insert([{ user_email: userEmail }]);

    setCooldownActive(true);
    setUploading(false);
  };

  const handleBonusClaim = () => {
    const now = Date.now();

    if (isLoggedIn) {
      const bonusClaimed = localStorage.getItem("bonusCoinClaimed");
      if (!bonusClaimed) {
        localStorage.setItem("coin", now.toString());
        localStorage.setItem("bonusCoinClaimed", "true");
        setCooldownActive(false);
        setShowBonusAlert(true);
        setTimeout(() => setShowBonusAlert(false), 6000);
      }
    } else {
      const bonusCookie = getCookie("bonusCoinClaimed");
      if (!bonusCookie) {
        setCookie("usedFreeSketch", "", -1);
        setCookie("bonusCoinClaimed", "true", 20);
        setCooldownActive(false);
        setShowBonusAlert(true);
        setTimeout(() => setShowBonusAlert(false), 6000);
      }
    }
  };

  const handleJoinWaitlist = async () => {
    let userEmail = isLoggedIn
      ? JSON.parse(localStorage.getItem("user"))?.email || "unknown"
      : email;

    if (!userEmail || (!isLoggedIn && !validateEmail(email))) {
      alert("Please enter a valid email to join the waitlist.");
      return;
    }

    // Check if already in waitlist
    const { data: existingEntry, error: fetchError } = await supabase
      .from("waitlist")
      .select("*")
      .eq("email", userEmail)
      .maybeSingle();

    if (fetchError) {
      alert("Something went wrong while checking the waitlist.");
      return;
    }

    if (existingEntry) {
      setShowCustomAlert(true);
      setJoinedWaitlist(true);
      setQueuePosition(existingEntry.position || existingEntry.id); // fallback
      setTimeout(() => setShowCustomAlert(false), 7000);
      return;
    }

    // Get current count for position
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    const newPosition = (count || 0) + 1;

    const { error } = await supabase
      .from("waitlist")
      .insert([{ email: userEmail, position: newPosition }]);

    if (!error) {
      setJoinedWaitlist(true);
      setQueuePosition(newPosition);
      setShowCustomAlert(true);
      setTimeout(() => setShowCustomAlert(false), 7000);
    } else {
      alert("Failed to join the waitlist.");
    }
  };

  const isFormReady = isLoggedIn
    ? !!file && !!appName && !uploading
    : !!file && validateEmail(email) && !!appName && !uploading;

  return (
    <>
      <Header />
      <div className="upload-container">
        <h1 className="upload-title">Upload Your Website Sketch ✏️</h1>

        <div className="upload-box">
          <input
            type="file"
            id="fileUpload"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            hidden
          />
          <label htmlFor="fileUpload" className="upload-label">
            <p>
              {fileName
                ? `Selected: ${fileName}`
                : "Drag & drop or click to browse"}
            </p>
          </label>
        </div>
        <div className="brutalist-container">
          <input
            placeholder="TYPE HERE"
            className="brutalist-input smooth-type"
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
          <label className="brutalist-label">WEBSITE NAME</label>
        </div>

        {!isLoggedIn && (
          <>
            <input
              type="email"
              className="sketch-input"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="error-text">{emailError}</p>}
          </>
        )}

        {dailyCapReached ? (
          <div className="cooldown-text">
            {joinedWaitlist ? (
              <p>
                ✅ You’ve joined the waitlist! <br />
                Your position: <strong>#{queuePosition}</strong>
              </p>
            ) : showTrafficMessage ? (
              <>
                <p>
                  🚧 The site is getting a lot of traffic right now.
                  <br />
                  Please come back a bit later!
                </p>
                <button
                  onClick={handleJoinWaitlist}
                  className="upload-button"
                  disabled={!isLoggedIn && !validateEmail(email)}
                >
                  Join Waitlist
                </button>
              </>
            ) : (
              <>
                ⛔ Free sketch slots are full for today.
                <br />
                Come back tomorrow, or join the waitlist below:
                <button
                  onClick={handleJoinWaitlist}
                  className="upload-button"
                  disabled={!isLoggedIn && !validateEmail(email)}
                >
                  Join Waitlist
                </button>
              </>
            )}

            <p>
              Or try our{" "}
              <Link to="/prompt" className="link-bold">
                prompt-based builder
              </Link>{" "}
              for faster results.
            </p>
          </div>
        ) : cooldownActive ? (
          <div className="status-card">
            <div className="status-header">
              <div className="status-icon">⏳</div>
              <h3>Your Build Status</h3>
            </div>

            <div className="status-grid">
              <div className="status-item">
                <div className="status-label">Estimated Wait</div>
                <div className="status-value">
                   <p style={{ marginTop: "10px", fontSize: "15px" }}>
                    48 hours {""}
                    <button
                      onClick={() => setShowWhyTwoDaysAlert(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#000000",
                        textDecoration: "underline",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Why?
                    </button>
                  </p>
                </div>
              </div>

              <div className="status-item">
                <div className="status-label">Queue Position</div>
                <div className="status-value">
                  #{queuePosition || "Processing"}
                </div>
              </div>

              <div className="status-item full-width">
                <div className="status-label">System Status</div>
                <div className="status-value">
                  AI processing in queue to prevent overload
                </div>
              </div>
            </div>

            <div className="status-note">
              <p>
                You've used your free sketch point. Available in:{" "}
                <strong>{timeRemaining}</strong>
              </p>
            </div>
            <span className="share-instruction">
              🎁 Claim a bonus sketch point by sharing:
            </span>
            {/*<div className="priority-upgrade">
              <div className="upgrade-header">
                <span className="badge">🚀 Turbo Mode</span>
                <h4>Process Instantly (48 hours → 2 hours)</h4>
              </div>

              <p className="time-comparison">
                <span className="time-option">
                  <span className="time-badge">🐢 Standard</span>
                  <span>48 hours</span>
                </span>

                <span className="arrow">→</span>

                <span className="time-option">
                  <span className="time-badge turbo">⚡ Turbo</span>
                  <span>2 hours</span>
                </span>
              </p>

              <button
                className="upgrade-button"
                onClick={handlePriorityUpgrade}
                disabled={isProcessingUpgrade || userCredits < creditCost}
              >
                {isProcessingUpgrade ? (
                  <span className="loading-spinner"></span>
                ) : (
                  `Speed Up (${creditCost} credits)`
                )}
              </button>

              <div className="benefits-list">
                <div className="benefit-item">
                  <span>⏱️</span> 24x faster processing
                </div>
                <div className="benefit-item">
                  <span>💎</span> Priority cloud container
                </div>
                <div className="benefit-item">
                  <span>📬</span> Instant notifications
                </div>
              </div>
            </div>*/}
            <div className="react-share-buttons">
              <FacebookShareButton
                url="https://myselpost.com/sketch"
                quote="Get your website built from a sketch!"
                onShareWindowClose={handleBonusClaim}
              >
                <button className="share-coin-button">📘 Facebook</button>
              </FacebookShareButton>
              <TwitterShareButton
                url="https://myselpost.com/sketch"
                title="I just got a website built from a hand-drawn sketch. Try it yourself!"
                onShareWindowClose={handleBonusClaim}
              >
                <button className="share-coin-button">🐦 Twitter</button>
              </TwitterShareButton>
              <WhatsappShareButton
                url="https://myselpost.com/sketch"
                title="Build a website from your hand-drawn sketch!"
                separator=":: "
                onShareWindowClose={handleBonusClaim}
              >
                <button className="share-coin-button">🟢 WhatsApp</button>
              </WhatsappShareButton>
              <TelegramShareButton
                url="https://myselpost.com/sketch"
                title="Get your website built from a sketch!"
                onShareWindowClose={handleBonusClaim}
              >
                <button className="share-coin-button">📨 Telegram</button>
              </TelegramShareButton>
            </div>
          </div>
        ) : (
          <button
            className="upload-button"
            disabled={!isFormReady || uploadedUrl !== ""}
            onClick={handleUpload}
          >
            {uploading ? "Uploading..." : "Submit Sketch"}
          </button>
        )}

        {showBonusAlert && (
          <div className="custom-alert bonus">
            <p>
              🎉 You’ve received a <strong>bonus sketch point</strong> for
              sharing!
              <br />
              You can now submit another sketch.
            </p>
            <button onClick={() => setShowBonusAlert(false)}>Awesome 🚀</button>
          </div>
        )}

         {showWhyTwoDaysAlert && (
          <div className="custom-alert info">
            <p>
              🕒 <strong>Why 48 Hours?</strong>
              <br />
              Your website is first built by AI, then reviewed by a human expert to
              ensure everything works smoothly, looks clean, and doesn't include
              anything unsafe, illegal, or inappropriate.
              <br />
            </p>
            <button onClick={() => setShowWhyTwoDaysAlert(false)}>
              Got it 👍
            </button>
          </div>
        )}

        {showCustomAlert && (
          <div className="custom-alert">
            <p>
              {joinedWaitlist
                ? "✅ You have already joined the waitlist!"
                : "⏳ Your sketch will magically turn into a website in 2 days!\nWe'll send updates to your inbox."}
            </p>
            <button onClick={() => setShowCustomAlert(false)}>Okay ✨</button>
          </div>
        )}
      </div>
    </>
  );
};

export default WebSketch;
