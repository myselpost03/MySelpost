import { useEffect, useRef } from 'react';
import { useAdController } from './useAdController';
import createAdHandler from 'monetag-tg-sdk';

const REWARDED_INTERSTITIAL_ZONE_ID = '10796508';
const monetagHandler = createAdHandler(REWARDED_INTERSTITIAL_ZONE_ID);

export const useAdManager = (id, currentUserId) => {
  const showOnclickaAd = useRef(null);
  const { canShowAd, registerAdView } = useAdController();

  useEffect(() => {
    // Init Onclicka (rewarded video)
    window
      .initCdTma?.({ id })
      .then((show) => (showOnclickaAd.current = show))
      .catch((e) => console.error('Onclicka Init Failed:', e));
  }, [id]);

  /**
   * 🔥 UNIVERSAL AD TRIGGER
   * @param {Object} options
   * @param {"rewarded" | "interstitial"} options.type
   * @param {Array<string>} options.networks
   */
  const triggerAd = async ({ type = "rewarded", networks = [] } = {}) => {
    // ✅ Default fallback chains
    const fallbackChains = {
      rewarded: ["onclicka", "adradar", "gigapub", "monetag"],
      interstitial: ["monetag", "adradar", "gigapub"], // ❗ no onclicka
    };

    const networkList = networks.length ? networks : fallbackChains[type];

    for (let network of networkList) {
      const check = canShowAd(network);

      // ⛔ Skip if blocked (cooldown / cap)
      if (!check.allowed) continue;

      try {
        let success = false;

        // 🟡 ONCLICKA (rewarded only)
        if (network === "onclicka" && showOnclickaAd.current) {
          await showOnclickaAd.current();
          success = true;
        }

        // 🔵 ADRADAR
        else if (network === "adradar" && window.AdRadar) {
          await new Promise((resolve, reject) => {
            window.AdRadar.showAd({
              adUnitId: '69c8e7b3e13ff2415d0a7b9b',
              onReward: () => resolve(true),
            });

            setTimeout(() => reject("AdRadar timeout"), 7000);
          });
          success = true;
        }

        // 🟣 GIGAPUB
        else if (network === "gigapub" && typeof window.showGiga === 'function') {
          await window.showGiga();
          success = true;
        }

        // 🟢 MONETAG (interstitial)
        else if (network === "monetag") {
          await monetagHandler({ ymid: currentUserId });
          success = true;
        }

        if (success) {
          registerAdView(network);
          return { success: true, network };
        }

      } catch (err) {
        console.warn(`${network} failed → fallback`, err);
        continue;
      }
    }

    // 🚫 All networks failed or capped
    return { success: false, reason: "all_failed" };
  };

  return { triggerAd };
};