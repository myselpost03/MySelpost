import React, { useState, useEffect } from "react";
import { db } from "../Utils/firebaseConfig";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";

export default function Demo() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [totalEgress, setTotalEgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log(
        `Selected file: ${selectedFile.name}, Size: ${selectedFile.size} bytes (${(
          selectedFile.size / 1024
        ).toFixed(2)} KB)`
      );
      setFile(selectedFile);
    }
  };

  const uploadImage = async () => {
    if (!file) return alert("No file selected");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result; // base64 string
      const base64Size = base64Data.length;
      const estimatedBytes = Math.ceil((base64Size * 3) / 4);

      console.log(
        `Uploading image ${file.name} — Base64 length: ${base64Size} chars, Estimated bytes: ${estimatedBytes} bytes (${(
          estimatedBytes / 1024
        ).toFixed(2)} KB)`
      );

      await addDoc(collection(db, "images"), {
        name: file.name,
        data: base64Data,
        createdAt: Date.now(),
      });

      alert("Image uploaded!");
      setFile(null);
      fetchImages(); // refresh
    };
    reader.readAsDataURL(file);
  };


const uploadProfilePicToFirestore = async (file) => {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const base64Data = reader.result;

      try {
        await setDoc(doc(db, filePath), {
          name: fileName,
          data: base64Data,
          createdAt: Date.now(),
        });
        console.log(`Profile pic uploaded at Firestore path: ${filePath}`);
        resolve(filePath);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsDataURL(file);
  });
};


  const fetchImages = async () => {
    const querySnapshot = await getDocs(collection(db, "images"));
    let newImages = [];
    let totalFetchedBytes = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const base64Length = data.data.length;
      const byteSize = Math.ceil((base64Length * 3) / 4);

      totalFetchedBytes += byteSize;

      console.log(
        `Fetched image ${data.name} — Base64 length: ${base64Length} chars, Estimated bytes: ${byteSize} bytes (${(
          byteSize / 1024
        ).toFixed(2)} KB)`
      );

      newImages.push({ id: doc.id, ...data });
    });

    setImages(newImages);

    setTotalEgress((prev) => {
      const newTotal = prev + totalFetchedBytes;
      console.log(
        `Total Egress so far: ${newTotal} bytes (${(newTotal / 1024).toFixed(2)} KB)`
      );
      return newTotal;
    });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Firestore Image Upload & Fetch</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={() => uploadProfilePicToFirestore(file)}>Upload</button>
<h3>
        Total Egress: {totalEgress} bytes ({(totalEgress / 1024).toFixed(2)} KB)
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {images.map((img) => (
          <div key={img.id} style={{ margin: 10 }}>
            <img src={img.data} alt={img.name} width={150} />
            <p>{img.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
