const mongoose = require("mongoose");
const { stringify } = require("uuid");

//User schema, all fields are required currently

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      //match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ //This is regex for email validation
    },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    mnemonic: {
      type: String,
      default: "",
    },
    rT: { type: String, default: "" },
    zoom_rT: { type: String, default: "" },

    other_email: [
      {
        email: { type: String, required: false },
        activeToken: { type: String, required: false },
        activeExpires: { type: Date, required: false },
        active: { type: Boolean, required: false },
      },
    ],
    zoom: {
      id: { type: String, default: "" },
      first_name: { type: String, default: "" },
      last_name: { type: String, default: "" },
      email: { type: String, default: "" },
      type: { type: Number, default: "" },
      pmi: { type: Number, default: "" },
      timezone: { type: String, default: "" },
      pic_url: { type: String, default: "" },
      language: { type: String, default: "en-US" },
      phone_number: { type: String, default: "" },
      status: { type: String, default: "" },
    },
    instagram: {
      access_token: { type: String, default: "", requierd: false },
      id: { type: String, default: "", requierd: false },
      first_name: { type: String, default: "", requierd: false },
      last_name: { type: String, default: "", requierd: false },
      email: { type: String, default: "", requierd: false },
      pages: [
        {
          name: { type: String },
          page_id: { type: String },
          category: { type: String },
        },
      ],
      business_account: {
        id: { type: String },
      },
    },
    linkedin: {
      access_token: { type: String, default: "", requierd: false },
      id: { type: String, default: "", requierd: false },
      first_name: { type: String, default: "", requierd: false },
      last_name: { type: String, default: "", requierd: false },
      email: { type: String, default: "", requierd: false },
      pages: [
        {
          organaization_name: { type: String },
          organaization_id: { type: String },
          roleAssignee_id: { type: String },
        },
      ],
    },
    facebook: {
      access_token: { type: String, default: "", requierd: false },
      id: { type: String, default: "", requierd: false },
      first_name: { type: String, default: "", requierd: false },
      last_name: { type: String, default: "", requierd: false },
      email: { type: String, default: "", requierd: false },
      pages: [
        {
          access_token: { type: String },
          name: { type: String },
          page_id: { type: String },
          category: { type: String },
        },
      ],
      groups: [
        {
          id: { type: String },
          description: { type: String },
          icon: { type: String },
          name: { type: String },
          permissions: [{ type: String }],
          privacy: { type: String },
          administrator: { type: Boolean },
        },
      ],
      business_account: {
        id: { type: String },
      },
    },

    twitterTokens: {
      oauth_token: { type: String, default: "" },
      oauth_token_secret: { type: String, default: "" },
      user_id: { type: String, default: "" },
      screen_name: { type: String, default: "" },
    },
    pub: { type: String, default: "" },
    active: {
      type: Boolean,
      default: false,
    },
    training: {
      type: Boolean,
      default: true,
    },
    activeToken: String,
    activeExpires: Date,
    memberSince: Date,
    channelName: {
      type: String,
      requierd: false,
    },
    about: {
      type: String,
      requierd: false,
    },
    dateofBirth: {
      day: {
        type: String,
        requierd: false,
      },
      month: {
        type: String,
        requierd: false,
      },
      year: {
        type: String,
        requierd: false,
      },
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
