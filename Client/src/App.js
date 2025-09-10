import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useNavigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./Utils/ProtectedRoute";
import {
  Home,
  Register,
  Login,
  ResetPassword,
  Sketch,
  AppSketch,
  WebSketch,
  Updates,
  Notifications,
  Prompt,
  Pricing,
  Secret,
  Settings,
  Roast,
  About,
  Contact,
  Terms,
  Privacy,
  NotFound,
  AppDoodle,
  WebDoodle,
  Chat,
  ChatEntrance,
  GuestUser,
  ChatList,
  Profile,
  Coins,
  PaymentPage,
  Demo,
} from "./Pages/index";
import LoadingSpinner from "./Components/LoadingSpinner";
import { supabase } from "./Utils/supabaseClient";
import SketchyAlert from "./Components/SketchyAlert";
import InternetStatusAlert from "./Components/InternetStatusAlert";
import FeedbackPopup from "./Components/FeedbackPopup";
import { isRunningAsPWA } from "./CheckPWA";
import { trackEvent } from "./Utils/analytics";

const protectedRoutes = [
  { path: "/prompt", component: Prompt },
  { path: "/app-doodle", component: AppDoodle },
  { path: "/web-doodle", component: WebDoodle },
  { path: "/notifications", component: Notifications },
  { path: "/chat/:id", component: Chat },
  { path: "/profile/:id", component: Profile },
  { path: "/coins/:id", component: Coins },
  { path: "/settings", component: Settings },
  { path: "/payments/:id", component: PaymentPage },
];

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/sketch", component: Sketch },
  { path: "/about", component: About },
  { path: "/terms", component: Terms },
  { path: "/roast", component: Roast },
   { path: "/share-secret", component: Secret },
  { path: "/reset-password", component: ResetPassword },
  { path: "/chat-entrance", component: ChatEntrance },
  { path: "/guest-user", component: GuestUser },
  { path: "/privacy-policy", component: Privacy },
  { path: "/updates", component: Updates },
  { path: "/contact-us", component: Contact },
  { path: "/pricing", component: Pricing },
  { path: "/chat-list", component: ChatList },
  { path: "/app-sketch", component: AppSketch },
  { path: "/web-sketch", component: WebSketch },
  { path: "/demo", component: Demo },
];

// Detect mobile
const isMobileDevice = () =>
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const useUserStatusSync = () => {
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.id) return;

    let isUserActive = true;
    let activityTimeout = null;
    let heartbeatInterval = null;

    const updateStatus = async (status) => {
      try {
        await supabase.from("users").update({ status }).eq("id", storedUser.id);
      } catch (err) {
        console.error("Status update failed:", err);
      }
    };

    const setActive = () => {
      isUserActive = true;
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        isUserActive = false;
        updateStatus("offline");
      }, 60000);
      updateStatus("online");
    };

    const interactionEvents = [
      "mousemove",
      "keydown",
      "scroll",
      "click",
      "touchstart",
      "touchmove",
    ];
    interactionEvents.forEach((event) =>
      window.addEventListener(event, setActive)
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateStatus("offline");
      } else {
        setActive();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handlePageHide = () => updateStatus("offline");
    const handlePageShow = () => setActive();
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    heartbeatInterval = setInterval(() => {
      if (isUserActive && document.visibilityState === "visible") {
        updateStatus("online");
      }
    }, 30000);

    const handleUnload = () => updateStatus("offline");
    window.addEventListener("beforeunload", handleUnload);

    const handleStorage = (event) => {
      if (event.key === "user-activity") {
        setActive();
      }
    };
    window.addEventListener("storage", handleStorage);

    const localHeartbeat = setInterval(() => {
      localStorage.setItem("user-activity", Date.now());
    }, 5000);

    setActive();

    return () => {
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, setActive)
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("storage", handleStorage);
      clearTimeout(activityTimeout);
      clearInterval(heartbeatInterval);
      clearInterval(localHeartbeat);
      updateStatus("offline");
    };
  }, []);
};

function UserStatusWrapper() {
  useUserStatusSync();
  return null;
}

function AppContent() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [ready, setReady] = useState(false); 

  useEffect(() => {
    let isDeveloper = false;

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.name === "Shivani") {
        isDeveloper = true;
      }
    } catch (e) {
      // ignore JSON errors
    }

    if (!isDeveloper) {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
      console.info = () => {};
      console.debug = () => {};
    } else {
      console.log("👩‍💻 Developer mode enabled for Developer — logs active");
    }
  }, []);

  useEffect(() => {
    const visibilityChannel = new BroadcastChannel("chat_app_visibility");
    const sendVisibility = () => {
      const isVisible = document.visibilityState === "visible";
      visibilityChannel.postMessage({ visible: isVisible });
    };
    document.addEventListener("visibilitychange", sendVisibility);
    sendVisibility();
    return () => {
      document.removeEventListener("visibilitychange", sendVisibility);
      visibilityChannel.close();
    };
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) return;

    const interval = setInterval(async () => {
      try {
        const { error } = await supabase.rpc("increment_reward_coins", {
          user_id_input: storedUser.id,
          increment_by: 3,
        });
        if (!error) {
          setAlertMessage({
            text: "✅ You got 3 coins for spending an hour.",
            withButton: true,
          });
        }
      } catch {}
    }, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) return;

    if (storedUser && storedUser.id) {
      setUser(storedUser);
    } else {
      setUser(null);
      return;
    }

    const rewardKey = `${storedUser.id}`;

    if (isRunningAsPWA() && !localStorage.getItem(rewardKey)) {
      //console.log("🚀 PWA detected – rewarding 30 coins");

      (async () => {
        try {
          const { error } = await supabase.rpc("increment_reward_coins", {
            user_id_input: storedUser.id,
            increment_by: 30,
          });

          if (error) {
            // console.error("❌ PWA reward error:", error.message);
          } else {
            localStorage.setItem(rewardKey, "true");
            setAlertMessage({
              text: "🎉 App Installed! You got +30 coins.",
              withButton: true,
            });
          }
        } catch (err) {
          // console.error("❗ Unexpected PWA reward error:", err);
        }
      })();
    }
  }, []);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem("feedback_submitted");
    if (hasSubmitted === "true") return;

    const lastShown = localStorage.getItem("last_feedback_shown");
    const now = new Date();

    if (lastShown) {
      const lastDate = new Date(lastShown);
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) return; // Already shown within the past 7 days
    }
    const delayMs = 90 * 1000; // 1 min 30 sec

    const timeout = setTimeout(() => {
      setShowFeedback(true);
      localStorage.setItem("last_feedback_shown", now.toISOString());
    }, delayMs);

    return () => clearTimeout(timeout);
  }, []);

  const handleSubmitSuccess = () => {
    trackEvent({
      action: "button_click",
      category: "Chat List Page",
      label: "Feedback Submission Button",
    });
    localStorage.setItem("feedback_submitted", "true");
    setShowFeedback(false);
  };

  useEffect(() => {
    if (!isMobileDevice()) {
      setReady(true); // render routes normally on desktop
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    // If mobile and user exists, prevent /guest-user access
    if (storedUser?.id && location.pathname === "/guest-user") {
      navigate("/chat-list", { replace: true });
      return;
    }

    // Mobile root "/" redirection
    if (location.pathname === "/") {
      if (!storedUser?.id) {
        navigate("/guest-user", { replace: true });
        return;
      } else {
        navigate("/chat-list", { replace: true });
        return;
      }
    }

    if (storedUser?.id && location.pathname === "/guest-user") {
      navigate("/chat-list", { replace: true });
      return;
    }

    const protectedRoutes = [
      "/chat-list",
      "/chat/:id",
      "/profile/:id",
    ];
    if (!storedUser?.id && protectedRoutes.includes(location.pathname)) {
      navigate("/guest-user", { replace: true });
      return;
    }

    setReady(true); // safe to render routes
  }, [navigate, location.pathname]);

  if (!ready && isMobileDevice() && location.pathname === "/") {
    // Prevent flicker — show nothing or a loader until redirect happens
    return <LoadingSpinner />; // could be <LoadingSpinner /> if you want
  }

  return (
    <>
      <UserStatusWrapper />
      <Routes>
        {publicRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        {protectedRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <InternetStatusAlert />
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
      {showFeedback && (
        <FeedbackPopup
          onSubmitSuccess={handleSubmitSuccess}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
