import { useEffect, useRef } from "react";

const AdBanner = () => {
  const adRef = useRef(null);

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key': '4849511058af9f3ecf86ed5c6ab215a1',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };
    `;

    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = "https://www.highperformanceformat.com/4849511058af9f3ecf86ed5c6ab215a1/invoke.js";

    if (adRef.current) {
      adRef.current.innerHTML = ""; // Clear if already exists
      adRef.current.appendChild(script1);
      adRef.current.appendChild(script2);
    }
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        width: "728px",
        height: "90px",
        margin: "100px auto 0",
        textAlign: "center",
        overflowX: "hidden"
      }}
    ></div>
  );
};

export default AdBanner;
