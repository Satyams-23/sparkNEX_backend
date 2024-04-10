const express = require("express");
const router = express.Router();
const { createOTPuser } = require("../Controller/createOTPuser");

router.post("/otp", createOTPuser);

module.exports = router;
