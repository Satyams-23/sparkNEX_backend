const express = require("express");
const router = express.Router();
const { createOTPuser, OTPCheck } = require("../Controller/User/otpLogin");

router.post("/otp", createOTPuser);
router.post("/otpcheck", OTPCheck);

module.exports = router;
