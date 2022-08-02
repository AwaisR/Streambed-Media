const mongoose = require("mongoose");

//Post schema, all fields are required currently

const postSchema = new mongoose.Schema(
  {
    contentId: { type: String, required: true, unique: true },
    datePublished: {
      type: Date,
      default: Date.now(),
    },
    platform: {
      type: Number,
      required: true,
    },
    liveLink: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      required: true,
    },
    contentDetails: {
      type: Object,
    },
    userDetails: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
