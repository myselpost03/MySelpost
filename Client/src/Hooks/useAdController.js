import { useEffect, useState } from "react";

const MAX_ADS_PER_NETWORK = 18;
const COOLDOWN_MS = 60 * 1000; // 1 minute

const STORAGE_KEY = "global_ad_control";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const useAdController = () => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      // Reset if new day
      if (parsed.date !== getTodayDate()) {
        return {
          date: getTodayDate(),
          lastAdTimestamp: 0,
          counts: {},
        };
      }

      return parsed;
    }

    return {
      date: getTodayDate(),
      lastAdTimestamp: 0,
      counts: {},
    };
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // ✅ Check if ad is allowed
  const canShowAd = (network) => {
    const now = Date.now();

    // Cooldown check
    if (now - state.lastAdTimestamp < COOLDOWN_MS) {
      return {
        allowed: false,
        reason: "cooldown",
      };
    }

    // Count check
    const count = state.counts[network] || 0;
    if (count >= MAX_ADS_PER_NETWORK) {
      return {
        allowed: false,
        reason: "limit",
      };
    }

    return { allowed: true };
  };

  // ✅ Call after successful ad
  const registerAdView = (network) => {
    setState((prev) => ({
      ...prev,
      lastAdTimestamp: Date.now(),
      counts: {
        ...prev.counts,
        [network]: (prev.counts[network] || 0) + 1,
      },
    }));
  };

  // Optional helpers
  const getRemainingAds = (network) => {
    return MAX_ADS_PER_NETWORK - (state.counts[network] || 0);
  };

  const getCooldownRemaining = () => {
    const diff = Date.now() - state.lastAdTimestamp;
    return Math.max(0, COOLDOWN_MS - diff);
  };

  return {
    canShowAd,
    registerAdView,
    getRemainingAds,
    getCooldownRemaining,
  };
};