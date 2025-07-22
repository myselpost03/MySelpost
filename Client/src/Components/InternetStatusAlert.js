import React, { useEffect, useState } from "react";
import "../Styles/InternetStatusAlert.css";

const InternetStatusAlert = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    !isOnline && (
      <div className="sketchy-internet-alert">
        ⚠️ You are offline! Check your internet connection.
      </div>
    )
  );
};

export default InternetStatusAlert;
