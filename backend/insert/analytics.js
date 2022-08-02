const { google } = require("googleapis");
const client = require("../client");

async function runVideoAnalytics(userId) {
  try {
    return await getVideoAnalytics(null, userId);
  } catch (error) {
    console.log("something went wrong", error);
  }
}

async function getVideoAnalytics(etag, userId) {
  try {
    const headers = {};
    if (etag) {
      headers["If-None-Match"] = etag;
    }
    // initialize the youtube API library
    const youtube = google.youtube({
      version: "v3",
      auth: await client.get(userId),
    });
    const res = await youtube.channels.list({
      part: "snippet,contentDetails,statistics, status, contentDetails",
      mine: true,
      maxResults: 10,
    });

    const channel = res.data.items[0];

    return channel;
  } catch (error) {
    console.log("something went wrong ", error);
  }
}

module.exports = {
  runVideoAnalytics,
};
