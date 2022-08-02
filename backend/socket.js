const socket = require("socket.io");
const moment = require("moment");
const Activity = require("./src/models/analytics");

var io = socket();
io.origins("*:*");
io.on("connect", async (socket) => {
  console.log("connect", socket.handshake.query);
  const { userId = null } = socket.handshake.query;
  if (userId) {
    socket.join(`userId:${userId}`);

    socket.on("disconnect", async () => {
      sessionEnd(userId);
      socket.leave(`userId:${userId}`);
    });
    socket.on("login", async () => {
      const { userId = null } = socket.handshake.query;
      sessionStart(userId);
    });
    socket.on("logout", async () => {
      const { userId = null } = socket.handshake.query;
      sessionEnd(userId);
      socket.leave(`userId:${userId}`);
    });
  }
});

const sessionStart = async (userId) => {
  try {
    const activity = await Activity.findOne({ user: userId, sessionEnd: "" });
    if (!activity) {
      const activity = new Activity({
        sessionStart: new Date(),
        user: userId,
      });
      const res = await activity.save();
    } else {
      activity.sessionStart = new Date();
      const res = await activity.save();
    }
  } catch (error) {
    console.log("sessionStart error", error);
  }
};
const sessionEnd = async (userId) => {
  try {
    const activity = await Activity.findOne({ user: userId, sessionEnd: "" });
    if (activity) activity.sessionEnd = new Date();
    const diff = moment(activity.sessionEnd).diff(
      moment(activity.sessionStart)
    );
    var d = moment.utc(diff).format("HH:mm:ss");
    activity.totalSession = d;
    const act = await activity.save();
  } catch (error) {
    console.log("sessionEnd error", error);
  }
};
const userSignup = async (userId) => {
  try {
    const activity = new Activity({
      user: userId,
    });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

module.exports = io;
