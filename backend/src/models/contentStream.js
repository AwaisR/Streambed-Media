const mongoose = require("mongoose");
const contentSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  publisherDate: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});
const contentStream = mongoose.model("userContent", contentSchema);
module.exports = contentStream;
