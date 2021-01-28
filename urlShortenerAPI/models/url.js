const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    shortCode: { type: String, required: true },
    visits: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("url", UrlSchema);
