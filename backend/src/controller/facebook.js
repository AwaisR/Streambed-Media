require("dotenv").config();

const user = require("../models/user");
const dotenv = require("dotenv");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");
const mime = require("mime");
const request = require("request");
const fetch = require("node-fetch");
const activityFeed = require("../models/activityFeed");
const FacebookPost = require("../models/facebook");
const sendemail = require("../helper/facebookEmail");
const facebookWallet = require("../helper/facebookFlo");
const { SkynetClient } = require("@nebulous/skynet");
const uploadtoSia = require("../helper/siaUpload");
const {
  userFeedTest,
  sendToActivityFeed,
} = require("../../task-manager/services/activityFeedService");
const facebookController = require("../controller/facebook");
const io = require("../../socket");
const getAccessTokenFromCode = async function (code) {
  return axios
    .get("https://graph.facebook.com/v8.0/oauth/access_token", {
      params: {
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/facebook-auth2callback",
        code,
      },
    })
    .then((data) => {
      return data.data;
    })
    .catch((err) => console.log("error", err));
};
const getFacebookUserData = async function (accesstoken) {
  return await axios({
    url: "https://graph.facebook.com/me",
    method: "get",
    params: {
      fields: [
        "id",
        "email",
        "first_name",
        "last_name",
        "groups{id,name,description,administrator,icon,privacy,permissions}",
      ].join(","),
      access_token: accesstoken,
    },
  });
};

const getFacebookUserGroups = async function (accesstoken) {
  return await axios({
    url: "https://graph.facebook.com/me",
    method: "get",
    params: {
      fields: ["id", "email", "first_name", "last_name"].join(","),
      access_token: accesstoken,
    },
  });
};
const getFacebookUserPageData = async function (accesstoken) {
  return await axios({
    url: "https://graph.facebook.com/v9.0/me/accounts",
    method: "get",
    params: {
      access_token: accesstoken,
    },
  });
};

const addToIndex = async function (req, res) {
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

    let facebookPost = {
      author: req.userID,
      username: _user.displayName,
      post_id: id,
      media_type: media_type,
      media_url: media_url,
      vid: vid,
      message: title,
    };
    sendToActivityFeed({
      userId: req.userID,
      platform: "Facebook",
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
    const dir = `./public/facebook-upload/${req.userID}/${vid}`;
    if (
      media_type.toUpperCase() === "IMAGE" ||
      media_type.toUpperCase() === "PHOTO"
    ) {
      path = `./${dir}/image.png`;
    } else {
      path = `./${dir}/video.mp4`;
    }

    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir, { recursive: true });
    }

    // create a client

    const client = new SkynetClient();

    await download(url, path, async () => {
      facebookPost.sia_url = await uploadtoSia(path);

      let _facebook = new FacebookPost(facebookPost);

      const newRecord = await _facebook.save();

      return res.json({
        msg: "ok",
        success: true,
        vid: vid,
        permalink,
        _id: newRecord._id,
      });
    });
  } catch (error) {
    console.log("error", error);
    return res.json({ msg: "error", success: false });
  }
};

const getPosts = async (req, res) => {
  const _user = await user.findById(req.userID);
  const facebook = await FacebookPost.find({ author: req.userID }).select(
    "author username post_id vid txid createdAt"
  );

  const { access_token } = _user.facebook;

  if (!access_token) {
    return res.json({
      success: false,
      msg: "facebook is not linked",
    });
  }

  try {
    const { data } = await axios({
      url: `https://graph.facebook.com/v9.0/me/?fields=posts.limit(30){name,full_picture,photos,icon,id,message,picture,source,type,link,permalink_url,attachments{media,url}}`,
      method: "get",
      params: {
        access_token: _user.facebook.access_token,
      },
    });
    return res.json({
      success: true,
      data: data.posts.data,
      facebook,
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

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const vid = uuidv4();
    req.vid = vid;

    const dir = `public/facebook-upload/${req.userID}/${vid}`;

    if (file.mimetype.split("/")[1] == "octet-stream") {
      req.dir = `./${dir}/media.mp4`;
    }

    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (error) {
        console.log("unable to create dir", error);
      }
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, "media" + "." + (file.originalname.split(".")[1] || "mp4"));
  },
});

const getPermalink = async (page_id, token) => {
  const __url = `https://graph.facebook.com/v9.0/${page_id}?fields=images,link&access_token=${token}`;

  return await axios
    .get(__url)
    .then(async (data) => {
      return data.data;
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const postVideo = async (req, res) => {
  const _user = await user.findById(req.userID);
  let { description, uploadTo, target } = req.body;
  uploadTo = JSON.parse(uploadTo);

  try {
    const file = req.file;

    const formData = new FormData();
    let __url = "";
    let FB_DOC = {};
    const FB_obj = {};
    let FB = {};
    FB_obj.message = description || "";
    var selectedPage = "";

    if (target === "pages") {
      _user.facebook.pages.forEach((item) => {
        if (item.page_id === uploadTo.page_id) {
          selectedPage = item;
          FB_obj.target = target;
          FB_obj.target_id = uploadTo.page_id;
        }
      });
    } else if (target === "groups") {
      _user.facebook.groups.forEach((item) => {
        if (item.id === uploadTo.id) {
          let obj = {};
          obj = { ...item };
          obj.page_id = item.id;
          obj.access_token = _user.facebook.access_token;
          selectedPage = obj;
          FB_obj.target = target;
          FB_obj.target_id = uploadTo.id;
        }
      });
    }

    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      formData.append("message", description || "");
      __url = `https://graph-video.facebook.com/v9.0/${selectedPage.page_id}/feed?access_token=${selectedPage.access_token}`;

      await axios
        .post(__url, formData, {
          headers: {
            "content-type": `multipart/form-data`,
            ...formData.getHeaders(),
          },
        })
        .then(async (data) => {
          const { id, post_id } = data.data;
          if (post_id) {
            FB_obj.post_id = post_id;
          }
          FB = new FacebookPost(FB_obj);
          FB_DOC = await FB.save();
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      if (req.dir) {
        var readerStream = fs.createReadStream(req.dir);
      } else {
        var readerStream = fs.createReadStream(file.path);
      }

      if (
        file.mimetype.split("/")[0] === "video" ||
        file.mimetype.split("/")[1] == "octet-stream"
      ) {
        formData.append("description", description || "");
        formData.append("source", readerStream);
        const siaLink = await uploadtoSia(file.path);
        if (siaLink) {
          io.emit("message", { upload: true });
        }
        FB_obj.sia_url = siaLink;

        FB_obj.media_type = "VIDEO";

        __url = `https://graph-video.facebook.com/v9.0/${selectedPage.page_id}/videos?access_token=${selectedPage.access_token}`;
      } else if (file.mimetype.split("/")[0] === "image") {
        formData.append("message", description || "");
        formData.append("source", readerStream);
        const siaLink = await uploadtoSia(file.path);
        if (siaLink) {
          io.emit("message", { upload: true });
        }
        FB_obj.sia_url = siaLink;
        __url = `https://graph-video.facebook.com/v9.0/${selectedPage.page_id}/photos?access_token=${selectedPage.access_token}`;
        FB_obj.media_type = "IMAGE";
      }
      FB_obj.author = req.userID;
      FB_obj.vid = req.vid;
      FB_obj.username = _user.displayName;

      await axios
        .post(__url, formData, {
          headers: {
            "content-type": `multipart/form-data`,
            ...formData.getHeaders(),
          },
        })
        .then(async (data) => {
          const { id, post_id } = data.data;
          if (post_id) {
            const aaadata = await getPermalink(id, selectedPage.access_token);

            FB_obj.media_url = "permalink_url";
            FB_obj.post_id = post_id;
          } else {
            FB_obj.media_url = "https://www.facebook.com";
            FB_obj.post_id = id;
          }

          FB = new FacebookPost(FB_obj);
          FB_DOC = await FB.save();
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    sendToActivityFeed({
      userId: FB_DOC.author,
      platform: "Facebook",
      userVideoId: FB_DOC.post_id,
      activity: `posted a ${
        FB_DOC.media_type === "VIDEO" ? "video" : "image"
      } to`,
    });
    res.json({ success: true, msg: "success", FB_DOC });
  } catch (error) {
    console.log("something went wrong", error);
    res.json({ success: false, msg: "something went wrong", error });
  }
};

const revokeAccess = async (req, res) => {
  const _user = await user.findById(req.userID);

  try {
    _user.facebook = {};
    await _user.save();

    return res.json({ success: true, msg: "access revoked" });
  } catch (error) {
    console.log("Error: ", error);
    return res.json({ success: false, msg: "something went wrong" });
  }
};

const facebookAccessToken = async (req, res) => {
  const data = await getAccessTokenFromCode(req.body.body.code);
  const _userfb = await getFacebookUserData(data.access_token);
  const userPage = await getFacebookUserPageData(data.access_token);

  const connectedPages = userPage.data.data.map((item) => {
    return {
      access_token: item.access_token,
      name: item.name,
      page_id: item.id,
      category: item.category,
    };
  });

  const _user = await user.findById(req.userID);
  _user.facebook.id = _userfb.data.id;
  _user.facebook.email = _userfb.data.email;
  _user.facebook.first_name = _userfb.data.first_name;
  _user.facebook.last_name = _userfb.data.last_name;
  _user.facebook.access_token = data.access_token;
  _user.facebook.pages = connectedPages;
  _user.facebook.groups = _userfb.data.groups.data;

  await _user.save();
  return res.json({ code: data });
};

const addCollaborator = async (req, res, next) => {
  try {
    const { collaborator, p_id, vid } = req.body;
    const collList = collaborator.map((coll) => {
      return {
        user: coll.user,
        role: coll.role,
        email: coll.email,
        varified: false,
      };
    });

    const facebookPostUpdate = await FacebookPost.findOneAndUpdate(
      { _id: p_id },
      { collaborators: collList },
      { new: true }
    );
    const _user = await user
      .findById(req.userID)
      .select({ displayName: 1, facebook: 1 });

    const { collaborators } = facebookPostUpdate;
    collaborators.forEach(async (doc) => {
      var link = `${process.env.APP_URL_build}api/facebook/verify-collaborator/active/${doc._id}/${facebookPostUpdate._id}`;
      await sendemail(
        doc.email,
        doc.user,
        _user.displayName.split(" ")[0],
        link,
        "post link"
      );
    });

    return res.json({
      success: true,
      msg: "collaborator added successfully!",
      post: facebookPostUpdate,
    });
  } catch (error) {
    console.log("something went wrong", error);
    next(error);
  }
};

const getInfo = async (req, res) => {
  const { facebook } = await user.findById(req.userID);
  if (facebook.access_token.length) {
    facebook.access_token = uuidv4();
  }
  const _pages = facebook.pages.map((item) => {
    item.access_token = uuidv4();
    return item;
  });

  const groups = facebook.groups.filter((item) => {
    if (item.administrator === true) {
      return item;
    }
  });
  facebook.groups = groups;
  facebook.pages = _pages;
  return res.json({ success: true, msg: "sucess", facebook });
};
const verifyCollaborator = async (req, res, next) => {
  try {
    const { collaborator, post } = req.params;
    const FB = await FacebookPost.findById(post);

    var collName = "";
    let verified = false;
    const collabortors = FB.collaborators.map((coll) => {
      if (coll._id == collaborator) {
        collName = coll.user;
        if (coll.verified) {
          verified = true;
        }
        coll.verified = true;
      }
      return coll;
    });

    if (verified) {
      return res.json({ success: false, msg: "already verified" });
    }

    var updated = await FacebookPost.findOneAndUpdate(
      { _id: post },
      { collaborators: collabortors },
      { new: true }
    );

    if (updated) {
      var userDoc = await user.findById(FB.author);
      const doc = new activityFeed({
        userId: FB.author,
        platform: "facebook",
        userVideoId: FB.post_id,
        activity: `is now a verified collaborator  `,
        userName: collName,
      });

      // activity
      const activityDoc = await doc.save();
      io.to(`userId:${FB.author}`).emit("activity_feed", {
        activity: activityDoc,
        user: FB.author,
      });
    } else {
      res.json({ success: false, msg: "record not found" });
    }
    return res.json({ success: true, msg: "verified" });
  } catch (error) {
    console.log("error", error);
    return res.json({ success: false, msg: "not verified", error });
  }
};
const getIndex = async (req, res, next) => {
  try {
    const populateQuery = {
      path: "author",
      select: "displayName memberSince ",
      model: "User",
    };

    var _FacebookPost = await FacebookPost.findOne({
      post_id: req.query.facebook_post,
      txid: req.query.txid,
    })
      .populate(populateQuery)
      .lean();

    res.header("Access-Control-Allow-Origin", "*");

    var video = "";
    if (!_FacebookPost) {
      res.json({ success: false, msg: "record not found" });
    }
    const directoryPath = path.join(
      __dirname,
      "../",
      `/public/facebook-upload/${_FacebookPost.author._id}/${_FacebookPost.vid}`
    );

    const src = {};

    const _user = await user.findById(_FacebookPost.author._id);

    let token = "";
    const { pages, groups } = _user.facebook;

    if (_FacebookPost.target == "pages") {
      pages.forEach((item) => {
        if (item.page_id == _FacebookPost.target_id) {
          token = item.access_token;
        }
      });
    } else if (_FacebookPost.target == "groups") {
      groups.forEach((item) => {
        if (item.page_id == _FacebookPost.target_id) {
          token = item.access_token;
        }
      });
    } else {
      token = _user.facebook.access_token;
    }

    // const
    const getLink = async (page_id, token) => {
      const __url = `https://graph.facebook.com/v9.0/${page_id}?fields=source,link&access_token=${token}`;

      return await axios
        .get(__url)
        .then(async (data) => {
          return data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    src.networkURL = "https://siasky.net/" + _FacebookPost.sia_url;

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return res.json({
          success: false,
          video: req.query.insta_post,
          msg: "post not found",
          _FacebookPost,
          err,
        });
      }

      files.forEach(function (file) {
        if (mime.getType(file).split("/")[0] == "video") {
          video = file;
        } else {
          video = file;
        }
        src.media_url =
          `${process.env.APP_URL_build}facebook-upload/${_FacebookPost.author._id}/${_FacebookPost.vid}` +
          "/" +
          video;
        return res.json({
          success: true,
          userDoc: _FacebookPost,
          video,
          directoryPath,
          src,
        });
      });
    });
  } catch (err) {
    console.error("something went wrong", err);
    return next(err);
  }
};
module.exports = {
  getFacebookUserData,
  getAccessTokenFromCode,
  getFacebookUserPageData,
  getFacebookUserGroups,
  addToIndex,
  getPosts,
  postVideo,
  revokeAccess,
  facebookAccessToken,
  addCollaborator,
  getInfo,
  verifyCollaborator,
  getIndex,
};
