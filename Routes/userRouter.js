const express = require("express");
const generateToken = require("../config/generateToken.js");
const {
  handleRegister,
  handleLogout,
  handleProtect,
  userUpadate,
  handleGetUser,
  handledeleteUser,
  handlePrivacy,
} = require("../Controller/userController.js");
const passport = require("passport");
require("../config/passport.js");
const router = express.Router();

router.post("/registration", handleRegister);

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send({ message: info.message });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      const token = generateToken(user._id);
      const userToSend = Object.assign({}, user._doc);
      delete userToSend.password;
      return res.status(200).send({ userToSend, token });
    });
  })(req, res, next);
});
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
router.delete("/delete/:username", handledeleteUser);
router.get("/protect", handleProtect);
router.get("/privacy ", handlePrivacy);

module.exports = router;
