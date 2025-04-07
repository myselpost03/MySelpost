import React, { useState } from "react";
import Header from "../Components/Header";
import "../Styles/AppSketch.css";
import { supabase } from "../Utils/supabaseClient";

const AppSketch = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "image/jpeg") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Only .jpg files are allowed.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const uniqueName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("sketches") // ✅ replace with your actual bucket name
      .upload(uniqueName, file);

    if (error) {
      console.error("Upload error:", error.message);
      alert("Upload failed!");
    } else {
      const { data } = supabase.storage
        .from("sketches")
        .getPublicUrl(uniqueName);

      setUploadedUrl(data.publicUrl);
    }

    setUploading(false);
  };

  return (
    <>
      <Header />
      <div className="upload-container">
        <h1 className="upload-title">Upload Your Sketch ✏️</h1>

        <div className="upload-box">
          <input
            type="file"
            id="fileUpload"
            accept="image/jpeg"
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

        <button
          className="upload-button"
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Submit Sketch"}
        </button>
      </div>
    </>
  );
};

export default AppSketch;
