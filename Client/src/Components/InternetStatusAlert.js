import React, { useEffect, useState } from "react";
import i18n from "../i18n";
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
        ⚠️ {i18n.t("offline")}
      </div>
    )
  );
};

export default InternetStatusAlert;
