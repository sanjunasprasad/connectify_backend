import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
      cb(null, 'public/videos'); 
    } else {
      cb(null, 'public/image'); 
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
export const upload = multer({ storage: storage });
