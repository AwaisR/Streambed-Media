const mongoose = require("mongoose");

const TwitterPost = mongoose.Schema(
  {
    author: { required: false, type: mongoose.ObjectId, ref: "User" },
    created_at: { required: false, type: String },
    id: { required: false, type: Number },
    id_str: { required: false, type: String },
    text: { type: String, required: false },
    txid: {
      type: String,
      required: false,
    },

    videoDuration: { type: Number, required: false },
    mimeType: { type: String, required: false },
    user: {
      id: { type: Number },
      id_str: { type: String, required: false },
      name: { type: String },
      screen_name: { type: String, required: false },
    },
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
    entities: {
      media: [
        {
          id: { type: Number },
          id_str: { type: String },
          media_url: { type: String },
          media_url_https: { type: String },
          url: { type: String },
          display_url: { type: String },
          expanded_url: { type: String },
          type: { type: String },
        },
      ],
      hashtags: [],
      symbols: [],
      user_mentions: [],
      urls: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("TwitterPost", TwitterPost);

module.exports = Post;
