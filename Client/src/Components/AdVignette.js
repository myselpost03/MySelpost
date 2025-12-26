import { useEffect } from "react";

const AdVignette = () => {
  useEffect(() => {
    // Check if ad already shown in this session
    if (sessionStorage.getItem("vignette_shown")) return;

    sessionStorage.setItem("vignette_shown", "true");

    const script = document.createElement("script");
    script.dataset.zone = "10376740";
    script.src = "https://gizokraijaw.net/vignette.min.js";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return null; // No UI
};

export default AdVignette;
