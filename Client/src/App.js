import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  ChatList,
  Profile,
  Coins,
} from "./Pages/index";
import { supabase } from "./Utils/supabaseClient";
import SketchyAlert from "./Components/SketchyAlert";

const protectedRoutes = [
  { path: "/prompt", component: Prompt },
  { path: "/app-doodle", component: AppDoodle },
  { path: "/web-doodle", component: WebDoodle },
  { path: "/doodle-example", component: DoodleExample },
  { path: "/chat/:id", component: Chat },
  { path: "/profile/:id", component: Profile },
  { path: "/coins/:id", component: Coins },
];

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/sketch", component: Sketch },
  { path: "/about", component: About },
  { path: "/terms", component: Terms },
  { path: "/privacy", component: Privacy },
  { path: "/contact-us", component: Contact },
  { path: "/pricing", component: Pricing },
  { path: "/chat-list", component: ChatList },
  { path: "/app-sketch", component: AppSketch },
  { path: "/web-sketch", component: WebSketch },
  { path: "/demo", component: Demo },
];

function App() {
  const [alertMessage, setAlertMessage] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) return;

    console.log("🎯 Reward coin interval started");

    const interval = setInterval(async () => {
      try {
        const { error } = await supabase.rpc("increment_reward_coins", {
          user_id_input: storedUser.id,
          increment_by: 3,
        });

        if (error) {
          console.error("❌ RPC update error:", error);
        } else {
          setAlertMessage({
            text: "✅ You got 3 coins for spending an hour.",
            withButton: true,
          });
        }
      } catch (err) {
        console.error("❗ Unexpected RPC error:", err);
      }
    }, 3600000); // 1 hour (use 5000 for testing)

    return () => {
      clearInterval(interval);
      console.log("🧼 Interval cleared");
    };
  }, []);
  return (
    <Router>
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
