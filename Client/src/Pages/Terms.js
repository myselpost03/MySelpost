import React from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import i18n from "../i18n";
import "../Styles/Privacy.css"; // Reusing same CSS for consistency

const Terms = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

return (
  <>
    <SketchyHeader title={i18n.t("terms_header")} onBack={handleBack} />
    <div className="privacy-container">
      <div className="privacy-card">
        <h1 className="privacy-title">{i18n.t("terms_title")}</h1>
        <p className="privacy-text">{i18n.t("terms_intro")}</p>

        <h2 className="privacy-subtitle">{i18n.t("use_service_title")}</h2>
        <p className="privacy-text">{i18n.t("use_service_text")}</p>

        <h2 className="privacy-subtitle">{i18n.t("ugc_title")}</h2>
        <p className="privacy-text">{i18n.t("ugc_text1")}</p>
        <p className="privacy-text">{i18n.t("ugc_text2")}</p>

        <h2 className="privacy-subtitle">{i18n.t("account_title")}</h2>
        <p className="privacy-text">{i18n.t("account_text")}</p>

        <h2 className="privacy-subtitle">{i18n.t("prohibited_title")}</h2>
        <p className="privacy-text">{i18n.t("prohibited_intro")}</p>
        <ul className="privacy-list">
          <li>{i18n.t("prohibited_list1")}</li>
          <li>{i18n.t("prohibited_list2")}</li>
          <li>{i18n.t("prohibited_list3")}</li>
          <li>{i18n.t("prohibited_list4")}</li>
          <li>{i18n.t("prohibited_list5")}</li>
          <li>{i18n.t("prohibited_list6")}</li>
        </ul>

        <h2 className="privacy-subtitle">{i18n.t("ip_title")}</h2>
        <p className="privacy-text">{i18n.t("ip_text")}</p>

        <h2 className="privacy-subtitle">{i18n.t("liability_title")}</h2>
        <p className="privacy-text">{i18n.t("liability_text1")}</p>
        <p className="privacy-text">{i18n.t("liability_text2")}</p>

        <h2 className="privacy-subtitle">{i18n.t("termination_title")}</h2>
        <p className="privacy-text">{i18n.t("termination_text")}</p>

        <h2 className="privacy-subtitle">{i18n.t("changes_title")}</h2>
        <p className="privacy-text">{i18n.t("changes_text")}</p>

        <h2 className="privacy-subtitle">{i18n.t("law_title")}</h2>
        <p className="privacy-text">{i18n.t("law_text")}</p>

        <h2 className="privacy-subtitle">{i18n.t("contact_title")}</h2>
        <p className="privacy-text">{i18n.t("contact_text")}</p>
      </div>
    </div>
  </>
);
};

export default Terms;
