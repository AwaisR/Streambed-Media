const mongoose = require("mongoose");

const acitivityFeedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    dateCreated: {
      type: Date,
      default: new Date(),
    },
    platform: {
      type: String,
      required: false,
    },
    userVideoId: {
      type: String,
      required: false,
    },
    activity: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const acitivityFeed = mongoose.model("acitivityFeed", acitivityFeedSchema);

module.exports = acitivityFeed;
