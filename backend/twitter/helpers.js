require("dotenv").config();
const Twitter = require("twitter-lite");
const Twit = require("twit");
const basicConfig = require("./config");
const twitterUrls = require("./urls");
const path = require("path");
const User = require("../src/models/user");
const Post = require("../src/models/post");
const twitterUtils = require("./utils");
const { reject } = require("lodash");
const { resolve } = require("path");
const client = new Twitter({
  ...basicConfig,
});

const InitAuthWithTwitter = () => {
  return client
    .getRequestToken(`${process.env.APP_URL}api/twitter-callback`)
    .then((res) => {
      return twitterUrls.getRedirectUrl(
        res.oauth_token,
        res.oauth_token_secret
      );
    })
    .catch((err) => {
      console.log("Error 28", err);
      err;
    });
};

const CompleteAuthWithTwitter = (oauthToken, oauthVerifier) => {
  return client
    .getAccessToken({
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    })
    .then((res) => res)
    .catch((err) => err);
};

const uploadVideoPost = (
  { videoFilePath, title, desc, seconds, visibility },
  userId
) => {
  return new Promise((resolve, reject) => {
    User.findById(userId).then((user) => {
      const { oauth_token, oauth_token_secret } = user.twitterTokens;
      const T = new Twit({
        ...basicConfig,
        access_token: oauth_token,
        access_token_secret: oauth_token_secret,
      });

      const PATH = path.join(__dirname, "../", videoFilePath);
      console.log("starting posting media from", PATH);
      T.postMediaChunked({ file_path: PATH }, function (err, data, response) {
        if (!err) {
          const mediaIdStr = data.media_id_string;
          const meta_params = { media_id: mediaIdStr };
          T.post(
            "media/metadata/create",
            meta_params,
            function (err, media_metadata, response) {
              if (!err) {
                const params = {
                  status: `${title}\n${desc}`,
                  media_ids: [mediaIdStr],
                };

                setTimeout(() => {
                  T.post(
                    "statuses/update",
                    params,
                    function (err, tweet, response) {
                      console.log(tweet);
                      const {
                        screen_name,
                        name,
                        profile_image_url,
                        id_str: user_twitter_id,
                      } = tweet.user;
                      const liveLink = `https://twitter.com/${screen_name}/status/${tweet.id_str}`;
                      const video_link = twitterUtils.getMediaLink(tweet);
                      const videoObj = {
                        contentId: tweet.id_str,
                        datePublished: tweet.created_at,
                        visibility,
                        platform: 1,
                        liveLink,
                        userId,
                        contentDetails: {
                          ...tweet.entities,
                          text: tweet.text,
                          title,
                          desc,
                          length: seconds,
                          video_link,
                        },
                        userDetails: {
                          screen_name,
                          name,
                          profile_image_url,
                          user_twitter_id,
                        },
                      };
                      const addVideo = new Post(videoObj);
                      addVideo
                        .save()
                        .then((re) => {
                          console.log("video is added to db", videoObj);
                          resolve(videoObj);
                        })
                        .catch((err) => {
                          console.error("error", err);
                        });
                    }
                  );
                }, 3000);
              } else {
                console.log("errrr", err);
              }
            }
          );
        }
      });
    });
  });
};

const getVideoTweet = async (userId) => {
  try {
    const user = await User.findById(userId);
    const { oauth_token, oauth_token_secret } = user.twitterTokens;
    const T = new Twit({
      ...basicConfig,
      access_token: oauth_token,
      access_token_secret: oauth_token_secret,
    });
    const response = await T.get("statuses/show/1273352189147308034");
    const videoRes = await Post.findOne({ contentId: "1273352189147308034" });
    return videoRes; //response.data;
  } catch (err) {
    throw err;
  }
};

const getAllVideos = async (userId) => {
  try {
    const videosRes = await Post.find({ userId });
    return videosRes;
  } catch (err) {
    throw err;
  }
};

const checkTwitterToken = ({
  oauth_token,
  oauth_token_secret,
  screen_name,
  user_id,
}) => {
  return oauth_token && oauth_token_secret && screen_name && user_id;
};

module.exports = {
  InitAuthWithTwitter,
  CompleteAuthWithTwitter,
  uploadVideoPost,
  checkTwitterToken,
  getVideoTweet,
  getAllVideos,
};
