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
  allUsers,
  handleChangeEmail,
  handleChangePassword,
} = require("../Controller/User/userController");
const passport = require("passport");
require("../config/passport.js");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");

router.post("/auth/registration", handleRegister);

router.post("/auth/login", function (req, res, next) {
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
      return res.status(200).send({
        user: userToSend,
        Token: token,
        message: "user sucessfull login",
      });
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
    const token = generateToken(req.user._id);

    res
      .status(200)
      .send({ user: req.user, Token: token, message: "user sucessfull login" });
  }
);
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook"),
  function (req, res) {
    const token = generateToken(req.user._id);
    const userToSend = Object.assign({}, req.user._doc);
    delete userToSend.password;
    res.status(200).send({ user: userToSend, Token: token });
  }
);
router.route("/user").get(protect, allUsers);
router.route("/userupdate").put(protect, userUpadate);
router.get("/logout", handleLogout);
router.route("/user").get(protect, handleGetUser);
router.route("/changeEmail").post(protect, handleChangeEmail);
router.route("/changepassword").post(protect, handleChangePassword);
router.route("/delete").delete(protect, handledeleteUser);
router.get("/protect", handleProtect);
router.get("/privacy ", handlePrivacy);

module.exports = router;
