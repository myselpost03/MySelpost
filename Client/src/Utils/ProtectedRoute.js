import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // If user is logged in, allow access
  if (user) {
    return children;
  }

  // If not, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
