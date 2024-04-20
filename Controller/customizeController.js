const Customize = require("../Model/customizeModel");
const User = require("../Model/userModel");

const customizeSparkBot = async (req, res) => {
  try {
    const { username } = req.params;
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(404).json("please fill required ");
    }
    const oldUser = await User.findOne({ username });
    if (!oldUser) {
      return res.status(401).json({ error: "User isn't here" });
    }

    const botUser = await Customize.findOne({ botName: name });

    if (botUser) {
      return res.status(409).json({ error: "botName already exists" });
    } else {
      const customizeBot = new Customize({
        botName: name,
        botAddress: address,
        username: username,
      });
      customizeBot.save();
      console.log(customizeBot);
      res.status(200).json({
        message: "customize bot successfully created",
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { botName: name },
      {
        new: true,
      }
    );
    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const customizeResponse = async (req, res) => {
  try {
    const { botName } = req.params;
    const { queries, tone, topics } = req.body;

    // Validate required fields
    if (!queries || !tone || !topics) {
      return res
        .status(400)
        .json({ error: "Please fill all required fields." });
    }

    const updatedResponse = await Customize.findOneAndUpdate(
      { botName },
      { queries, tone, topics },
      { new: true }
    );

    if (!updatedResponse) {
      return res.status(404).json({ error: "Bot not response." });
    }

    res.status(200).json(updatedResponse);
  } catch (error) {
    console.error("Error in customizeResponse:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const customizePersonality = async (req, res) => {
  try {
    const { botName } = req.params;
    const { embody, humorous, conversations, interest } = req.body;

    if (!embody || !humorous || !conversations || !interest) {
      return res
        .status(400)
        .json({ error: "Please fill all required fields." });
    }

    const updatedPersonality = await Customize.findOneAndUpdate(
      { botName },
      { embody, humorous, conversations, interest },
      { new: true }
    );

    if (!updatedPersonality) {
      return res.status(404).json({ error: "Personality update" });
    }

    res.status(200).json(updatedPersonality);
  } catch (error) {
    console.error("Error in customizeResponse:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const customizeGet = async (req, res) => {
  const bot = await Customize.find();
  res.send(bot);
};
module.exports = {
  customizeSparkBot,
  customizeResponse,
  customizePersonality,
  customizeGet,
};
