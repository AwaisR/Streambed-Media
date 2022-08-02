const mongoose = require("mongoose");

const userVideosSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    channelName: {
      type: String,
      requierd: false,
    },
    videoPath: {
      type: String,
      required: false,
    },
    thumbPath: {
      type: String,
      required: false,
    },
    videoLength: {
      type: Number,
      required: false,
    },
    videoId: {
      type: String,
      requried: false,
    },
    txid: {
      type: String,
      requierd: false,
    },
    dateCreated: {
      type: Date,
      required: false,
    },
    sia_url: { type: String, required: false },
    collaborators: [
      {
        user: {
          type: String,
          required: false,
        },
        email: {
          type: String,
          required: false,
        },
        displaName: {
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
    publisher: {
      type: String,
      required: false,
    },
    media_type: {
      type: String,
      required: false,
    },
    platform: {
      type: String,
      requierd: false,
      default: undefined,
    },
    vid: {
      type: mongoose.Schema.ObjectId,
      type: String,
    },
    private_video: {
      type: Boolean,
      requierd: false,
      default: false,
    },
    fevorite: {
      type: Boolean,
      requierd: false,
      default: false,
    },
    videoprice: {
      type: Number,
      required: false,
      default: null,
    },
    delete: {
      type: Boolean,
      requierd: false,
      default: false,
    },
  },
  { timestamps: true }
);

const userVideo = mongoose.model("userVideo", userVideosSchema);

module.exports = userVideo;
