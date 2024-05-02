const { hashSync } = require("bcrypt");
const User = require("../Model/userModel");
const generateToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");

const handleRegister = async (req, res) => {
  const { username, password, confirPassword } = req.body;
  if (!username || !password || !confirPassword) {
    return res.status(404).json("please fill required ");
  }
  if (password !== confirPassword) {
    return res.status(404).json("Password is mismatch");
  }
  try {
    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res.status(409).json({ error: "User already exists" });
    } else {
      const user = new User({
        username: username,
        password: hashSync(password, 12),
      });

      user.save();
      console.log(user);
      res.status(201).json({
        success: true,
        user: user,
        message: "user sucessfull create",
        Token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handleLogout = (req, res) => {
  try {
    req.logOut(function (err) {
      if (err) {
        return next(err);
      }
      res.send("logout");
    });
  } catch (error) {
    console.log(error);
  }
};

const handleProtect = (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.send("protected");
    } else {
      res.status(401).send({ meg: "Unauthrozied" });
    }
  } catch (error) {
    console.log(error);
  }
};

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { fullName: { $regex: req.query.search, $options: "i" } },
          { username: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const userUpadate = async (req, res) => {
  try {
    const { username } = req.user.username;
    const { fullName, birthDate, gender } = req.body;
    if (gender !== "male" && gender !== "female" && gender !== "other") {
      return res.status(400).send({ message: "Incorrect gender" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { fullName, birthDate, gender },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
  }
};

const handleGetUser = async (req, res) => {
  const username = req.user.username;
  const user = await User.findOne({ username: username }).select("-password ");
  res.status(200).send(user);
};
const handledeleteUser = async (req, res) => {
  const { username } = req.params;
  try {
    const deleteUser = await User.findOneAndDelete({ username: username });
    console.log(deleteUser, "deleteuser");
    if (!deleteUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send({ message: "user delete" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handlePrivacy = async (req, res) => {
  res.send("this privacy");
};

module.exports = {
  handleRegister,
  handleLogout,
  handleProtect,
  userUpadate,
  handleGetUser,
  handledeleteUser,
  handlePrivacy,
  allUsers,
};
