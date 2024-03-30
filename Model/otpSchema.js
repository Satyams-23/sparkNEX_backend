const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  phone: Number,
});

const Otp = new mongoose.model("Otp", otpSchema);

module.exports = Otp;
