const company_posts = require("../models/companyPosts");
const auth = require("../middleware/auth");
const moment = require("moment");
const User = require("../models/user");
const client = require("../../client.js");
const stripe = require("stripe");
exports.getCompanyPost = async (req, res) => {
  try {
    const posts = await company_posts.findOne({ comapny_id: req.companyId });
    if (posts) {
      let access;
      const userIds = [];
      posts.posts.forEach((element) => {
        if (userIds.indexOf(element.userId.toString()) === -1) {
          userIds.push(element.userId.toString());
        }
      });

      const userRecords = await User.find({ _id: { $in: userIds } })
        .select("_id rT")
        .lean();
      let userAccessToken = {};
      for (let index = 0; index < userRecords.length; index++) {
        const element = userRecords[index];
        if (element.rT) {
          let aT = "";
          let youTubeInfoData = "";
          try {
            // Get refresh token
            await client.refresh(element._id, element.rT);
            // Get access Token
            aT = await client.getNewAcc(element._id);
            access = aT;
            // Get info against access token
            const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true&maxResults=50&type=video&key=${
              process.env.REACT_APP_APIKEY
            }&_=${Math.random()}`;
            youTubeInfoData = await getYTVideoInfo(aT, url);
          } catch (error) {
            console.log(
              "Something went wrong Index.js > youtube-data",
              error.message
            );
          }

          userAccessToken[element._id] = {
            accessToken: aT,
            info:
              youTubeInfoData &&
              youTubeInfoData.data &&
              youTubeInfoData.data.items
                ? youTubeInfoData.data.items[0].contentDetails.relatedPlaylists
                    .uploads
                : undefined,
          };
        } else {
          userAccessToken[element._id] = null;
        }
      }
      const getYtInfoPromises = [];
      for (const userId in userAccessToken) {
        let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${userAccessToken[userId].info}&key=${process.env.REACT_APP_APIKEY}`;
        getYtInfoPromises.push(
          getYTVideoInfo(
            userAccessToken[userId]
              ? userAccessToken[userId].accessToken
              : null,
            url
          )
        );
      }

      const ytVideosInfoResults = await Promise.all(getYtInfoPromises);
      const videosOnYt = {};
      for (let index = 0; index < ytVideosInfoResults.length; index++) {
        const element = ytVideosInfoResults[index];

        if (element && element.data && element.data.items) {
          element.data.items.forEach((item, i) => {
            let ytVideo = {};
            ytVideo.thumbnails = item.snippet.thumbnails;
            ytVideo.title = item.snippet.title;
            ytVideo.videoId = item.snippet.resourceId.videoId;
            ytVideo.publishedAt = item.snippet.publishedAt;

            videosOnYt[ytVideo.videoId] = ytVideo;
          });
        }
      }
      const getYtPromises = [];

      for (let index = 0; index < posts.posts.length; index++) {
        const element = posts.posts[index];
        let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,status&id=${element.VideoId}&key=${process.env.REACT_APP_APIKEY}`;
        getYtPromises.push(
          getYTVideoInfo(
            userAccessToken[element.userId]
              ? userAccessToken[element.userId].accessToken
              : null,
            url
          )
        );
      }

      const ytVideosResults = await Promise.all(getYtPromises);

      for (let index = 0; index < posts.posts.length; index++) {
        const element = posts.posts[index];
        try {
          const privacy =
            ytVideosResults[index] &&
            ytVideosResults[index].data &&
            ytVideosResults[index].data.items[0] &&
            ytVideosResults[index].data.items[0].status
              ? ytVideosResults[index].data.items[0].status.privacyStatus
              : null;
          posts.posts[index] = {
            ...element,
            ...{
              privacy,
              info: videosOnYt[element.VideoId],
              stats:
                ytVideosResults[index] &&
                ytVideosResults[index].data &&
                ytVideosResults[index].data.items[0]
                  ? ytVideosResults[index].data.items[0].statistics
                  : {},
            },
          };
        } catch (error) {
          console.log({ error });
        }
      }
      res.json({
        success: true,
        message: "magnify app videos get successfully",
        data: posts,
        accessToken: access,
      });
    }
  } catch (error) {
    console.log("error in getCompanyPosts", error.message);
  }
};

const getYTVideoInfo = async (accesToken, url) => {
  try {
    const axios = require("axios");
    return await axios.get(url, {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + accesToken,
      },
    });
  } catch (error) {
    return { data: null };
  }
};

const getYTVideoPlaylists = async (accesToken, info) => {
  try {
    return await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${info}&key=${process.env.REACT_APP_APIKEY}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + accesToken,
        },
      }
    );
  } catch (error) {
    return { data: null };
  }
};
exports.paidVideoPrice = async (req, res) => {
  try {
    const { VideoId, videoprice, fevorite } = req.body;
    if (videoprice) {
      let result = await company_posts.updateMany(
        { comapny_id: req.companyId },
        { $set: { "posts.$[post].videoprice": videoprice } },
        { multi: true, arrayFilters: [{ "post.VideoId": { $in: VideoId } }] }
      );
      res.json({
        success: true,
        result,
      });
    } else {
      let result = await company_posts.update(
        {
          comapny_id: req.companyId,
          posts: { $elemMatch: { VideoId: `${VideoId}` } },
        },
        { $set: { "posts.$.fevorite": fevorite } },
        { new: true, safe: true, upsert: true }
      );
      res.json({
        success: true,
        result,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteVideo = async (req, res) => {
  try {
    const { VideoId, deleted } = req.body;
    let result = await company_posts.update(
      {
        comapny_id: req.companyId,
        posts: { $elemMatch: { VideoId: `${VideoId}` } },
      },
      { $set: { "posts.$.delete": deleted } },
      { new: true, safe: true, upsert: true }
    );
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
