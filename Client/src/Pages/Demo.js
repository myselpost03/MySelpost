import React, { useEffect, useState } from "react";

function Demo() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://gist.githubusercontent.com/myselpost03/11b01194cf415890dea341c198678293/raw/0930118a8e61b9a7a56b7ef09c84dcf36a1a95b7/data.json")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching JSON:", err));
  }, []);

  return (
    <div>
      <h2>Roasts + Image from Gist</h2>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <img src={item.image} alt="roast" style={{ width: "200px" }} />
          <p>{item.roast1}</p>
          <p>{item.roast2}</p>
          <p>{item.roast3}</p>
        </div>
      ))}
    </div>
  );
}

export default Demo;
