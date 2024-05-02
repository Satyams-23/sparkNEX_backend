const express = require("express");

const { protect } = require("../Middleware/authMiddleware");
const { allMessages, sendMessage } = require("../Controller/messageController");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
