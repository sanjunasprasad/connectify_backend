import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'public/image'); 
    } 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
export const upload = multer({ storage: storage });
