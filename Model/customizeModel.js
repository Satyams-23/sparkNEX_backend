const mongoose = require("mongoose");

const customizeSchema = mongoose.Schema({
  botName: String,
  botAddress: String,
  username: String,
  queries: String,
  tone: String,
  topics: String,
  embody: String,
  humorous: String,
  conversations: String,
  interest: String,
});

const Customize = mongoose.model("Customize", customizeSchema);

module.exports = Customize;
