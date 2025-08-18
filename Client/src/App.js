import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";
import ProtectedRoute from "./Utils/ProtectedRoute";
import {
  Home,
  Register,
  Login,
  Sketch,
  AppSketch,
  WebSketch,
  Prompt,
  Pricing,
  Roast,
  About,
  Contact,
  Terms,
  Privacy,
  NotFound,
  AppDoodle,
  WebDoodle,
  DoodleExample,
  Demo,
  Chat,
  ChatEntrance,
  GuestUser,
  ChatList,
  Profile,
  Coins,
  PaymentPage,
} from "./Pages/index";
import LoadingIndicator from "./Components/LoadingIndicator";
import { supabase } from "./Utils/supabaseClient";
import SketchyAlert from "./Components/SketchyAlert";
import InternetStatusAlert from "./Components/InternetStatusAlert";
import { useLocation } from "react-router-dom";

const protectedRoutes = [
  { path: "/prompt", component: Prompt },
  { path: "/app-doodle", component: AppDoodle },
  { path: "/web-doodle", component: WebDoodle },
  { path: "/doodle-example", component: DoodleExample },
  { path: "/chat/:id", component: Chat },
  { path: "/profile/:id", component: Profile },
  { path: "/coins/:id", component: Coins },
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
  { path: "/chat-entrance", component: ChatEntrance },
  { path: "/guest-user", component: GuestUser },
  { path: "/privacy", component: Privacy },
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
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current path
  const [ready, setReady] = useState(false); // ✅ prevent early render
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
      "/roast",
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
    return <LoadingIndicator />; // could be <LoadingSpinner /> if you want
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
