const express = require("express");
const { handleRegister } = require("../Controller/userController.js");
const passport = require("passport");
require("../config/passport.js");
const router = express.Router();

router.post("/registration", handleRegister);

router.post(
  "/login",
  passport.authenticate("local", { successRedirect: "/protect" })
);

router.get("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.send("logout");
  });
});
router.get("/protect", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("protected");
  } else {
    res.status(401).send({ meg: "Unauthrozied" });
  }
});

module.exports = router;
