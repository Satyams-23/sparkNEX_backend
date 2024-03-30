const express = require("express");
const router = express.Router();
const { hanldeOtp } = require("../Controller/userOtp");

router.post("/otp", hanldeOtp);

module.exports = router;
