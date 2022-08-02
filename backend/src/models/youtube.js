const mongoose = require("mongoose");

const youtubeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  channelName: {
    type: String,
    requierd: false,
  },
  description: {
    type: String,
    required: false,
  },
  videoId: {
    type: String,
    required: false,
  },
  collaborators: [
    {
      user: {
        type: String,
        required: false,
      },
      role: {
        type: String,
        required: false,
      },
      verified: {
        type: Boolean,
        requried: false,
        default: false,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  videoId: {
    type: String,
    requried: false,
  },
});

const Youtube = mongoose.model("Youtube", youtubeSchema);

module.exports = Youtube;
