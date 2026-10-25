import { useEffect, useState } from "react";

const STORAGE_KEY = "message_ad_flow";
const MAX_ADS = 2;

const getToday = () => new Date().toISOString().split("T")[0];

export const useMessageAdFlow = () => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date !== getToday()) {
        return { date: getToday(), count: 0 };
      }
      return parsed;
    }

    return { date: getToday(), count: 0 };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const canShowMessageAd = () => {
    return state.count < MAX_ADS;
  };

  const registerMessageAd = () => {
    setState((prev) => ({
      ...prev,
      count: prev.count + 1,
    }));
  };

  return {
    canShowMessageAd,
    registerMessageAd,
    remaining: MAX_ADS - state.count,
  };
};