const mongoose = require("mongoose");

const linkedInPost = mongoose.Schema(
  {
    author: { type: mongoose.ObjectId },
    username: { type: String },
    organaization: { type: String },
    ugc_id: { type: String },
    share_id: { type: String },
    target: { type: String },
    media_type: { type: String },
    sia_url: { type: String },
    message: { type: String },
    post_url: { type: String },
    created_at: { type: String },
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

const Post = mongoose.model("linkedInPost", linkedInPost);

module.exports = Post;
