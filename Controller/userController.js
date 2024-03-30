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

module.exports = { handleRegister };
