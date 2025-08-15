import fs from "fs";
import path from "path";

// Change this to your folder path
const folderPath = "../avatars";

async function getFolderSize(dirPath) {
  let totalSize = 0;

  const files = await fs.promises.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isFile()) {
      totalSize += stats.size; // size in bytes
    } else if (stats.isDirectory()) {
      totalSize += await getFolderSize(filePath); // recursive for subfolders
    }
  }

  return totalSize;
}

getFolderSize(folderPath)
  .then((size) => {
    console.log(`Total size: ${(size / 1024).toFixed(2)} KB`);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
