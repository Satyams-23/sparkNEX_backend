const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: String,
    username: String,
    password: String,
    birthDate: Date,
    gender: String,
    phone: String,
    botName: String,
    otp: {
      type: Number,
      createdAt: {
        type: Date,
        default: Date.now,
      },

      expires: 180, // Expressed in seconds
    },
  },
  {
    timestamps: true,
  }
);
userSchema.index({ "otp.createdAt": 1 }, { expireAfterSeconds: 60 });

const User = mongoose.model("User", userSchema);

module.exports = User;
