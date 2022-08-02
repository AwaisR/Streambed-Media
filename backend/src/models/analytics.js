const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  sessionStart: { type: Date, required: false },
  sessionEnd: { type: Date, required: false },
  totalSession: { type: String, required: false },
  user: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
  activity: {
    type: String,
    required: false,
  },
});

const Analytics = mongoose.model("Analytics", ActivitySchema);

module.exports = Analytics;
