import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ cho phép upload ảnh"));
    }
    cb(null, true);
  },
});

export default upload;
