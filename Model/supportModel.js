const mongoose = require("mongoose");

const supportchema = new mongoose.Schema({
  email: String,
  description: String,
  file1: String,
  file2: String,
});

const Support = mongoose.model("Support", supportchema);

module.exports = Support;
