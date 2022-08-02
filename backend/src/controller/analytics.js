const auth = require("../middleware/auth");
const activity = require("../models/analytics.js");
const moment = require("moment");
module.exports = getweeklyAnalytics = async (req, res, next) => {
  try {
    const end = moment(new Date()).utc();
    const start = moment(new Date()).subtract(7, "days").utc();
    const analytics = await activity.find({
      sessionStart: { $gte: start, $lte: end },
    });
    res.json({ msg: "ok", start, end, analytics });
  } catch (error) {
    console.log("someting went wrong", error);
    res.status(500).json({ success: false, msg: "server error" });
  }
};
