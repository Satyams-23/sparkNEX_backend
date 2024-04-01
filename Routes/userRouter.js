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
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protect",
    failureRedirect: "/login",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.send("google login");
    console.log(req.session);
    console.log(req.user);
  }
);
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    successRedirect: "/protect",
  }),
  function (req, res) {
    res.send("fblobign");
    console.log(req.session);
    console.log(req.user);
  }
);
router.get("/logout", handleLogout);

router.get("/protect", handleProtect);

module.exports = router;
