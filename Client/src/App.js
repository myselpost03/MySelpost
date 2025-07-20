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
  Demo,
  Chat,
  ChatList,
  Profile,
} from "./Pages/index";

const protectedRoutes = [
  { path: "/prompt", component: Prompt },
  { path: "/app-doodle", component: AppDoodle },
  { path: "/web-doodle", component: WebDoodle },
  { path: "/doodle-example", component: DoodleExample },
  { path: "/chat/:id", component: Chat },
  { path: "/profile/:id", component: Profile },
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
    </Router>
  );
}

export default App;
