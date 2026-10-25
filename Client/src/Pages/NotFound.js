import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import i18n from "../i18n";
import "../Styles/NotFound.css";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="notfound-container">
        <h1 className="notfound-404">404</h1>
        <h2 className="notfound-title">{i18n.t("pageNotFound")}</h2>
        <p className="notfound-text">{i18n.t("pageMoved")}</p>
        <Link to="/" className="notfound-link">
          {i18n.t("backHome")}
        </Link>
      </div>
    </>
  );
};

export default NotFound;
