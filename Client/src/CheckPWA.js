export function isRunningAsPWA() {
  const isStandaloneDisplay =
    window.matchMedia &&
    window.matchMedia("(display-mode: standalone)").matches;

  const isIOSStandalone = typeof window.navigator.standalone === "boolean"
    ? window.navigator.standalone
    : false;

  const isAndroid = /Android/.test(navigator.userAgent);
  const isEdge = /Edg/.test(navigator.userAgent);
  const isChrome = /Chrome/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);

  const isEdgeWindowControls =
    window.matchMedia("(display-mode: window-controls-overlay)").matches;

  // console.log("📱 User Agent:", navigator.userAgent);
  // console.log("🧠 Detected Platform:");
  // if (isIOSStandalone) console.log("✅ iOS in standalone mode");
  // if (isStandaloneDisplay) console.log("✅ Display mode: standalone");
  // if (isEdgeWindowControls) console.log("✅ Edge with window-controls-overlay");
  // if (isAndroid && isChrome) console.log("📲 Android Chrome detected");
  // if (isSafari) console.log("🍏 Safari browser");
  // if (isFirefox) console.log("🦊 Firefox browser");
  // if (isEdge) console.log("🔷 Edge browser");

  const isPWA =
    isIOSStandalone || isStandaloneDisplay || isEdgeWindowControls;

  // console.log(isPWA ? "✅ App is running as a PWA" : "🌐 App is running in a browser");

  return isPWA;
}
