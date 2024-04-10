const mongoose = require("mongoose");

const userSchma = mongoose.Schema({
  fullName: String,
  username: String,
  password: String,
  birthDate: Date,
  gender: String,
  phone: String,
});

const User = mongoose.model("User", userSchma);

module.exports = User;
