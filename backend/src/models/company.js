const mongoose = require("mongoose");

//User schema, all fields are required currently

const company_schema = new mongoose.Schema(
  {
    company_name: { type: String, required: true, unique: true },
    company_img: { type: String, required: false },
    company_address: { type: String, required: false },
    industry: { type: String, required: false },
    description: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    postal_code: { type: String, required: false },

    company_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_mag",
      },
    ],
    company_posts: [
      {
        post: {
          post_id: {
            type: mongoose.Types.ObjectId,
            refPath: "post.kind",
          },
          kind: String,
        },
      },
    ],
  },

  { timestamps: true }
);

const Company = mongoose.model("company", company_schema);

module.exports = Company;
