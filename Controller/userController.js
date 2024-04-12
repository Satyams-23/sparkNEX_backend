const { hashSync } = require("bcrypt");
const User = require("../Model/userModel");

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
      res.send({ success: true, message: "user sucessfull create" });
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

const userUpadate = async (req, res) => {
  try {
    const { username } = req.params;
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
  const username = req.params.username;
  const user = await User.findOne({ username: username }).select("-password");
  res.status(200).send(user);
};

module.exports = {
  handleRegister,
  handleLogout,
  handleProtect,
  userUpadate,
  handleGetUser,
};
