const mongoose = require("mongoose");
const { stringify } = require("uuid");

//User schema, all fields are required currently

const user_mag_Schema = new mongoose.Schema(
  {
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: true,
      //match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ //This is regex for email validation
    },
    // userType: { type: String, required: false },
    password: { type: String, required: true },
    mnemonic: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    activeToken: String,
    activeExpires: Date,
    memberSince: Date,
    userType: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
  },

  { timestamps: true }
);

const User_mag = mongoose.model("User_mag", user_mag_Schema);

module.exports = User_mag;
