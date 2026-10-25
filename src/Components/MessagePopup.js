import React, { useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import i18n from "../i18n";
import "../Styles/MessagePopup.css";

const MessagePopup = ({ onClose }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      // Insert into Supabase
      const { error } = await supabase
        .from("secrets")
        .insert([{ text: message }])
        .select();

      if (!error) {
        toast.success(i18n.t("messageSent"));
        setMessage("");
        onClose();
      }

      if (error) {
        toast.error(i18n.t("messageFailed"));
        console.error(error);
      }
    }
  };

  return (
    <div className="message-popup-overlay" onClick={onClose}>
      <div
        className="message-popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{i18n.t("messageHer")} ✉️</h2>
        <textarea
          className="message-popup-textarea"
          placeholder={i18n.t("typeMessage")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <div className="message-popup-actions">
          <button className="message-cancel-btn" onClick={onClose}>
            {i18n.t("cancel")}
          </button>
          <button
            className="message-send-btn"
            onClick={sendMessage}
            disabled={message.trim() === ""}
            style={{
              opacity: message.trim() === "" ? 0.5 : 1,
              cursor: message.trim() === "" ? "not-allowed" : "pointer",
            }}
          >
            {i18n.t("send")}
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default MessagePopup;
