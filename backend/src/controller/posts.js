const User = require("../models/user");
const userVideo = require("../models/userVideo");
const bcrypt = require("bcrypt");
const TwitterMethods = require("../../twitter/helpers");

const client = require("../../client");
const sendMail = require("../../task-manager/mailer");
const auth = require("../middleware/auth");
const { checkTwitterToken } = require("../../twitter/helpers");
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);
// TODO add authentication
exports.get_video = async (req, res, next) => {
  try {
    const { content_id, limit = 5 } = req.query;
    const userDoc = await userVideo.findOne({ _id: content_id });

    if (!userDoc || userDoc === "undefined" || userDoc === "null")
      return res.json({ success: true, msg: "no record found" });
    const populateQuery = [
      { path: "userId", select: "displayName memberSince" },
      { path: "youtubeId" },
      { path: "collaborators.userId", select: "displayName" },
    ];
    if (userDoc) {
      const doc = await userDoc.populate(populateQuery).execPopulate();
      const activityFeed = await getActivityFeed(5);
      const userContent = {
        activityFeed,
        ...doc._doc,
      };
      res.header("Access-Control-Allow-Origin", "*");
      return res.json(userContent);
    }
  } catch (err) {
    console.log("something went wrong", err);
    return next(err);
  }
};
exports.StripePayment = async (req, res) => {
  try {
    const body = {
      source: req.body.token.id,
      amount: req.body.amount,
      currency: "usd",
    };
    stripe.charges.create(body, (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).send({ error: stripeErr });
      } else {
        res.status(200).json({
          success: true,
          stripe: stripeRes,
        });
      }
    });
  } catch (error) {}
};
