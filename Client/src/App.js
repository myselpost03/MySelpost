import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Sketch from "./Pages/Sketch";
import Example from "./Pages/Example";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sketch" element={<Sketch />} />
        <Route path="/examples" element={<Example />} />
      </Routes>
    </Router>
  );
}

export default App;
