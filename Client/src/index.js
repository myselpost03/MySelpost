import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import reportWebVitals from "./reportWebVitals";
import OneSignal from "react-onesignal";
import './i18n.js';

let oneSignalInitialized = false;

async function initOneSignal() {
  if (!oneSignalInitialized) {
    await OneSignal.init({
      appId: "8ef3762d-5350-4d7e-ac13-70870b237852",
      safari_web_id: "web.onesignal.auto.31f2bfbe-48d0-4a72-b7e0-d44022a2d3bb",
      // allowLocalhostAsSecureOrigin: true, // only if testing on localhost
    });
    oneSignalInitialized = true;
    console.log("✅ OneSignal initialized globally");
  }
}

initOneSignal();

const root = ReactDOM.createRoot(document.getElementById("root"));
const clientId =
  "640993908112-cqinh2utr0l1deotsckk0hldghp5oeua.apps.googleusercontent.com";

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
