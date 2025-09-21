import React from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import i18n from "../i18n";
import "../Styles/Updates.css";

const updatesData = [
  {
    date: i18n.t("date_8"),
    title: i18n.t("title_8"),
    description: i18n.t("description_8"),
  },
  {
    date: i18n.t("date_1"),
    title: i18n.t("title_1"),
    description: i18n.t("description_1"),
  },
  {
    date: i18n.t("date_2"),
    title: i18n.t("title_2"),
    description: i18n.t("description_2"),
  },
  {
    date: i18n.t("date_3"),
    title: i18n.t("title_3"),
    description: i18n.t("description_3"),
  },
  {
    date: i18n.t("date_4"),
    title: i18n.t("title_4"),
    description: i18n.t("description_4"),
  },
  {
    date: i18n.t("date_5"),
    title: i18n.t("title_5"),
    description: i18n.t("description_5"),
  },
  {
    date: i18n.t("date_6"),
    title: i18n.t("title_6"),
    description: i18n.t("description_6"),
  },
  {
    date: i18n.t("date_7"),
    title: i18n.t("title_7"),
    description: i18n.t("description_7"),
  },
];

const Updates = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SketchyHeader title={i18n.t("updates")} onBack={handleBack} />
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
