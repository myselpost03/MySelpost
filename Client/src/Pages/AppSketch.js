import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import "../Styles/AppSketch.css";
import confetti from "canvas-confetti";
import { supabase } from "../Utils/supabaseClient";

const AppSketch = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      validateEmail(value) ? "" : "Please enter a valid email address."
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Only .jpg and .png files are allowed.");
    }
  };

  const handleUpload = async () => {
    if (!file || (!isLoggedIn && (!email || emailError))) return;

    setUploading(true);

    let userEmail = "";
    if (isLoggedIn) {
      const storedUser = localStorage.getItem("user");
      try {
        const parsed = JSON.parse(storedUser);
        userEmail = parsed?.email || "unknown";
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        userEmail = "unknown";
      }
    } else {
      userEmail = email;
    }

    // Allow only letters, numbers, dot and @ for email in filename
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9.@]/g, "_");
    const fileExt = file.name.split(".").pop();
    const uniqueName = `${sanitizedEmail}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("sketches")
      .upload(uniqueName, file);

    if (error) {
      console.error("Upload error:", error.message);
      alert("Upload failed!");
    } else {
      const { data } = supabase.storage
        .from("sketches")
        .getPublicUrl(uniqueName);

      setUploadedUrl(data.publicUrl);

      setShowCustomAlert(true);
      setTimeout(() => setShowCustomAlert(false), 7000);

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    setUploading(false);
  };

  const isFormReady = isLoggedIn
    ? !!file && !uploading
    : !!file && validateEmail(email) && !uploading;

  return (
    <>
      <Header />
      <div className="upload-container">
        <h1 className="upload-title">Upload Your Sketch ✏️</h1>

        <div className="upload-box">
          <input
            type="file"
            id="fileUpload"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            hidden
          />
          <label htmlFor="fileUpload" className="upload-label">
            <p>
              {fileName
                ? `Selected: ${fileName}`
                : "Drag & drop or click to browse"}
            </p>
          </label>
        </div>

        {!isLoggedIn && (
          <>
            <input
              type="email"
              className="sketch-input"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="error-text">{emailError}</p>}
          </>
        )}

        <button
          className="upload-button"
          disabled={!isFormReady || uploadedUrl !== ""}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Submit Sketch"}
        </button>

        {showCustomAlert && (
          <div className="custom-alert">
            <p>
              ⏳ Your sketch will magically turn into an app in 20 days!
              <br />
              We'll send progress updates straight to your inbox so you can
              follow along.
            </p>
            <button onClick={() => setShowCustomAlert(false)}>Okay ✨</button>
          </div>
        )}
      </div>
    </>
  );
};

export default AppSketch;
