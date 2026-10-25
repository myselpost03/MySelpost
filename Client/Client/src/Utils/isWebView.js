// utils/isWebView.js
export const isWebView = () => {
  const ua = navigator.userAgent || "";
  const isAndroidWebView = ua.includes("wv");
  const isIOSWebView = /iPhone|iPod|iPad/.test(ua) && !/Safari/.test(ua);

  return window.isReactNativeApp || isAndroidWebView || isIOSWebView;
};
