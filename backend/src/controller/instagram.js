require("dotenv").config();
var express = require("express");
var { auth } = require("../middleware/auth");
var router = express.Router();
const Twitter = require("twitter");
const multer = require("multer");
const fs = require("fs");
const request = require("request");
var path = require("path");
const user = require("../models/user");
const dotenv = require("dotenv");
const TwitterPost = require("../models/twitterPost");
const sendMail = require("../../task-manager/mailer");
// const { getVideoDurationInSeconds } = require("get-video-duration");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const InstagramPost = require("../models/Instagram");
const User = require("../models/user");
const mime = require("mime");
const sendemail = require("../helper/instagramEmail");
const uploadtoSia = require("../helper/siaUpload");
const {
  userFeedTest,
  sendToActivityFeed,
} = require("../../task-manager/services/activityFeedService");

async function getAccessTokenFromCode(code) {
  return axios
    .get("https://graph.facebook.com/v8.0/oauth/access_token", {
      params: {
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        redirect_uri: `${process.env.APP_URL}instagram-auth2callback`,
        code,
      },
    })
    .then((data) => {
      return data.data;
    })
    .catch((err) => console.log("error", err));
}
async function getFacebookUserData(accesstoken) {
  return await axios({
    url: "https://graph.facebook.com/me",
    method: "get",
    params: {
      fields: ["id", "email", "first_name", "last_name"].join(","),
      access_token: accesstoken,
    },
  });
}

async function getFacebookUserPageData(accesstoken) {
  return await axios({
    url: "https://graph.facebook.com/me/accounts",
    method: "get",
    params: {
      access_token: accesstoken,
    },
  });
}

async function getInstagramBusinessAccount(accesstoken, pageId) {
  return await axios({
    url: `https://graph.facebook.com/v9.0/${pageId}?fields=instagram_business_account`,
    method: "get",
    params: {
      access_token: accesstoken,
    },
  });
}

const addIndex = async (req, res) => {
  try {
    const {
      media_url,
      media_type,
      username,
      timestamp,
      id,
      title,
      permalink,
    } = req.body.user;
    const vid = uuidv4();
    const _user = await user.findById(req.userID).select("displayName");

    let instapost = {
      author: req.userID,
      username: _user.displayName,
      post_id: id,
      media_type: media_type,
      media_url: media_url,
      vid: vid,
      text: title,
    };
    sendToActivityFeed({
      userId: req.userID,
      platform: "Instagram",
      userVideoId: id,
      activity: `posted a ${media_type === "VIDEO" ? "video" : "image"} to`,
    });
    const download = async (url, path, callback) => {
      await request.head(url, (err, res, body) => {
        request(url).pipe(fs.createWriteStream(path)).on("close", callback);
      });
    };

    const url = media_url;
    let path = "";
    const dir = `./public/instagram-upload/${req.userID}/${vid}`;
    if (media_type === "IMAGE") {
      path = `./${dir}/image.png`;
    } else {
      path = `./${dir}/video.mp4`;
    }

    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir, { recursive: true });
    }
    await download(url, path, async () => {
      console.log("Done!");
      instapost.sia_url = await uploadtoSia(path);
      let _instagram = new InstagramPost(instapost);
      const newRecord = await _instagram.save();
      return res.json({ msg: "ok", success: true, vid: vid, permalink });
    });
  } catch (error) {
    return res.json({ msg: "error", success: false });
  }
};

const verifyColaborator = async (req, res) => {
  try {
    const { collaborator } = req.body;
    const user = await User.findOne(
      {
        $or: [{ displayName: collaborator }],
      },
      { email: 1 }
    );

    if (user) {
      return res.send({ msg: "all Good", success: true, email: user.email });
    } else {
      return res.send({ msg: "Not found", success: false });
    }
  } catch (error) {
    console.log("something went wrong", error);
    next(error);
  }
};
const addCollaborator = async (req, res, next) => {
  try {
    const { collaborator, vid, permalink } = req.body;
    const collList = collaborator.map((coll) => {
      return {
        user: coll.user,
        role: coll.role,
        email: coll.email,
        varified: false,
      };
    });

    const _instagram = await InstagramPost.findOneAndUpdate(
      { vid: vid },
      { collaborators: collList },
      { new: true }
    );

    const { collaborators, text, post_id, _id, author } = _instagram;
    const _user = await user.findById(author).select("displayName");
    collaborators.forEach((doc) => {
      // TODO! verification to be added
      var link = `${process.env.APP_URL_build}api/instagram/verify-collaborator/active/${doc._id}/${_id}`;
      sendemail(
        post_id,
        text || "Instagram post",
        doc.email,
        doc.user,
        _user.displayName,
        link,
        permalink
      );
    });
    return res.json({
      success: true,
      msg: "collaborator added successfully!",
      post: _instagram,
    });
  } catch (error) {
    console.log("something went wrong", error);
    next(error);
  }
};

const get_verifyCollaborator = async (req, res, next) => {
  try {
    const { post, author } = req.params;
    let user = "";
    let role = "";

    let instaPost = await InstagramPost.findById(post);
    if (!instaPost) {
      return res.json({ success: false, msg: "invalid request" });
    }

    instaPost.collaborators.forEach((item) => {
      if (item._id == author) {
        item.verified = true;
        user = item.user;
        role = item.role;
      }
    });
    var updated = await InstagramPost.findOneAndUpdate(
      { _id: post },
      { collaborators: instaPost.collaborators },
      {
        new: true,
      }
    );
    var { auhtor, post_id } = updated;

    let _user_id = auhtor;
    let _video_id = post_id;

    if (updated) {
      res.json({ success: true, msg: "success" });
    } else {
      res.json({ success: false, msg: "record not found" });
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
};

const getIndex = async (req, res, next) => {
  try {
    const populateQuery = {
      path: "author",
      select: "displayName memberSince",
      model: "User",
    };

    var userDoc = await InstagramPost.findOne({
      post_id: req.query.insta_post,
      txid: req.query.txid,
    }).populate(populateQuery);
    res.header("Access-Control-Allow-Origin", "*");

    var video = "";
    if (!userDoc) {
      res.json({ success: false, msg: "record not found" });
    }
    const directoryPath = path.join(
      __dirname,
      "../",
      `/public/instagram-upload/${userDoc.author._id}/${userDoc.vid}`
    );

    const src = {};
    src.networkURL = "https://siasky.net/" + userDoc.sia_url;

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return res.json({
          success: false,
          video: req.query.insta_post,
          msg: "post not found",
          userDoc,
        });
      }

      files.forEach(function (file) {
        if (mime.getType(file).split("/")[0] == "video") {
          video = file;
        } else {
          video = file;
        }
        src.media_url =
          `${process.env.APP_URL_build}instagram-upload/${userDoc.author._id}/${userDoc.vid}` +
          "/" +
          video;

        return res.json({ success: true, userDoc, video, directoryPath, src });
      });
    });
  } catch (err) {
    console.error("something went wrong", err);
    return next(err);
  }
};

const getPost = async (req, res) => {
  const _user = await user.findById(req.userID);
  const _instaPosts = await InstagramPost.find({ author: req.userID }).select(
    "author username post_id vid txid"
  );
  const {
    instagram: { pages, access_token },
  } = _user;

  try {
    const { data } = await axios({
      url: `https://graph.facebook.com/v9.0/${_user.instagram.business_account.id}/media?fields=media_url,id,ig_id,media_type,owner,permalink,thumbnail_url,timestamp,username,caption`,
      method: "get",
      params: {
        access_token: _user.instagram.access_token,
      },
    });

    return res.json({
      success: true,
      data: data.data,
      indexPosts: _instaPosts,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.json({
      success: false,
      msg: "something went wrong",
      error,
    });
  }
};

const instagramRevoke = async (req, res) => {
  const _user = await user.findById(req.userID);

  try {
    _user.instagram = {};
    await _user.save();

    return res.json({ success: true, msg: "access revoked" });
  } catch (error) {
    console.log("Error: ", error);
    return res.json({ success: false, msg: "something went wrong" });
  }
};

const instagramAccessToken = async (req, res) => {
  const data = await getAccessTokenFromCode(req.body.body.code);
  const _userfb = await getFacebookUserData(data.access_token);

  const userPage = await getFacebookUserPageData(data.access_token);

  // TODO=>  storing first page into DB

  const businessAccount = await getInstagramBusinessAccount(
    data.access_token,
    userPage.data.data[0].id
  );

  const connectedPages = userPage.data.data.map((item) => {
    return {
      name: item.name,
      page_id: item.id,
      category: item.category,
    };
  });

  const _user = await user.findById(req.userID);
  _user.instagram.id = _userfb.data.id;
  _user.instagram.email = _userfb.data.email;
  _user.instagram.first_name = _userfb.data.first_name;
  _user.instagram.last_name = _userfb.data.last_name;
  _user.instagram.access_token = data.access_token;
  _user.instagram.pages = connectedPages;
  _user.instagram.business_account =
    businessAccount.data.instagram_business_account;

  await _user.save();

  return res.json({ code: data });
};

module.exports = {
  getAccessTokenFromCode,
  getFacebookUserData,
  getFacebookUserPageData,
  getInstagramBusinessAccount,
  addIndex,
  addCollaborator,
  verifyColaborator,
  get_verifyCollaborator,
  getIndex,
  getPost,
  instagramRevoke,
  instagramAccessToken,
};
