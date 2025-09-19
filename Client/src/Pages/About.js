import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Privacy.css"; // Reuse same CSS for consistency

const About = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SketchyHeader title={t("aboutUs")} onBack={handleBack} />
      <div className="privacy-container">
        <div className="privacy-card">
          <p className="privacy-text">{t("welcome_text")}</p>

          <p className="privacy-text">{t("desktop_mobile_text")}</p>

          <h2 className="privacy-subtitle">{t("mission_title")}</h2>
          <p className="privacy-text">{t("mission_text")}</p>

          <p className="privacy-text">{t("empowerment_text")}</p>

          <h2 className="privacy-subtitle">{t("offer_title")}</h2>
          <ul className="privacy-list">
            <li>
              <strong>
                {t("offer_social_title", "Social Networking Features:")}
              </strong>{" "}
              {t("offer_social")}
            </li>
            <li>
              <strong>
                {t("offer_community_title", "Community Engagement:")}
              </strong>{" "}
              {t("offer_community")}
            </li>
            <li>
              <strong>
                {t("offer_sketch_title", "Sketch-to-App Builder Tool:")}
              </strong>{" "}
              {t("offer_sketch")}
            </li>
            <li>
              <strong>
                {t("offer_creative_title", "Creative Empowerment:")}
              </strong>{" "}
              {t("offer_creative")}
            </li>
            <li>
              <strong>
                {t("offer_privacy_title", "Privacy and Control:")}
              </strong>{" "}
              {t("offer_privacy")}
            </li>
          </ul>

          <h2 className="privacy-subtitle">{t("values_title")}</h2>
          <p className="privacy-text">{t("values_text")}</p>
          <p className="privacy-text">{t("values_creators")}</p>

          <h2 className="privacy-subtitle">{t("why_choose_title")}</h2>
          <p className="privacy-text">{t("why_choose_text")}</p>
          <p className="privacy-text">{t("why_choose_text2")}</p>

          <h2 className="privacy-subtitle">{t("contact_title")}</h2>
          <p className="privacy-text">{t("contact_text1")}</p>
          <p className="privacy-text">{t("contact_text2")}</p>
        </div>
      </div>
    </>
  );
};

export default About;
