import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Assets/logo.png";

const Splash = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [showImage, setShowImage] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate("/chat-list");
    } else {
      navigate("/guest-user");
    }
  }, [currentUser]);
  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      {showImage && (
        <img
          src={Logo}
          alt="Welcome"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
    </div>
  );
};

export default Splash;
