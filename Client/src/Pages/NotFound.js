import React from "react";
import { Link } from "react-router-dom";
import img from "../Assets/404.png";
import "../Styles/NotFound.css"; 

const NotFound = () => {
  return (
    <div className="notfound-container">
      <img src={img} alt="404 Not Found" className="notfound-image" />
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-text">The page you are looking for doesn’t exist or has been moved.</p>
      <Link to="/" className="notfound-link">Back to Home</Link>
    </div>
  );
};

export default NotFound;
