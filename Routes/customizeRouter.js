const express = require("express");
const router = express.Router();
const {
  customizeSparkBot,
  customizeResponse,
  customizePersonality,
  customizeGet,
} = require("../Controller/customizeController");

router.post("/sparkbot/:username", customizeSparkBot);
router.put("/response/:botName", customizeResponse);
router.put("/personal/:botName", customizePersonality);
router.get("/get", customizeGet);

module.exports = router;
