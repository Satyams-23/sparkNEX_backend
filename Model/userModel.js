const mongoose = require("mongoose");

const userSchma = mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchma);

module.exports = User;
