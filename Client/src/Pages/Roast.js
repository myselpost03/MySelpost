import React, { useState, useEffect } from "react";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Roast.css";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import LoadingIndicator from "../Components/LoadingIndicator";
import SketchyAlert from "../Components/SketchyAlert";
import { supabase } from "../Utils/supabaseClient";
import { FaFire } from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import imageCompression from "browser-image-compression";
import bannedWords from "../Utils/bannedWords";
import toast, { Toaster } from "react-hot-toast";
import {
  saveRoastImages,
  getRoastImages,
  setRoastLastSync,
  toBlob,
  getRoastLastSync,
} from "../Utils/db";

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
    if (value >= 1) return `${value}${key[0]} ago`;
  }

  return `Just now`;
};

function Roast() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
const [showSwipeGuide, setShowSwipeGuide] = useState(
  localStorage.getItem("hasSeenSwipeGuide") !== "true"
);
  const [roastingIndex, setRoastingIndex] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullImage, setFullImage] = useState(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [showTopRoastPopup, setShowTopRoastPopup] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSharedRoast, setHasSharedRoast] = useState(
    localStorage.getItem("hasSharedRoast") === "true"
  );
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const toggleFAB = () => {
    if (currentUser) {
      setFabOpen((prev) => !prev);
    } else {
      setAlertMessage({
        text: "You have to log in to access this feature.",
        withButton: true,
      });
    }
  };

  const handleShare = () => {
    if (!hasSharedRoast) {
      setHasSharedRoast(true);
      localStorage.setItem("hasSharedRoast", "true");
    }
  };

  

  const fetchCardsData = async () => {
    setLoading(true);
    try {
      const lastSync = await getRoastLastSync();
      let images = [];

      if (!lastSync) {
        // First-time fetch from Supabase
        const { data, error } = await supabase
          .from("images")
          .select("id, image_url, user_id, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Convert image_url to Blob for IndexedDB
        const imagesWithBlob = await Promise.all(
          data.map(async (img) => {
            try {
              const blob = await toBlob(img.image_url);
              return {
                id: img.id,
                roast_pic: blob || img.image_url,
                created_at: img.created_at,
              };
            } catch (err) {
              console.error("Failed to convert roast image:", img.id, err);
              return {
                id: img.id,
                roast_pic: img.image_url,
                created_at: img.created_at,
              };
            }
          })
        );

        // Save to IndexedDB
        await saveRoastImages(imagesWithBlob);
        await setRoastLastSync(new Date().toISOString());

        images = imagesWithBlob;
      } else {
        // Fetch new images since lastSync
        const { data: newImages, error } = await supabase
          .from("images")
          .select("id, image_url, user_id, created_at")
          .gt("created_at", lastSync)
          .order("created_at", { ascending: false });

        if (error) throw error;

        let newImagesWithBlob = [];
        if (newImages.length) {
          newImagesWithBlob = await Promise.all(
            newImages.map(async (img) => {
              try {
                const blob = await toBlob(img.image_url);
                return {
                  id: img.id,
                  roast_pic: blob || img.image_url,
                  created_at: img.created_at,
                };
              } catch (err) {
                console.error(
                  "Failed to convert new roast image:",
                  img.id,
                  err
                );
                return {
                  id: img.id,
                  roast_pic: img.image_url,
                  created_at: img.created_at,
                };
              }
            })
          );

          await saveRoastImages(newImagesWithBlob);
          await setRoastLastSync(new Date().toISOString());
        }

        // Load all images from IndexedDB and sort by created_at descending
        images = (await getRoastImages()).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }

      // Map to cards with roasts
      const cardsWithRoasts = await Promise.all(
        images.map(async (img) => {
          const { data: roasts } = await supabase
            .from("roasts")
            .select("id, text, user_id")
            .eq("image_id", img.id)
            .order("created_at", { ascending: false });

          const roastsWithVotes = await Promise.all(
            (roasts || []).map(async (r) => {
              const { count } = await supabase
                .from("votes")
                .select("*", { count: "exact", head: true })
                .eq("roast_id", r.id)
                .eq("vote_type", "up");
              return { ...r, votes: count || 0 };
            })
          );

          // Convert Blob to object URL if needed
          let imageUrl = img.roast_pic;
          if (img.roast_pic instanceof Blob) {
            imageUrl = URL.createObjectURL(img.roast_pic);
          }

          return {
            image: imageUrl,
            roasts: roastsWithVotes,
            newRoast: "",
            image_id: img.id,
            created_at: img.created_at,
          };
        })
      );

      setCards(cardsWithRoasts);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Error fetching cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardsData();
  }, []);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  const upvote = async (cardIndex, roastIndex) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.id;
    if (!currentUser) {
      setAlertMessage({
        text: "You have to log in to upvote the roast.",
        withButton: true,
      });
    }
    if (!userId) return;

    const roast = cards[cardIndex].roasts[roastIndex];

    // 1. Check if this user has already voted for this roast
    const { data: existingVote, error: checkError } = await supabase
      .from("votes")
      .select("id")
      .eq("roast_id", roast.id)
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing vote:", checkError);
      return;
    }

    if (existingVote) {
      // User already voted for this roast
      console.log("User has already voted.");
      return;
    }

    // 2. Insert vote if not voted before
    const { error: voteError } = await supabase.from("votes").insert({
      roast_id: roast.id,
      user_id: userId,
      vote_type: "up",
    });

    if (voteError) {
      console.error("Error voting:", voteError);
      return;
    }

    // 3. Update UI
    const updatedCards = [...cards];
    updatedCards[cardIndex].roasts[roastIndex].votes++;
    setCards(updatedCards);

    const btn = document.querySelectorAll(".vote-button")[roastIndex];
    btn.classList.add("fire-animate");
    setTimeout(() => btn.classList.remove("fire-animate"), 400);
  };

  const genericTexts = [
    "hi",
    "hello",
    "hellow",
    "wet",
    "ok",
    "okay",
    "hii",
    "hey",
    "nice",
  ];

  const addRoast = async (cardIndex) => {
    const trimmed = cards[cardIndex].newRoast.trim();
    if (!trimmed) return;
    // Check banned words again before submitting
    const containsBanned = bannedWords.abusiveWords.some((word) =>
      trimmed.toLowerCase().includes(word.toLowerCase())
    );
    if (containsBanned) {
      toast.error("Your roast contains abusive words and cannot be submitted.");
      return;
    }
    const isGeneric = genericTexts.includes(trimmed.toLowerCase());
    if (trimmed.length < 3 || isGeneric) {
      toast.error("⚠ Please write a roast, not a simple greeting.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      setAlertMessage({
        text: "You have to log in to add roast.",
        withButton: true,
      });
    }
    const userId = currentUser?.id;
    if (!userId) return;

    const imageId = cards[cardIndex].image_id;

    // ✅ Check if the user has already roasted this image
    const { data: existingRoast, error: checkError } = await supabase
      .from("roasts")
      .select("id")
      .eq("user_id", userId)
      .eq("image_id", imageId)
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing roast:", checkError);
      return;
    }

    if (existingRoast) {
      setAlertMessage({
        text: "You’ve already roasted this image!",
        withButton: true,
      });
      return;
    }
    setRoastingIndex(cardIndex);
    // ✅ Insert new roast
    const { data, error } = await supabase.from("roasts").insert({
      image_id: imageId,
      user_id: userId,
      text: trimmed,
    });
    setRoastingIndex(null);
    if (error) {
      return;
    }

    const updatedCards = [...cards];
    updatedCards[cardIndex].roasts.push({ text: trimmed, votes: 0 });
    updatedCards[cardIndex].newRoast = "";
    setCards(updatedCards);
  };

  const handleInputChange = (e, cardIndex) => {
    const inputValue = e.target.value;

    const updatedCards = [...cards];
    updatedCards[cardIndex].newRoast = inputValue;
    setCards(updatedCards);
  };

  const handleBack = () => navigate(-1);

  const handleSwipe = (direction) => {
  if (showSwipeGuide) {
    setShowSwipeGuide(false);
    localStorage.setItem("hasSeenSwipeGuide", "true");
  }

  if (direction === "Left" && currentIndex < cards.length - 1) {
    setCurrentIndex(currentIndex + 1);
  } else if (direction === "Right" && currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
  }
};


  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("Left"),
    onSwipedRight: () => handleSwipe("Right"),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.id;
    if (!userId) {
      alert("Please log in to upload.");
      return;
    }

    setUploading(true);

    const CLOUDINARY_UPLOAD_PRESET = "ml_default";
    const CLOUDINARY_CLOUD_NAME = "dzoctpmmi";

    // Compress image to ~80KB
    const compressAndResize = async (file, targetKB = 80) => {
      let quality = 0.9;
      let maxWidthOrHeight = 1000;
      let compressedFile = file;

      for (let i = 0; i < 10; i++) {
        const options = {
          maxSizeMB: targetKB / 1024,
          maxWidthOrHeight,
          initialQuality: quality,
          useWebWorker: true,
        };
        compressedFile = await imageCompression(file, options);
        const sizeKB = compressedFile.size / 1024;
        if (sizeKB <= targetKB) break;
        quality -= 0.1;
        maxWidthOrHeight = Math.floor(maxWidthOrHeight * 0.8);
        if (quality <= 0.1) quality = 0.1;
        file = compressedFile;
      }
      return compressedFile;
    };

    try {
      const compressedFile = await compressAndResize(file, 80);

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Upload to Cloudinary
      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      if (!imageUrl) {
        setAlertMessage({ text: "Upload failed.", withButton: true });
        setUploading(false);
        return;
      }

      // Save URL to Supabase
      const { error: insertErr, data: insertedData } = await supabase
        .from("images")
        .insert({ image_url: imageUrl, user_id: userId })
        .select();

      if (insertErr) {
        console.error("Supabase insert error:", insertErr.message);
        setUploading(false);
        return;
      }

      const newImage = insertedData[0];

      // ✅ Store new image in IndexedDB immediately
      await saveRoastImages([
        {
          id: newImage.id,
          roast_pic: compressedFile,
          created_at: newImage.created_at,
        },
      ]);

      // Update lastSync timestamp
      await setRoastLastSync(new Date().toISOString());

      localStorage.setItem("hasUploadedImage", "true");
      toast.success("Image Uploaded Successfully!");

      // Optionally, append this new image to current cards state
      const updatedCards = [
        {
          image: URL.createObjectURL(compressedFile),
          roasts: [],
          newRoast: "",
          image_id: newImage.id,
          created_at: newImage.created_at,
        },
        ...cards,
      ];
      setCards(updatedCards);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const topRoastData = (() => {
    let top = null;
    cards.forEach((card) =>
      card.roasts.forEach((r) => {
        if (!top || r.votes > top.votes) {
          top = {
            text: r.text,
            votes: r.votes,
            image: card.image,
          };
        }
      })
    );
    return top;
  })();

  if (!cards.length || loading)
    return (
      <div className="roast-page">
        <LoadingIndicator />
      </div>
    );

  return (
    <>
      <SketchyHeader title="Roast 🔥" onBack={handleBack} />

      <div className="roast-page" {...swipeHandlers}>
        <div className="roast-card-container">
{showSwipeGuide && (
  <div className="swipe-guide-animation">
    <div className="swipe-arrow swipe-left">⬅️</div>
    <div className="swipe-text">Swipe to see next roast</div>
    <div className="swipe-arrow swipe-right">➡️</div>
  </div>
)}

          <div
            className={`roast-card animated-card`}
          >
            <div className="roast-image-container">
              {!imageLoaded && <div className="shimmer-overlay"></div>}

              <img
                src={cards[currentIndex].image}
                alt="Roastee"
                className={`roast-image ${imageLoaded ? "visible" : "hidden"}`}
                onLoad={() => setImageLoaded(true)}
                onClick={() => setFullImage(cards[currentIndex].image)}
              />

              <div className="timestamp-glass">
                {timeAgo(cards[currentIndex].created_at)}
              </div>
            </div>

            {/* Sketchy Share Buttons */}
            <div className="sketchy-share-buttons">
              <FacebookShareButton
                url={window.location.href}
                quote="🔥 Check this roast on myselpost!"
                onClick={handleShare}
              >
                <button className="sketchy-share">
                  Facebook{" "}
                  {(count) => (
                    <span className="myShareCountWrapper">{count}</span>
                  )}
                </button>
              </FacebookShareButton>
              <TwitterShareButton
                url={window.location.href}
                title="🔥 Check this roast on myselpost!"
                onClick={handleShare}
              >
                <button className="sketchy-share">
                  Twitter{" "}
                  {(count) => (
                    <span className="myShareCountWrapper">{count}</span>
                  )}
                </button>
              </TwitterShareButton>
              <WhatsappShareButton
                url={window.location.href}
                title="🔥 Check this roast on myselpost!"
                onClick={handleShare}
              >
                <button className="sketchy-share">
                  WhatsApp
                  {(shareCount) => (
                    <span className="myShareCountWrapper">{shareCount}</span>
                  )}
                </button>
              </WhatsappShareButton>
            </div>

            <ul className="roast-list">
              {cards[currentIndex].roasts
                .sort((a, b) => b.votes - a.votes)
                .map((r, i) => (
                  <li key={i} className="roast-item">
                    <span className={r.text.length > 120 ? "long-roast" : ""}>
                      {r.text}
                    </span>
                    <button
                      onClick={() => upvote(currentIndex, i)}
                      className="vote-button"
                      disabled={!currentUser}
                    >
                      🔥 {r.votes}
                    </button>
                  </li>
                ))}
            </ul>
            <div className="input-row">
              <input
                type="text"
                placeholder="Your roast..."
                value={cards[currentIndex].newRoast}
                maxLength={150}
                onChange={(e) => handleInputChange(e, currentIndex)}
                className="roast-input"
                disabled={!currentUser}
              />

              <button
                onClick={() => addRoast(currentIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addRoast(currentIndex);
                  }
                }}
                className="roast-button"
                disabled={!currentUser || roastingIndex === currentIndex}
              >
                {roastingIndex === currentIndex ? "Roasting..." : "Roast!"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        id="upload-input"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {/* Main FAB */}
      <button className="fab-upload" onClick={toggleFAB} title="Actions">
        <FaFire />
      </button>

      {/* Expanding FAB options */}
      {fabOpen && (
        <div className="fab-options">
          <button
            className="fab-option"
            onClick={() => {
              if (!uploading) {
                document.getElementById("upload-input").click();
                setFabOpen(false);
              }
            }}
            disabled={uploading}
            title="Upload"
          >
            {uploading ? "⏳" : "📤"}
          </button>
          <button
            className="fab-option"
            onClick={() => {
              setShowTopRoastPopup(true);
              setFabOpen(false);
            }}
          >
            🔥
          </button>
        </div>
      )}

      {showTopRoastPopup && topRoastData && (
        <div className="top-roast-popup">
          <div className="top-roast-popup-inner">
            <button
              className="close-popup"
              onClick={() => setShowTopRoastPopup(false)}
            >
              ✖
            </button>
            <h3>🔥 Roast of the Day</h3>
            <img
              src={topRoastData.image}
              alt="Top Roast"
              className="top-roast-popup-image"
            />
            <p className="popup-roast-text">{topRoastData.text}</p>
            <span className="popup-roast-votes">🔥 {topRoastData.votes}</span>
          </div>
        </div>
      )}
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
      {fullImage && (
        <div className="full-image-overlay" onClick={() => setFullImage(null)}>
          <img src={fullImage} alt="Full Roast" className="full-image-popup" />
        </div>
      )}
      <Toaster />
    </>
  );
}

export default Roast;
