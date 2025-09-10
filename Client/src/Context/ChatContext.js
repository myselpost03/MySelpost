// store/ChatContext.js
import React, { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [inboxUserIds, setInboxUserIds] = useState(new Set());
  const [chattedUserIds, setChattedUserIds] = useState(new Set());

  return (
    <ChatContext.Provider
      value={{ inboxUserIds, setInboxUserIds, chattedUserIds, setChattedUserIds }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatStore = () => useContext(ChatContext);
