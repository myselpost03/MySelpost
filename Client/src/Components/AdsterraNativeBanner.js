import { useEffect } from "react";
import '../Styles/Adsterra.css';

export default function AdsterraNativeBanner() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "https://pl27196664.profitablecpmratenetwork.com/61abb6ea6099c52057a640165e20675a/invoke.js";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // cleanup on component unmount
    };
  }, []);

  return (
    <div>
      <div id="container-61abb6ea6099c52057a640165e20675a"></div>
    </div>
  );
}
