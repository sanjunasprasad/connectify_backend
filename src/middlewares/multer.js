import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (file.mimetype.startsWith('video/')) {
        console.log("video post destination")
        cb(null, 'public/videos'); 
      } else {
        console.log("image post destination")
        cb(null, './public/image'); 
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
