import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useLocation, Routes, Route } from "react-router-dom";
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
import { supabase } from "./Utils/supabaseClient";
import SketchyAlert from "./Components/SketchyAlert";
import InternetStatusAlert from "./Components/InternetStatusAlert";
import FeedbackPopup from "./Components/FeedbackPopup";

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

const useUserStatusSync = () => {
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) return;

    const updateStatus = async (status) => {
      await supabase
        .from("users")
        .update({ status })
        .eq("id", storedUser.id);
    };

    const isOnline =
      location.pathname === "/chat-list" ||
      /^\/chat\/[^/]+$/.test(location.pathname);

    updateStatus(isOnline ? "online" : "offline");

    return () => {
      updateStatus("offline");
    };
  }, [location]);
};


function UserStatusWrapper() {
  useUserStatusSync();
  return null;
}


function App() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) return;

    //console.log("🎯 Reward coin interval started");

    const interval = setInterval(async () => {
      try {
        const { error } = await supabase.rpc("increment_reward_coins", {
          user_id_input: storedUser.id,
          increment_by: 3,
        });

        if (error) {
          //console.error("❌ RPC update error:", error);
        } else {
          setAlertMessage({
            text: "✅ You got 3 coins for spending an hour.",
            withButton: true,
          });
        }
      } catch (err) {
        //console.error("❗ Unexpected RPC error:", err);
      }
    }, 3600000); // 1 hour (use 5000 for testing)

    return () => {
      clearInterval(interval);
      //console.log("🧼 Interval cleared");
    };
  }, []);

   useEffect(() => {
    const hasSubmitted = localStorage.getItem("feedback_submitted");
    if (hasSubmitted === "true") return;

    const lastScheduled = JSON.parse(localStorage.getItem("feedback_schedule")) || {};

    const now = new Date();
    const currentWeek = `${now.getFullYear()}-W${getWeekNumber(now)}`;

    if (lastScheduled.week !== currentWeek) {
      // Set new random time this week
      const randomDate = getRandomTimeThisWeek();
      localStorage.setItem(
        "feedback_schedule",
        JSON.stringify({ week: currentWeek, time: randomDate.toISOString() })
      );
    }

    const schedule = new Date(JSON.parse(localStorage.getItem("feedback_schedule")).time);

    const timeout = schedule - now;
    if (timeout > 0) {
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, timeout);
      return () => clearTimeout(timer);
    } else {
      setShowFeedback(true); // if past scheduled time, show immediately
    }
  }, []);

  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  const getRandomTimeThisWeek = () => {
    const now = new Date();
    const start = new Date(now.setHours(0, 0, 0, 0));
    const end = new Date(start);
    end.setDate(end.getDate() + (7 - end.getDay())); // till Sunday

    const randomTime = new Date(start.getTime() + Math.random() * (end - start));
    return randomTime;
  };

  const handleSubmitSuccess = () => {
    localStorage.setItem("feedback_submitted", "true");
    setShowFeedback(false);
  };


  return (
    <Router>
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
      {showFeedback && <FeedbackPopup onSubmitSuccess={handleSubmitSuccess} />}

      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </Router>
  );
}

export default App;
