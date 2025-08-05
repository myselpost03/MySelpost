import React, { useState, useEffect } from "react";
import "../Styles/Demo.css";

const Demo = () => {
  const [frozenUntil, setFrozenUntil] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const lastVisit = localStorage.getItem("lastVisit");

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit);

      if (!isSameDay(now, lastVisitDate)) {
        // Not visited today, freeze for 10 minutes
        const freezeUntil = new Date(now.getTime() + 10 * 60 * 1000);
        setFrozenUntil(freezeUntil.toLocaleTimeString());
        setIsFrozen(true);

        // Unfreeze after 10 mins
        const timeout = setTimeout(() => {
          setIsFrozen(false);
        }, 10 * 60 * 1000);

        return () => clearTimeout(timeout);
      }
    } else {
      // First time visit
      localStorage.setItem("lastVisit", now.toISOString());
    }

    // Always update last visit
    localStorage.setItem("lastVisit", now.toISOString());
  }, []);

  return (
    <div className="frozen-wrapper">
      <input
        type="text"
        className={`frozen-input ${isFrozen ? "frozen" : ""}`}
        placeholder={isFrozen ? "❄️ Frozen input" : "Type something..."}
        disabled={isFrozen}
      />
      {isFrozen && (
        <>
          <div className="frost-effect" />
          <div className="crack-overlay" />
          <div className="ice-particles">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="freeze-label">❄️ Frozen until {frozenUntil}</div>
        </>
      )}
    </div>
  );
};

export default Demo;
