const activityFeed = require("../../src/models/activityFeed");
const userVideo = require("../../src/models/userVideo");
const user = require("../../src/models/user");
const acitivityFeed = require("../../src/models/activityFeed");
const facebookPost = require("../../src/models/facebook");
var io = require("../../socket");
// const { getFeeds } = require("../task-manager/src/controller/activityFeed");
const {
  getActivityFeed,
  getFeeds,
  getFeedsByVideo,
  getFeedsForIndexPage,
} = require("../../src/controller/activityFeed");
const populateQuery = [{ path: "userId", select: "displayName" }];
exports.getActivityFeed = async function getActivityFeed(limit) {
  try {
    const activityDoc = await activityFeed
      .find({ platform: "YouTube" })
      .limit(limit)
      .sort({ dateCreated: -1 })
      .populate(populateQuery);

    if (!activityDoc || !activityDoc.length > 0) {
      return [];
    }

    return activityDoc;
  } catch (err) {
    console.error(err);
  }
};

exports.userFeedTest = async (req, res) => {
  try {
    const activityDoc = await activityFeed.findOne({
      userVideoId: req.query.v_id,
    });
    const user = await userVideo
      .findOne(
        { videoId: activityDoc.userVideoId },
        { title: "1", description: "1" }
      )
      .populate(populateQuery);

    const { userId } = user;
    const obj = userId;
    io.emit("index_activity_feed", { activity: activityDoc, user: userId });
    io.to(`userId:${userId._id}`).emit("activity_feed", {
      activity: activityDoc,
      user: userId,
    });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

exports.sendToActivityFeed = async function sendToActivityFeed({
  userId,
  platform,
  userVideoId,
  activity,
}) {
  try {
    const doc = new activityFeed({
      userId,
      platform,
      userVideoId,
      activity,
    });

    // activity
    if (platform === "Facebook") {
      var activityDoc = await doc.save();
      var _populateQuery = [{ path: "author", select: "message ceatedAt" }];
      var uservideo = await facebookPost
        .findOne({ author: userId, post_id: activityDoc.userVideoId })
        .populate(_populateQuery);
      // console.log("uservideo", uservideo);
    } else {
      var activityDoc = await doc.save();
      var _populateQuery = [{ path: "userId", select: "displayName ceatedAt" }];
      var uservideo = await userVideo
        .findOne({ userId: userId, videoId: activityDoc.userVideoId })
        .populate(_populateQuery);
    }

    // const activityDoc = await doc.populate(populateQuery).execPopulate();

    // Send Event to all the users connected to socket
    // io.sockets().emit("activity_feed", doc);

    let temp = {};
    temp.activity = activityDoc;
    temp.user = uservideo && uservideo.userId;
    temp.video = { title: userVideo.title, _id: userVideo._id };

    // TODO! send
    io.emit("activity_feed", temp);

    // return activity;
  } catch (error) {
    console.log("something went wrong", error);
    return;
  }
};
