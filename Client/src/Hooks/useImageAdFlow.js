import { useEffect, useState } from "react";

const STORAGE_KEY = "image_ad_flow";

const getToday = () => new Date().toISOString().split("T")[0];

const NETWORK_SEQUENCE = [
  "onclicka", "onclicka",
  "adradar", "adradar",
  "gigapub", "gigapub",
  "monetag", "monetag"
];

const MAX_TOTAL_ADS = 10;

export const useImageAdFlow = () => {
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

  const getNextNetwork = () => {
    if (state.count >= MAX_TOTAL_ADS) {
      return null; // 🚫 skip ads
    }

    const index = state.count % NETWORK_SEQUENCE.length;
    return NETWORK_SEQUENCE[index];
  };

  const registerAd = () => {
    setState((prev) => ({
      ...prev,
      count: prev.count + 1,
    }));
  };

  const remainingAds = MAX_TOTAL_ADS - state.count;

  return {
    getNextNetwork,
    registerAd,
    remainingAds,
    totalShown: state.count,
  };
};