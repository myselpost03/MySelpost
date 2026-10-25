import React from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import i18n from "../i18n";
import "../Styles/Privacy.css";

const Privacy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SketchyHeader title={i18n.t("privacy")} onBack={handleBack} />
      <div className="privacy-container">
        <div className="privacy-card">
          <h1 className="privacy-title">{i18n.t("privacy_title")}</h1>
          <p className="privacy-text">{i18n.t("privacy_intro")}</p>

          <h2 className="privacy-subtitle">{i18n.t("info_collect_title")}</h2>
          <p className="privacy-text">{i18n.t("info_collect_intro")}</p>
          <ul className="privacy-list">
            <li>
              <strong className="privacy-subtitle">
                {i18n.t("info_user_registration")}
              </strong>{" "}
              {i18n.t("info_user_content")}
            </li>
            <li>
              <strong className="privacy-subtitle">
                {i18n.t("info_sketch_data")}
              </strong>{" "}
          
            </li>
            <li>
              <strong className="privacy-subtitle">
                {i18n.t("info_device_data")}
              </strong>{" "}
            
            </li>
            <li>
              <strong className="privacy-subtitle">
                {i18n.t("info_localstorage")}
              </strong>{" "}
            
            </li>
            <li>
              <strong className="privacy-subtitle">
                {i18n.t("info_usage_data")}
              </strong>{" "}
            </li>
            <li>
              <strong className="privacy-subtitle">
                {i18n.t("info_other")}
              </strong>{" "}

            </li>
          </ul>

          <h2 className="privacy-subtitle">{i18n.t("use_info_title")}</h2>
          <p className="privacy-text">{i18n.t("use_info_intro")}</p>
          <ul className="privacy-list">
            <li>{i18n.t("use_info_list1")}</li>
            <li>{i18n.t("use_info_list2")}</li>
            <li>{i18n.t("use_info_list3")}</li>
            <li>{i18n.t("use_info_list4")}</li>
            <li>{i18n.t("use_info_list5")}</li>
            <li>{i18n.t("use_info_list6")}</li>
          </ul>

          <h2 className="privacy-subtitle">{i18n.t("analytics_title")}</h2>
          <p className="privacy-text">{i18n.t("analytics_text")}</p>

          <h2 className="privacy-subtitle">{i18n.t("age_title")}</h2>
          <p className="privacy-text">{i18n.t("age_text")}</p>

          <h2 className="privacy-subtitle">{i18n.t("ads_title")}</h2>
          <p className="privacy-text">{i18n.t("ads_text")}</p>

          <h2 className="privacy-subtitle">{i18n.t("cookies_title")}</h2>
          <p className="privacy-text">{i18n.t("cookies_text")}</p>

          <h2 className="privacy-subtitle">{i18n.t("retention_title")}</h2>
          <p className="privacy-text">{i18n.t("retention_text")}</p>

          <h2 className="privacy-subtitle">{i18n.t("security_title")}</h2>
          <p className="privacy-text">{i18n.t("security_text")}</p>

          <h2 className="privacy-subtitle">{i18n.t("rights_title")}</h2>
          <p className="privacy-text">{i18n.t("rights_intro")}</p>
          <ul className="privacy-list">
            <li>{i18n.t("rights_list1")}</li>
            <li>{i18n.t("rights_list2")}</li>
            <li>{i18n.t("rights_list3")}</li>
            <li>{i18n.t("rights_list4")}</li>
          </ul>
          <p className="privacy-text">{i18n.t("rights_contact")}</p>

          <h2 className="privacy-subtitle">{i18n.t("third_party_title")}</h2>
          <p className="privacy-text">{i18n.t("third_party_text")}</p>

          <h2 className="privacy-subtitle">{i18n.t("changes_title")}</h2>
          <p className="privacy-text">{i18n.t("changes_text")}</p>

          <h2 className="privacy-subtitle">{i18n.t("contact_title")}</h2>
          <p className="privacy-text">{i18n.t("contact_text")}</p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
