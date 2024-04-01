const otp = require("../Model/otpSchema");

const hanldeOtp = async (req, res) => {
  const { phone } = req.body;

  try {
    if (phone) {
      res.send("otp successfull");
      console.log(phone);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { hanldeOtp };
