const asyncHandler = require("express-async-handler");
const Support = require("../../Model/supportModel");

const handleAssistance = asyncHandler(async (req, res) => {
  try {
    const { email, description } = req.body;
    const files = req.files;

    const file1Path = files["file1"][0].path;
    const file2Path = files["file2"][0].path;

    const newSupport = new Support({
      email,
      description,
      file1: file1Path,
      file2: file2Path,
    });

    await newSupport.save();

    res.send("Support uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = { handleAssistance };
