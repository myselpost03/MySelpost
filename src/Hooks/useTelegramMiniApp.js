import { useEffect, useState } from "react";

export default function useTelegramMiniApp() {
  const [isTMA, setIsTMA] = useState(false);

  useEffect(() => {
    const check = () => {
      const tg = window?.Telegram?.WebApp;

      if (tg && tg.initData && tg.initData.length > 0) {
        setIsTMA(true);
      } else {
        setIsTMA(false);
      }
    };

    // run immediately
    check();

    // run again after Telegram loads WebApp
    const timer = setTimeout(check, 500);

    return () => clearTimeout(timer);
  }, []);

  return isTMA;
}