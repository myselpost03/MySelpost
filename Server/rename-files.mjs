import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to folder outside "server"
const folderPath = path.join(__dirname, '..', '11zon_compressed');

const files = fs.readdirSync(folderPath);

files.forEach(file => {
  const newName = file.replace(/_\d+_11zon/, '');
  if (newName !== file) {
    fs.renameSync(
      path.join(folderPath, file),
      path.join(folderPath, newName)
    );
    console.log(`Renamed: ${file} → ${newName}`);
  }
});
