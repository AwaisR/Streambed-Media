const {
  getActivityFeed,
} = require("../../task-manager/services/activityFeedService");
const acitivityFeed = require("../models/activityFeed");
const userVideo = require("../models/userVideo");
const facebokPosts = require("../models/facebook");
const instagramPost = require("../models/Instagram");
const user = require("../models/user");
exports.getActivityFeed = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const doc = await getActivityFeed(limit);

    res.header("Access-Control-Allow-Origin", "*");
    return res.json(doc);
  } catch (err) {
    return;
  }
};

exports.getFeedsByVideo = async (req, res) => {
  try {
    const populateQuery = [
      { path: "userId", select: "displayName memberSince", populate: "" },
    ];

    const activity = [];
    const videoDoc = await userVideo.findOne({ videoId: req.query.v_id }, {});
    const feeds = await acitivityFeed
      .find(
        { userVideoId: videoDoc.videoId },
        {
          dateCreated: "1",
          platform: "1",
          userVideoId: "1",
          createdAt: "1",
          userId: "1",
        },
        {
          sort: { createdAt: -1 },
        }
      )
      .populate(populateQuery);

    res.json({ vid: req.query.v_id, videoDoc, feeds });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

exports.getFeeds = async (req, res) => {
  const populateQuery = [
    { path: "userId", select: "displayName memberSince", populate: "" },
  ];

  try {
    const activity = [];
    const feeds = await acitivityFeed
      .find({ userId: req.userID })
      .select(
        "dateCreated platform userVideoId createdAt userId activity userName"
      )
      .sort({ createdAt: -1 })
      .limit(8)
      .exec();

    for (feed in feeds) {
      let temp = {};
      temp.activity = feeds[feed];
      let u = await user
        .findOne({ _id: feeds[feed].userId })
        .select("displayName")
        .exec();

      let video = "";
      switch (feeds[feed].platform.toLowerCase()) {
        case "facebook":
          video = await facebokPosts
            .findOne({ post_id: feeds[feed].userVideoId })
            .select("message txid")
            .exec();

          break;
        case "instagram":
          video = await instagramPost
            .findOne({ post_id: feeds[feed].userVideoId })
            .select("message txid")
            .exec();

          break;
        case "youtube":
          video = await userVideo
            .findOne({ author: feeds[feed].userVideoId })
            .select("username")
            .exec();
          break;
        default:
          break;
      }
      temp.user = u;
      temp.video = video;
      activity.push(temp);
    }

    return activity;
  } catch (error) {
    console.log("something went wrong", error);
  }
};

exports.getFeedsForIndexPage = async (doc) => {
  const populateQuery = [
    { path: "userId", select: "displayName memberSince", populate: "" },
  ];

  try {
    const activity = [];
    const feeds = await acitivityFeed.find(
      { userVideoId: doc.videoId, userId: doc.userId._id },
      {
        dateCreated: "1",
        platform: "1",
        userVideoId: "1",
        createdAt: "1",
        userId: "1",
      }
    );
    // for compatibity
    for (feed in feeds) {
      let temp = {};
      temp.activity = feeds[feed];
      let u = await user
        .findOne({ _id: feeds[feed].userId }, { displayName: "1" })
        .exec();
      let video = await userVideo
        .findOne({ videoId: feeds[feed].userVideoId }, { title: "1" })
        .exec();
      temp.user = u;
      temp.video = video;
      activity.push(temp);
    }

    return activity;
  } catch (error) {
    console.log("something went wrong", error);
  }
};
