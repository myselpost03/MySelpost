import React, { useState, useRef } from "react";
import bannedData from "../JSON/bannedWords.json"; // your JSON with abusiveWords

export default function Demo({ currentUser }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInput(newText);
  };

  const blurWord = (word) => {
    const normalized = word.toLowerCase().replace(/[\s\-.:/]/g, "");
    return bannedData.abusiveWords.some((w) => normalized.includes(w.toLowerCase()));
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          minHeight: "50px",
          background: "#f5f5f5",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        {input.split(/\s+/).map((word, i) => (
          <span
            key={i}
            style={{
              filter: blurWord(word) ? "blur(5px)" : "none",
              marginRight: "4px",
              backgroundColor: blurWord(word) ? "#eee" : "transparent",
              padding: "2px 4px",
              borderRadius: "4px",
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <input
        type="text"
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        placeholder="Type something..."
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "8px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}
