import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Sketch from "./Pages/Sketch";
import AppSketch from "./Pages/AppSketch";
import WebSketch from "./Pages/WebSketch";
import Prompt from "./Pages/Prompt";
import Pricing from "./Pages/Pricing";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import ProtectedRoute from "./Utils/ProtectedRoute";
import NotFound from "./Pages/NotFound";
import Doodle from "./Pages/Doodle";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sketch" element={<Sketch />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/app-sketch" element={<AppSketch />} />
        <Route path="/web-sketch" element={<WebSketch />} />
        <Route path="/doodle" element={<Doodle />} />

        {/* ✅ Protected Prompt Route */}
        <Route
          path="/prompt"
          element={
            <ProtectedRoute>
              <Prompt />
            </ProtectedRoute>
          }
        />
        {/* ✅ 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
