const mongoose = require("mongoose");

const FacebookPost = mongoose.Schema(
  {
    author: { type: mongoose.ObjectId },
    username: { type: String },
    post_id: { type: String },
    target_id: { type: String },
    target: { type: String },
    media_type: { type: String },
    media_url: { type: String },
    sia_url: { type: String },
    message: { type: String },
    created_at: { type: String },
    txid: {
      type: String,
    },
    vid: {
      type: String,
    },
    collaborators: [
      {
        user: {
          type: String,
        },
        email: {
          type: String,
        },
        role: {
          type: String,
        },
        verified: {
          type: Boolean,
          requried: false,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("FacebookPost", FacebookPost);

module.exports = Post;
