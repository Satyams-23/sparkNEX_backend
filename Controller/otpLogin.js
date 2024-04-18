const sendOtp = require("./userOtp");
const User = require("../Model/userModel");
const generateOTP = require("./generateOTP");

const createOTPuser = async (req, res) => {
  try {
    const { phone } = req.body;
    if (phone == "+911111111111") {
      const otp = generateOTP(6);
      console.log("OTP------------------------> " + otp);
      const message = `Dear User, Your OTP for the FastX app login is: ${otp}`;
      await sendOtp({ phone, otp });

      const existingUser = await User.findOne({ phone: phone });

      if (existingUser) {
        otpUser = await User.updateOne({ phone: phone }, { otp: otp });

        res.status(200).json({
          otpUser,
          message,
        });
      } else {
        // Create a new user instance with the OTP
        const user = new User({
          phone: phone,
          otp: otp,
          isVerified: false,
        });
        await user.save();
        //       // Return a token or success message to the client
        res.status(200).json({
          success: true,
          message: "kdid",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const OTPCheck = async (req, res) => {
  try {
    const { otp } = req.body;
    const userfound = await User.findOne({ otp: otp }).select("-otp");
    if (!userfound) {
      return res.status(401).json({ message: "otp is worng" });
    }

    const otpfound = await User.updateOne({ otp: otp }, { otp: "" });

    return res.status(200).json({ message: "otp ", otpfound, userfound });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createOTPuser, OTPCheck };
