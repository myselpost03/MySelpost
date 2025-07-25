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
