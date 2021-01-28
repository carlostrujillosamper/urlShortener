const express = require("express");

const { redirect, addUrl, getStats } = require("../controllers/shortenerController");

const router = express.Router();

// / GET
router.get("/:shortCode", redirect);

router.get("/:shortCode/stats", getStats);

// / POST
router.post("/", addUrl);

module.exports = router;
