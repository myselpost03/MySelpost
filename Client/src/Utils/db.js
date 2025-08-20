// db.js
import { openDB } from "idb";

export const dbPromise = openDB("UserDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("profile_pics")) {
      db.createObjectStore("profile_pics", { keyPath: "id" });
    }
  },
});

// IndexedDB setup
export const getDB = async () => {
  return openDB("UsersDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta"); // store lastSync timestamp
      }
    },
  });
};

// Convert image URL to Blob
export const toBlob = async (url) => {
  try {
    const res = await fetch(url);
    return await res.blob(); // returns original size Blob
  } catch (err) {
    console.error("❌ Failed to fetch image as Blob:", err);
    return null;
  }
};

// Save users with profile_pic as Blob
export const saveUsers = async (users) => {
  const usersWithBlob = await Promise.all(
    users.map(async (user) => {
      if (user.profile_pic) {
        try {
          const blob = await toBlob(user.profile_pic);
          return { ...user, profile_pic: blob || user.profile_pic };
        } catch (err) {
          console.error("❌ Failed to convert image for user", user.id, err);
          return user;
        }
      }
      return user;
    })
  );

  const db = await getDB();
  const tx = db.transaction("users", "readwrite");
  for (const user of usersWithBlob) {
    tx.store.put(user);
  }
  await tx.done;
  console.log(`[IndexedDB] ✅ Saved ${users.length} users with Blob pics`);
};

// Load users
// Load users (sorted same as Supabase)
export const getUsers = async () => {
  const db = await getDB();
  let users = await db.getAll("users");

  // Sort by created_at descending (latest first, like Supabase .order("created_at", { ascending: false }))
  users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  console.log(
    `[IndexedDB] 📂 Loaded ${users.length} users (sorted by created_at desc)`
  );
  return users;
};

// Metadata functions
export const setLastSync = async (timestamp) => {
  const db = await getDB();
  await db.put("meta", timestamp, "lastSync");
  console.log(`[IndexedDB] ⏱️ Updated lastSync = ${timestamp}`);
};

export const getLastSync = async () => {
  const db = await getDB();
  const lastSync = await db.get("meta", "lastSync");
  console.log(`[IndexedDB] ⏱️ Last sync = ${lastSync}`);
  return lastSync;
};

export const getUsersFiltered = async ({
  activeTab,
  genderFilter,
  countryFilter,
  searchTerm,
}) => {
  const db = await getDB();
  let users = await db.getAll("users");

  // Sort (default like Supabase)
  users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Apply filters manually
  if (activeTab === "all") {
    users = users.filter((u) => u.country !== "IN");
  }
  if (genderFilter !== "all") {
    users = users.filter((u) => u.gender === genderFilter);
  }
  if (countryFilter !== "all") {
    users = users.filter((u) => u.country === countryFilter);
  }
  if (activeTab === "online") {
    users = users.filter((u) => u.status === "online");
  }
  if (searchTerm.trim() !== "") {
    const s = searchTerm.toLowerCase();
    users = users.filter((u) => u.name.toLowerCase().includes(s));
  }

  return users;
};

export const getRoastDB = async () => {
  return openDB("RoastDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("roast_images")) {
        db.createObjectStore("roast_images", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta"); // store lastSync timestamp
      }
    },
  });
};

// Save roast images
export const saveRoastImages = async (images) => {
  const imagesWithBlob = await Promise.all(
    images.map(async (img) => {
      if (img.image_url) {
        try {
          const blob = await toBlob(img.image_url);
          return { ...img, roast_pic: blob || img.image_url }; // add `roast_pic` key
        } catch (err) {
          console.error("❌ Failed to convert image for roast", img.id, err);
          return img;
        }
      }
      return img;
    })
  );
  const db = await getRoastDB();
  const tx = db.transaction("roast_images", "readwrite");
  for (const img of imagesWithBlob) {
    tx.store.put(img);
  }
  await tx.done;
  console.log(`[IndexedDB] ✅ Saved ${images.length} roast images as Blob`);
};
// Load roast images
export const getRoastImages = async () => {
  const db = await getRoastDB();
  const images = await db.getAll("roast_images");
  console.log(`[IndexedDB] 📂 Loaded ${images.length} roast images`);
  return images;
};

// Metadata
export const setRoastLastSync = async (timestamp) => {
  const db = await getRoastDB();
  await db.put("meta", timestamp, "roastLastSync");
  console.log(`[IndexedDB] ⏱️ Updated roastLastSync = ${timestamp}`);
};

export const getRoastLastSync = async () => {
  const db = await getRoastDB();
  const lastSync = await db.get("meta", "roastLastSync");
  console.log(`[IndexedDB] ⏱️ Last roast sync = ${lastSync}`);
  return lastSync;
};
