const express = require("express");
const {
  handleRegister,
  handleLogout,
  handleProtect,
  userUpadate,
  handleGetUser,
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
    successRedirect: "/",
  }),
  function (req, res) {
    res.send("fblobign");
    console.log(req.session);
    console.log(req.user);
  }
);
router.put("/user/:username", userUpadate);
router.get("/logout", handleLogout);
router.get("/user/:username", handleGetUser);
router.get("/protect", handleProtect);

module.exports = router;
