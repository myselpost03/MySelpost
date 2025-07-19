import React from "react";
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
  FirstUserSketch,
  Chat,
  ChatList,
} from "./Pages/index";

const protectedRoutes = [
  { path: "/prompt", component: Prompt },
  { path: "/app-doodle", component: AppDoodle },
  { path: "/web-doodle", component: WebDoodle },
  //  { path: "/chat", component: Chat },
  { path: "/doodle-example", component: DoodleExample },
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
  { path: "/chat", component: Chat },
  { path: "/pricing", component: Pricing },
  { path: "/chat-list", component: ChatList },
  { path: "/app-sketch", component: AppSketch },
  { path: "/web-sketch", component: WebSketch },
  { path: "/first-user-sketch", component: FirstUserSketch },
];

function App() {
  return (
    <Router>
      <Routes>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}

        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                <route.component />
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
