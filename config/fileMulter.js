const multer = require("multer");
const path = require("path");

const storageAssistance = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storageAssistance });
const multiple = upload.fields([{ name: "file1" }, { name: "file2" }]);
module.exports = { multiple };
