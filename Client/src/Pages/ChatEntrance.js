import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatEntrance = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      navigate('/chat-list');
    } else {
      navigate('/guest-user');
    }
  }, [navigate]);

  return null; // or a loading indicator if needed
};

export default ChatEntrance;
