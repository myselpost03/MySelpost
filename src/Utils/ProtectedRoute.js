import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Not logged in → go to /login
  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }
  // 2. Logged in but incomplete profile → go to /
  {/*if (!user.gender || !user.age) {
    return <Navigate to="/" replace />;
  }*/}

  // 3. All good → allow access
  return children;
};

export default ProtectedRoute;
