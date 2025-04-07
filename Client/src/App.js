import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Sketch from "./Pages/Sketch";
import AppSketch from './Pages/AppSketch';
import WebSketch from './Pages/WebSketch';
import Prompt from "./Pages/Prompt";
import Pricing from "./Pages/Pricing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/prompt" element={<Prompt />} />
        <Route path="/sketch" element={<Sketch />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/app-sketch" element={<AppSketch />} />
        <Route path="/web-sketch" element={<WebSketch />} />
      </Routes>
    </Router>
  );
}

export default App;
