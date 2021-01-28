const express = require("express");

const { Redirect, AddUrl } = require("../controller/ShortenerController");

const router = express.Router();

// / GET
router.get("/:shortcode", Redirect);

router.get("/:shortcode/stats");

// / POST
router.post("/", AddUrl);

module.exports = router;
