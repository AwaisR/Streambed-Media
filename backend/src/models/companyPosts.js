const mongoose = require("mongoose");

//User schema, all fields are required currently

const companyPosts_schema = new mongoose.Schema(
  {
    comapny_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    posts: { type: Array, default: [] },
  },
  { timestamps: true }
);

const company_posts = mongoose.model("company_posts", companyPosts_schema);

module.exports = company_posts;
