const mongoose = require("mongoose");

const InstagramPost = mongoose.Schema(
  {
    author: { type: mongoose.ObjectId },
    username: { type: String },
    post_id: { type: String },
    media_type: { type: String },
    media_url: { type: String },
    sia_url: { type: String },
    text: { type: String },
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

const Post = mongoose.model("InstagramPost", InstagramPost);

module.exports = Post;
