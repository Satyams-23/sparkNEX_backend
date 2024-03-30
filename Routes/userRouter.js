const express = require("express");
const {
  handleRegister,
  handleLogout,
  handleProtect,
} = require("../Controller/userController.js");
const passport = require("passport");
require("../config/passport.js");
const router = express.Router();

router.post("/registration", handleRegister);

router.post(
  "/login",
  passport.authenticate("local", { successRedirect: "/protect" })
);

router.get("/logout", handleLogout);

router.get("/protect", handleProtect);

module.exports = router;
