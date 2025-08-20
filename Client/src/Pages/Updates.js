import React from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Updates.css";

const updatesData = [
  {
    date: "August 20, 2025",
    title: "Google Login Integration",
    description:
      "Sign in quickly and securely using your Google account. No need to create a new password—just one tap and you’re in!",
  },
  {
    date: "August 19, 2025",
    title: "Redesigned Chat Interface",
    description:
      "Enjoy a smoother, more intuitive chat experience with our new layout. Messages are easier to read, conversations load faster, and sending media is now seamless",
  },
  {
    date: "August 18, 2025",
    title: "Heart a Profile Feature",
    description:
      "Show appreciation for a user’s profile by giving it a heart. A simple way to let someone know you like their content or presence on the platform",
  },
  {
    date: "August 10, 2025",
    title: "Performance Improvements",
    description:
      "App load times reduced and animations optimized for smoother experience.",
  },
  {
    date: "August 5, 2025",
    title: "Enhanced Privacy Settings",
    description:
      "Added more granular control for profile visibility and content sharing.",
  },
  {
    date: "July 28, 2025",
    title: "Bug Fixes",
    description:
      "Resolved login issues and fixed intermittent push notification problems.",
  },
];

const Updates = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SketchyHeader title="Updates" onBack={handleBack} />
      <div className="updates-container">
        <div className="updates-grid">
          {updatesData.map((update, index) => (
            <div className="update-card" key={index}>
              <h3 className="update-date">{update.date}</h3>
              <h2 className="update-title">{update.title}</h2>
              <p className="update-description">{update.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Updates;
