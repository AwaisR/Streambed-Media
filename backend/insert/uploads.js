"use strict";

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const client = require("../client");
var io = require("../socket");

// uploading a video to youtube
async function runUpload(videoInfo, userId) {
  try {
    // TODO! update path here
    const filePath = videoInfo.videoFilePath;
    const imagePath = videoInfo.imgFilePath;

    if (!filePath || !imagePath) throw new Error("Wrong file path.");

    const fileSize = fs.statSync(filePath).size;

    // initialize the youtube API library
    const youtube = google.youtube({
      version: "v3",
      auth: await client.get(userId),
    });
    const res = await youtube.videos.insert(
      {
        part: "id,snippet,status",
        notifySubscribers: false,
        requestBody: {
          snippet: {
            title: videoInfo.title,
            description: videoInfo.desc,
          },
          status: {
            privacyStatus: videoInfo.visibility,
          },
        },
        media: {
          body: fs.createReadStream(filePath),
        },
      },
      {
        // Use the `onUploadProgress` event from Axios to track the
        // number of bytes uploaded to this point.
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          // if (Math.floor(progress) % 10 === 0)
          //   io.sockets()
          //     .to(`userId:${userId}`)
          //     .emit("youtube-progress", Math.round(progress));
          if (Math.floor(progress) % 2 === 0)
            io.to(`userId:${userId}`).emit(
              "youtube-progress",
              Math.round(progress)
            );
          // readline.clearLine(process.stdout, 0);
          // readline.cursorTo(process.stdout, 0, null);
          process.stdout.write(`${Math.round(progress)}% complete`);
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log("something went wrong", err);
    const error = new Error(err);

    // Path wrong, Not O-authed, Too many uploads
    if (error) {
      console.error("An Error Occured While Uploading to youtube", error);
      return { err: error.message };
    } else return { err: err };
  }
}

module.exports = {
  runUpload,
};
