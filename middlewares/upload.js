const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path = require('path');
const appDir = path.dirname(require.main.filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appDir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(appDir);
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
});

module.exports = uploadFile;