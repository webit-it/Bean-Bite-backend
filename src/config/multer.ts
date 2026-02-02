import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, 
    files: 1,                
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("INVALID_IMAGE_TYPE"));
    }

    cb(null, true);
  },
});
