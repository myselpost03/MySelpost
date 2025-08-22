import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjUVd-Fk9HXi6xrTtftnZbuiwmoLbml88",
  authDomain: "profile-pics-e1ee3.firebaseapp.com",
  projectId: "profile-pics-e1ee3",
  storageBucket: "profile-pics-e1ee3.firebasestorage.app",
  messagingSenderId: "1022413602244",
  appId: "1:1022413602244:web:8d4b66060a22edc5ce7891"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const IMAGES_DIR = "../avatars"; // Folder where your downloaded images are

async function uploadImages() {
  const files = fs.readdirSync(IMAGES_DIR);

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const base64 = fs.readFileSync(filePath, { encoding: "base64" });
    const dataUrl = `data:image/${path.extname(file).slice(1)};base64,${base64}`;

    await setDoc(doc(db, "images", file), { url: dataUrl });

    console.log(`Uploaded ${file}`);
  }

  console.log("✅ All images uploaded to Firestore");
}

uploadImages();
