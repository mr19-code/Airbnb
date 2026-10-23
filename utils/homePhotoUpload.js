const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const rootDir = require("./pathUtil");

const uploadDirectory = path.join(rootDir, "public", "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const imageExtensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    callback(null, `${crypto.randomUUID()}${imageExtensions[file.mimetype]}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!imageExtensions[file.mimetype]) {
      return callback(new Error("Please choose a JPEG, PNG, WebP, or GIF image."));
    }
    callback(null, true);
  },
});
