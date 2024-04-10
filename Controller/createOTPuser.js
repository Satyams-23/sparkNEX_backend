const sendOtp = require("./userOtp");
const User = require("../Model/userModel");
const generateOTP = require("./generateOTP");
// const catchAsyncErrors = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };
const createOTPuser = async (req, res) => {
  try {
    const { phone } = req.body;
    if (phone == "+911111111111") {
      res.status(200).json({
        success: true,
        message: "Please Verify your OTP",
      });
    }
    const otp = generateOTP(6);
    console.log("OTP------------------------> " + otp);
    const message = `Dear User, Your OTP for the FastX app login is: ${otp}`;
    await sendOtp({ phone, otp });

    const existingUser = await User.findOne({ phone: phone });
    console.log("kd", existingUser, "25");
    if (existingUser) {
      existingUser.otp = otp;
      await existingUser.save();
      res.status(200).json({
        success: true,
        message: "Please Verify your OTP",
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
        message: "Please Verify your OTP",
      });
    }
  } catch (error) {
    console.log(error);
  }
  // try {
  //   const { phone } = req.body;
  //   if (phone == "+8801783014828") {
  //     res.status(200).json({
  //       success: true,
  //       message: "Please Verify your OTP",
  //     });
  //   } else
  //   {
  //     // Generate OTP
  //     const otp = generateOTP(6);
  //     console.log("OTP------------------------> " + otp);
  //     const message = `Dear User, Your OTP for the FastX app login is: ${otp}`;
  //     await sendOtp({ phone, otp });

  //     // Check for the existing user
  //     const existingUser = await User.findOne({ phone: phone });
  //     if (existingUser) {
  //       existingUser.otp = otp;
  //       await existingUser.save();
  //       res.status(200).json({
  //         success: true,
  //         message: "Please Verify your OTP",
  //       });
  //     } else {
  //       // Create a new user instance with the OTP
  //       const user = new User({
  //         phone: phone,
  //         otp: otp,
  //         isVerified: false,
  //       });
  //       // Save the user to the database
  //       await user.save();
  //       // Return a token or success message to the client
  //       res.status(200).json({
  //         success: true,
  //         message: "Please Verify your OTP",
  //       });
  //     }
  //   }
  // } catch (error) {
  //   console.error("Error sending OTP:", error);
  //   res.status(500).json({ error: "Failed to send OTP." });
  // }
};

// const helloworld = async (req, res) => {
//   const { phone } = req.body;
//   r
//   console.log(phone);
// };

module.exports = { createOTPuser };
