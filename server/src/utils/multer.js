import multer from "multer";
import { HttpError } from "./errors.js";

// Reusable function to check allowed file types
const checkFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.mimetype);
};

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
  },
});

// Multer file filter setup with error handling
const fileFilter = (req, file, cb) => {
  if (
    checkFileType(file, ["image/jpeg", "image/png", "image/jpg", "video/mp4"])
  ) {
    cb(null, true);
  } else {
    // Return an error if the file type is not allowed
    const error = new Error(
      "Invalid file type. Only images and videos are allowed."
    );
    error.code = "INVALID_FILE_TYPE";
    cb(error, false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

const uploadHandler = (req, res, next) => {
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ])(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(new HttpError(err.message, 400));
    } else if (err) {
      if (err.code === "INVALID_FILE_TYPE") {
        return next(new HttpError(err.message, 400));
      }
      return next(new HttpError("please upload a valid file", 403));
    }
    next();
  });
};

export { uploadHandler };
