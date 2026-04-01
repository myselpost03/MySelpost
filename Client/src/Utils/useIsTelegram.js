export const isTelegram = () => {
  if (typeof window === "undefined") return false;

  const tg = window.Telegram?.WebApp;

  return !!(tg && tg.initData && tg.initData.length > 0);
};