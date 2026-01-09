import upload from "./upload.js";

export const uploadImageSafe = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("❌ Upload error:", err.message);
      return res.status(400).json({
        message: err.message || "Upload failed",
      });
    }
    next();
  });
};
