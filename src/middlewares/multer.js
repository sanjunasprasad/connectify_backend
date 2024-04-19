import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create directories if they don't exist
const videoDir = join(__dirname, 'public', 'videos');
const imageDir = join(__dirname, 'public', 'images');
if (!existsSync(videoDir)) {
  mkdirSync(videoDir, { recursive: true });
}
if (!existsSync(imageDir)) {
  mkdirSync(imageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (file.mimetype.startsWith('video/')) {
        cb(null, videoDir);
      } else {
        cb(null, imageDir);
      }
    } catch (err) {
      console.error("Error in setting destination:", err);
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    try {
      cb(null, file.originalname);
    } catch (err) {
      console.error("Error in setting filename:", err);
      cb(err);
    }
  }
});


export const upload = multer({ storage: storage });