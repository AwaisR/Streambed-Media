const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User_mag",
      required: true,
    },
    type: String,
    remaining: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    totalBalance: {
      type: Number,
    },
    date: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const transaction = mongoose.model("transaction", transactionSchema);

module.exports = transaction;
