import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import overlay from '../Assets/overlay.png';
import ScratchPopup from '../Components/ScratchPopup';
import QuestionPopup from '../Components/QuestionPopup';
import WrongGuessPopup from '../Components/WrongGuessPopup';
import MessagePopup from '../Components/MessagePopup';
import ComingSoonPopup from '../Components/ComingSoonPopup';
import toast, { Toaster } from 'react-hot-toast';
import { useSwipeable } from 'react-swipeable';
import i18n from '../i18n';
import { supabase } from '../Utils/supabaseClient';
import OneSignal from 'react-onesignal';
import scratchPosts from '../JSON/scratchPosts.json';
import SketchyHeader from '../Components/SketchyHeader';
import '../Styles/MissScratch.css';

const MissScratch = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState(scratchPosts);
  const [openScratchPostId, setOpenScratchPostId] = useState(null);
  const [openQuestionPostId, setOpenQuestionPostId] = useState(null);
  const [wrongPopupPostId, setWrongPopupPostId] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [baseImage, setBaseImage] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionDone, setSelectionDone] = useState(false);
  const [caption, setCaption] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const userItem = localStorage.getItem('user');
  const userId = userItem ? JSON.parse(userItem).id : null;

  const [scratches, setScratches] = useState(200);
  const [loaded, setLoaded] = useState(false); // ✅ prevents overwrite on mount

  const baseCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const overlayImgRef = useRef(null);
  const startPoint = useRef(null);

  const canvasWidth = 300;
  const canvasHeight = 450;
  const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
  const [adWatchedCount, setAdWatchedCount] = useState(
    parseInt(localStorage.getItem('adWatchedCount')) || 0
  );
  const [lastRefill, setLastRefill] = useState(
    userId
      ? null // fetch from DB later
      : parseInt(localStorage.getItem('lastRefill')) || 0
  );
  const [comingSoonPopup, setComingShowPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const adContainerRef = useRef(null);
const [popupSource, setPopupSource] = useState(null);

  useEffect(() => {
    if (!showPopup) return; // exit early if popup isn't shown
    if (!posts[currentIndex]) return;
    if (!adContainerRef.current) return;

    const container = adContainerRef.current;
    container.innerHTML = ''; // safe now
    setAdLoaded(false);
    setShowClose(false);
    setCountdown(3);

    const scriptOptions = document.createElement('script');
    scriptOptions.type = 'text/javascript';
    scriptOptions.innerHTML = `
    atOptions = {
      'key' : '4849511058af9f3ecf86ed5c6ab215a1',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  `;
    const scriptInvoke = document.createElement('script');
    scriptInvoke.type = 'text/javascript';
    scriptInvoke.src =
      '//www.highperformanceformat.com/4849511058af9f3ecf86ed5c6ab215a1/invoke.js';

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector('iframe');
      if (iframe && !adLoaded) {
        setAdLoaded(true);
        observer.disconnect();

        // Countdown
        let timeLeft = 3;
        setCountdown(timeLeft);
        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            setShowClose(true);
          }
        }, 1000);
      }
    });

    observer.observe(container, { childList: true, subtree: true });
    container.appendChild(scriptOptions);
    container.appendChild(scriptInvoke);

    return () => {
      observer.disconnect();
    };
  }, [currentIndex, showPopup, posts]);

  useEffect(() => {
    const openAdHandler = () => setShowPopup(true);

    window.addEventListener('openAd', openAdHandler);

    return () => {
      window.removeEventListener('openAd', openAdHandler);
    };
  }, []);

  const handleDeductScratch = async () => {
    if (!userId) {
      setScratches((prev) => prev - 1); // guest
      return;
    }

    const { error } = await supabase.rpc('decrement_scratches', {
      uid: userId,
    });

    if (error) {
      console.error('Failed to decrement scratches:', error.message);
      toast.error(i18n.t('scratchDeductFailed'));
      return;
    }

    // Optionally fetch updated scratches from DB
    const { data } = await supabase
      .from('users')
      .select('scratches')
      .eq('id', userId)
      .single();

    if (data) setScratches(data.scratches);
  };

  useEffect(() => {
    const now = Date.now();
    const refillScratches = async () => {
      if (userId) {
        // fetch last refill timestamp from DB
        const { data } = await supabase
          .from('users')
          .select('scratches, last_refill')
          .eq('id', userId)
          .single();
        if (!data) return;

        setScratches(data.scratches);
        setLastRefill(data.last_refill || 0);

        if (
          !data.last_refill ||
          now - new Date(data.last_refill).getTime() >= 24 * 3600 * 1000
        ) {
          // refill after 24h
          const { error } = await supabase
            .from('users')
            .update({ scratches: 200, last_refill: new Date().toISOString() })
            .eq('id', userId);
          if (!error) setScratches(200);
        }
      } else {
        // guest
        const last = parseInt(localStorage.getItem('lastRefill')) || 0;
        const scratchesLocal =
          parseInt(localStorage.getItem('scratches')) || 200;

        if (!last || now - last >= 24 * 3600 * 1000) {
          localStorage.setItem('scratches', 200);
          localStorage.setItem('lastRefill', now);
          setScratches(200);
        } else {
          setScratches(scratchesLocal);
        }
        setLastRefill(last);
      }
    };

    refillScratches();
  }, [userId]);

  useEffect(() => {
    const fetchScratches = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('scratches')
          .eq('id', userId)
          .single();

        if (!error && data) setScratches(data.scratches);
      } else {
        setScratches(parseInt(localStorage.getItem('scratches')) || 200);
      }
      setLoaded(true); // ✅ mark done loading
    };

    fetchScratches();
  }, [userId]);

  // ✅ Only update after initial load
  useEffect(() => {
    if (!loaded || scratches === null) return;

    if (userId) {
      const updateScratches = async () => {
        const { error } = await supabase
          .from('users')
          .update({ scratches })
          .eq('id', userId);

        if (error) console.error('Failed to update scratches:', error.message);
      };
      updateScratches();
    } else {
      localStorage.setItem('scratches', scratches);
    }
  }, [scratches, userId, loaded]);

  // --- Toast for swipe hint ---
  useEffect(() => {
    const hasSeenToast = localStorage.getItem('seenAllToast');
    if (activeTab === 'all' && !hasSeenToast) {
      toast(i18n.t('scratchSwipeGuide'), {
        id: 'swipe-hint',
        duration: 6000,
        style: {
          background: 'linear-gradient(45deg, #ffb347, #ffcc33, #ff7e5f)',
          fontFamily: 'Acme',
        },
      });
      localStorage.setItem('seenAllToast', 'true');
    }
  }, [activeTab]);

  const handleAdWatched = async () => {
    if (adWatchedCount >= 5) {
      toast.error(i18n.t('alreadyWatchedEnoughAds'), {
        duration: 4000,
      });
      return;
    }
    if (userId) {
      // logged in → increment via Supabase RPC
      const { error } = await supabase.rpc('increment_scratches_by_5', {
        uid: userId,
      });

      if (error) {
        console.error('Failed to increment scratches:', error.message);
        toast.error(i18n.t('failedToAddScratches'));
        return;
      }

      // fetch new count
      const { data } = await supabase
        .from('users')
        .select('scratches')
        .eq('id', userId)
        .single();

      if (data) {
        setScratches(data.scratches);
        toast.success(i18n.t('scratchesAdded'));
      }
    } else {
      // guest → localStorage
      const current = parseInt(localStorage.getItem('scratches')) || 200;
      const updated = current + 10;
      localStorage.setItem('scratches', updated);
      setScratches(updated);
      toast.success(i18n.t('scratchesAdded'));
    }

    const newCount = adWatchedCount + 1;
    setAdWatchedCount(newCount);
    localStorage.setItem('adWatchedCount', newCount);

    if (newCount >= 5) {
      const refillEndTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('refillEndTime', refillEndTime);
      localStorage.setItem('adWatchedCount', 5);
      setAdWatchedCount(5);
    }
  };
  // --- Viewed Posts Tracking ---
  const getViewedPosts = () => {
    const raw = localStorage.getItem('viewedPosts');
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  const saveViewedPost = (postId) => {
    const viewed = getViewedPosts();
    viewed[postId] = Date.now();
    localStorage.setItem('viewedPosts', JSON.stringify(viewed));
  };

  const filterUnviewedPosts = (allPosts) => {
    const now = Date.now();
    const viewed = getViewedPosts();
    // Remove posts older than 24h
    Object.keys(viewed).forEach((key) => {
      if (now - viewed[key] > 24 * 60 * 60 * 1000) {
        delete viewed[key];
      }
    });
    localStorage.setItem('viewedPosts', JSON.stringify(viewed));

    return allPosts.filter((post) => !viewed[post.id]);
  };

  useEffect(() => {
    // Filter posts on mount
    const unviewedPosts = filterUnviewedPosts(scratchPosts);
    setPosts(unviewedPosts);
    setLoaded(true);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (scratches <= 0) {
        toast.error(i18n.t('noScratchesLeft'), {
          duration: 5000,
        });
        return;
      }
       handleDeductScratch();
      if (currentIndex < posts.length - 1) {
        saveViewedPost(posts[currentIndex].id); // Save current as viewed
        setCurrentIndex(currentIndex + 1);
        setShowPopup(false);
        setAdLoaded(false);
        if (adContainerRef.current) adContainerRef.current.innerHTML = ''; // ✅ safe
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
      setShowPopup(false);
      setAdLoaded(false);
      if (adContainerRef.current) adContainerRef.current.innerHTML = ''; // ✅ safe
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const timeAgo = (date) => {
    const inputDate = new Date(date + 'Z');
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
      if (value >= 1) return `${value}${key[0]} ${i18n.t('ago')}`;
    }
    return i18n.t('justNow');
  };

  const [overlayImg, setOverlayImg] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = overlay;
    img.onload = () => setOverlayImg(img);
  }, []);

  useEffect(() => {
    if (!baseImage) return;
    const ctx = baseCanvasRef.current.getContext('2d');
    baseCanvasRef.current.width = canvasWidth;
    baseCanvasRef.current.height = canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(baseImage, 0, 0, canvasWidth, canvasHeight);
    drawOverlay();
  }, [baseImage]);

  const drawOverlay = () => {
    const ctx = overlayCanvasRef.current.getContext('2d');
    overlayCanvasRef.current.width = canvasWidth;
    overlayCanvasRef.current.height = canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (activeTab === 'edit' && isSelecting && selection) {
      ctx.strokeStyle = 'yellow';
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
    if (activeTab !== 'edit') return;
    setIsSelecting(true);
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    startPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!isSelecting || activeTab !== 'edit') return;
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
      setQuestion('');
      setCaption('');
      setOptions(['', '', '', '']);
      setAnswerIndex(0);
    };
  };

  const postForUsers = () => {
    if (!selection || !baseImage)
      return toast.error(i18n.t('selectAreaFirst'), { duration: 5000 });
    if (!caption) return toast.error(i18n.t('enterCaption'));
    if (!question || options.some((o) => o === '')) {
      return toast.error(i18n.t('setQuestionOptions'), {
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
    setIsMessagePopupOpen(true);
    /*  const user = localStorage.getItem("user");

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
   */
  };

  const scratchFABClick = () => {
    toast(
      <div className="scratch-upload-guide-send">
        {i18n.t('sendUs')} {i18n.t('aRandomMessage')}{' '}
        <span
          className="scratch-upload-guide"
          onClick={() => {
            navigate('/contact-us'); // navigate to your desired route
          }}
        >
          {i18n.t('here')}
        </span>
        {''} {i18n.t('toEnableUploadingPost')}
      </div>,
      {
        icon: 'ℹ️',
        duration: 6000,
        style: {
          padding: '16px',
          color: '#fff',
          background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', // blue gradient
        },
      }
    );
    /*    const user = localStorage.getItem("user");
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
    }*/
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePopupClose = () => {
  setShowPopup(false);
  setAdLoaded(false);
  if (adContainerRef.current) adContainerRef.current.innerHTML = '';
  setShowClose(false);
  setCountdown(3);
  if (window.afterAdCallback) {
    window.afterAdCallback();
    window.afterAdCallback = null;
  }
  if (popupSource === 'scratchMessage') handleMessageAlert();
  setPopupSource(null);
};


  return (
    <>
      <SketchyHeader title="Scratch" onBack={handleBack} />
      <div className="demo-outer">
        <div className="demo-container">
          <div className="scratch-gender-button-container">
            <button className="scratch-gender-button scratch-male">
              {i18n.t('scratchMale')}
            </button>
            <button
              className="scratch-gender-button scratch-female"
              onClick={() => setComingShowPopup(true)}
            >
              {i18n.t('scratchFemale')}
            </button>
          </div>
          <div className="scratch-title-cont">
            <strong className="scratch-title">{i18n.t('missScratch')}</strong>
          </div>

          {/* Floating Action Button */}
          {/*{activeTab === "all" && (
            <button className="scratch-fab" onClick={scratchFABClick}>
              ＋
            </button>
          )}  */}

          {/* Edit Tab */}
          {activeTab === 'edit' && (
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
                    👉 {i18n.t('selectImagePortion')}
                  </p>
                </div>
              )}

              {selection && !selectionDone && (
                <button
                  style={{ marginTop: '10px' }}
                  onClick={() => setSelectionDone(true)}
                >
                  {i18n.t('doneSelecting')}
                </button>
              )}

              {selection && selectionDone && (
                <div style={{ marginTop: '10px' }}>
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
                        {i18n.t('correctAnswerOption')} {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectionDone && (
                <button onClick={postForUsers} style={{ marginTop: '10px' }}>
                  {i18n.t('postForAll')}
                </button>
              )}
            </div>
          )}

          {/* Posts Swipe Area */}
          {activeTab === 'all' && (
            <div
              {...handlers}
              className="swipe-container"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {posts.length === 0 ? (
                <p>No posts yet.</p>
              ) : (
                <div
                  className="swipe-wrapper"
                  style={{
                    display: 'flex',
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: 'transform 0.3s ease',
                    width: `${posts.length * 100}%`,
                  }}
                >
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="swipe-slide"
                      style={{
                        flex: '0 0 100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
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
                        handleDeductScratch={handleDeductScratch} // ✅ pass it explicitly here
                        saveViewedPost={() => saveViewedPost(post.id)}
                        setShowPopup={setShowPopup}
                       setPopupSource={setPopupSource} // ✅ pass it here

                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Popups */}
          {openScratchPostId && scratches === 0 && (
            <ScratchPopup
              onClose={() => setOpenScratchPostId(null)}
              onAdWatched={handleAdWatched}
              adWatchedCount={adWatchedCount}
            />
          )}

          {openQuestionPostId && (
            <QuestionPopup
              question={
                posts.find((p) => p.id === openQuestionPostId)?.question
              }
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
                  post.showFinger = true;

                  if (userId) {
                    const updateCorrectCount = async () => {
                      const { data } = await supabase
                        .from('users')
                        .select('correct_guesses')
                        .eq('id', userId)
                        .single();

                      let newCount = (data?.correct_guesses || 0) + 1;

                      const { error: upError } = await supabase
                        .from('users')
                        .update({ correct_guesses: newCount })
                        .eq('id', userId);

                      if (upError)
                        console.error(
                          'Failed to update correct guesses:',
                          upError.message
                        );
                    };
                    updateCorrectCount();
                  } else {
                    post.correctCount = (post.correctCount || 0) + 1; // guest
                  }

                  if (userId) handleDeductScratch();
                  else setScratches((prev) => prev - 1);

                  toast.success(i18n.t('correctScratchNow'));
                } else {
                  post.wrongAttempt = true;
                  setWrongPopupPostId(post.id); // optional, if you want popup too
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
                    setShowPopup(true);const postIndex = posts.findIndex(p => p.id === wrongPopupPostId);
      if (postIndex === -1) return;
      const updatedPosts = [...posts];

      // Mark showFinger true safely
      updatedPosts[postIndex].showFinger = true;
  window.afterAdCallback = () => {
                      toast.success(i18n.t('correctScratchNow'));

        const postIndex = posts.findIndex(p => p.id === wrongPopupPostId);
        if (postIndex === -1) return;
        const updatedPosts = [...posts];
        updatedPosts[postIndex].locked = false; // unlock scratching
        updatedPosts[postIndex].wrongAttempt = false;
        setPosts(updatedPosts);
      };
                //toast.success("💰 Payment flow goes here"); // replace with real flow
                setWrongPopupPostId(null);
              }}
            />
          )}

          {isMessagePopupOpen && (
            <MessagePopup onClose={() => setIsMessagePopupOpen(false)} />
          )}

          {comingSoonPopup ? (
            <ComingSoonPopup
              show={comingSoonPopup}
              onClose={() => setComingShowPopup(false)}
            />
          ) : null}

          {showPopup && (
            <div className="ad-overlay">
              <div className="ad-popup">
                {/* Countdown or Close Button */}
                {showClose ? (
                  <button className="ad-close-btn" onClick={handlePopupClose}>
                    ✕
                  </button>
                ) : (
                  <div className="countdown-text">Close in {countdown}s</div>
                )}

                {/* Ad Header like real ads */}
                <div className="ad-header">
                  <span className="ad-label">Ad</span>
                  <span className="ad-by">Powered by Adsterra</span>
                </div>

                {/* Ad Area */}
                <div className="ad-wrapper">
                  {!adLoaded && (
                    <div className="loading-text">Loading Ad...</div>
                  )}
                  <div
                    ref={adContainerRef}
                    id="ad-container"
                    style={{
                      visibility: adLoaded ? 'visible' : 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <Toaster />
        </div>
      </div>
    </>
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
  setShowPopup,
  setPopupSource,
  handleDeductScratch, 
  saveViewedPost,
}) => {
  const baseRef = useRef(null);
  const overlayRef = useRef(null);
  const isScratching = useRef(false);
  const canvasWidth = 300;
  const canvasHeight = 450;
  const [fullReveal, setFullReveal] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  // --- Notification & OneSignal ---
  useEffect(() => {
    const isSubscribed =
      localStorage.getItem('notificationsEnabled') === 'true';
    setSubscribed(isSubscribed);
  }, []);

  const handleSubscribe = async () => {
    try {
      await OneSignal.Notifications.requestPermission();
      if (Notification.permission !== 'granted') return;

      await OneSignal.User.PushSubscription.optIn();
      const playerId = OneSignal.User.PushSubscription.id;
      const user = JSON.parse(localStorage.getItem('user'));

      if (user?.id) {
        // Logged-in user
        const { data, error } = await supabase
          .from('players')
          .upsert(
            { player_id: playerId, user_id: user.id },
            { onConflict: 'player_id' }
          );

        if (error) console.error('❌ Error saving player:', error.message);
        else console.log('✅ Player saved in players table:', data);

        // Remove from guestPlayers
        await supabase.from('guestPlayers').delete().eq('player_id', playerId);
      } else {
        // Guest user
        const { error } = await supabase
          .from('guestPlayers')
          .upsert({ player_id: playerId }, { onConflict: 'player_id' });

        if (error)
          console.error('❌ Error saving guest player:', error.message);
        else console.log('✅ Player saved in guestPlayers table');
      }

      localStorage.setItem('notificationsEnabled', 'true');
      setSubscribed(true);
    } catch (err) {
      console.error('❌ Error subscribing for push:', err);
    }
  };

  useEffect(() => {
    if (!overlayImg || !post.src) return;

    const baseCanvas = baseRef.current;
    const overlayCanvas = overlayRef.current;

    baseCanvas.width = canvasWidth;
    baseCanvas.height = canvasHeight;
    overlayCanvas.width = canvasWidth;
    overlayCanvas.height = canvasHeight;

    const baseCtx = baseCanvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');

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

      overlayCtx.globalCompositeOperation = 'destination-out';
      overlayCtx.beginPath();
      overlayCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      overlayCtx.fill();
      overlayCtx.globalCompositeOperation = 'source-over';
    };
  }, [post, overlayImg]);

  const handleScratch = (e) => {
    if (post.locked) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = overlayRef.current.getContext('2d');

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    if (post.showFinger) {
      post.showFinger = false;
    }
  };

  const scratchFABClick = () => {
    toast(
      <div className="scratch-upload-guide-send">
        {i18n.t('sendUs')} {i18n.t('aRandomMessage')}{' '}
        <span
          className="scratch-upload-guide"
          onClick={() => {
            navigate('/contact-us'); // navigate to your desired route
          }}
        >
          {i18n.t('here')}
        </span>
        {''} {i18n.t('toEnableUploadingPost')}
      </div>,
      {
        icon: 'ℹ️',
        duration: 6000,
        style: {
          padding: '16px',
          color: '#fff',
          background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', // blue gradient
        },
      }
    );
    /*    const user = localStorage.getItem("user");
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
    }*/
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        className={`image-wrapper ${fullReveal ? 'full-reveal' : ''}`}
        style={{ position: 'relative' }}
        onMouseDown={() => (isScratching.current = true)}
        onMouseUp={() => (isScratching.current = false)}
        onMouseMove={(e) => isScratching.current && handleScratch(e)}
        onTouchStart={(e) => handleScratch(e.touches[0])}
        onTouchMove={(e) => handleScratch(e.touches[0])}
      >
        {/*{post.createdAt && (
          <div className="scratch-posted-time">{timeAgo(post.createdAt)}</div>
        )} */}
        <div className="scratch-upload-btn" onClick={scratchFABClick}>
          {i18n.t('scratchUpload')}
        </div>

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
            {i18n.t('answerQuestion')}
          </button>
        )}
      </div>

      {post.caption && (
        <div className="scratch-first-bottom-cont">
          <strong
            className={`scratch-cap ${post.locked ? 'blurred' : 'shine'}`}
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
          {i18n.t('notifyMe')}
        </button>
        <button
          className="share-scratch-btn"
          onClick={() => {
    setShowPopup(true);
    setPopupSource('scratchMessage'); // mark the source
  }}
        >
          {i18n.t('scratchMessage')}
        </button>
        <button
          className={scratches > 0 ? 'scratches-used' : 'scratches-get'}
          onClick={() => {
            if (scratches <= 0) {
              toast.error(i18n.t('allScratchesUsed'), {
                duration: 5000,
              });
              onOpenScratch();

              return;
            }
            if (post.locked) {
              toast(i18n.t('answerCorrectToScratch'), {
                icon: '❌',
              });

              if (scratches === 0) {
                onOpenScratch();
              }

              return;
            }
          }}
        >
          {scratches > 0
            ? `${scratches}${i18n.t('scratchCount')}`
            : i18n.t('getScratches')}
        </button>
      </div>

      <button className="meter-btn">
        ✅ {post.correctCount || 0} {i18n.t('correctGuesses')}
      </button>
    </div>
  );
};

export default MissScratch;
