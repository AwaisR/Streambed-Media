require("dotenv").config();
const user = require("../models/user");
const LinkedinPost = require("../models/linkedinPost");
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
const sendemail = require("../helper/LinkedinEmail");
const facebookWallet = require("../helper/facebookFlo");
const { SkynetClient } = require("@nebulous/skynet");
const uploadtoSia = require("../helper/siaUpload");
const {
  userFeedTest,
  sendToActivityFeed,
} = require("../../task-manager/services/activityFeedService");
// const facebookController = require("../controller/facebook");
const io = require("../../socket");
const mongoose = require("mongoose");
const getAccessTokenFromCode = async function (code) {
  return axios
    .get("https://www.linkedin.com/oauth/v2/accessToken", {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.LINKEDDIN_CLIENT_ID,
        client_secret: process.env.LINKDEDIN_CLIENT_SECRET,
        redirect_uri: `${process.env.REACT_APP_URL}auth/linkedin/callback`,
        code,
      },
    })
    .then((data) => {
      return data.data;
    })
    .catch((err) => console.log("error", err));
};
const getLinkedInUserData = async function (accesstoken) {
  return await axios({
    url: " https://api.linkedin.com/v2/me",
    method: "get",
    params: {
      oauth2_access_token: accesstoken,
    },
  });
};
const getuserEmail = async (accesstoken) => {
  return await axios({
    url: "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
    method: "get",
    params: {
      oauth2_access_token: accesstoken,
    },
  });
};
const getuserPages = async (accesstoken) => {
  return await axios({
    url: "https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(*,roleAssignee~(localizedFirstName, localizedLastName), organization~(localizedName)))",
    method: "get",
    params: {
      oauth2_access_token: accesstoken,
    },
  });
};
const registerImage = async (uploadTo, accesstoken) => {
  return await axios({
    url: "https://api.linkedin.com/v2/assets?action=registerUpload",
    method: "post",
    header: {
      ContentType: "application/json",
    },
    params: {
      oauth2_access_token: accesstoken,
    },
    data: {
      registerUploadRequest: {
        owner: `urn:li:organization:${uploadTo.organaization_id}`,
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        serviceRelationships: [
          {
            identifier: "urn:li:userGeneratedContent",
            relationshipType: "OWNER",
          },
        ],
        supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
      },
    },
  });
};
const uploadImageLinkedin = async (url, accessToken, file) => {
  try {
    let form = new FormData();
    console.log("url: ", url);
    // form.append("--upload-file", fs.createReadStream(file.path));
    return await axios({
      url,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        // Accept: "*/*",
        // "Content-Type": "application/octet-stream",
        "Content-Type": "image/png",
        // ...form.getHeaders(),
      },
      // encoding: "binary",
      // data: form,
    });
  } catch (e) {
    console.log("error in uploading picture", e.message);
  }
};
const UploadingVideoLinkedin = async (url, file) => {
  try {
    let form = new FormData();
    form.append("--upload-file", fs.createReadStream(file.path));
    return await axios({
      url,
      method: "put",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      data: {
        form,
      },
    });
  } catch (err) {
    console.log("err = ", err);
    // throw err;
  }
};
const registerVideo = async (uploadTo, accesstoken) => {
  return await axios({
    url: "https://api.linkedin.com/v2/assets?action=registerUpload",
    method: "post",
    header: {
      ContentType: "application/json",
    },
    params: {
      oauth2_access_token: accesstoken,
    },
    data: {
      registerUploadRequest: {
        owner: `urn:li:organization:${uploadTo.organaization_id}`,
        recipes: ["urn:li:digitalmediaRecipe:feedshare-video"],
        serviceRelationships: [
          {
            identifier: "urn:li:userGeneratedContent",
            relationshipType: "OWNER",
          },
        ],
      },
    },
  });
};
// const videoStatusCheck = async (mediaAssest, accesstoken) => {
//   try {
//     return await axios({
//       url: `https://api.linkedin.com/v2/assets/${mediaAssest}`,
//       params: {
//         oauth2_access_token: accesstoken,
//       },
//     });
//   } catch (e) {
//     console.log("e", e);
//   }
// };
const uploadFile = async (mediaAssest, uploadTo, accesstoken, description) => {
  return await axios({
    url: "https://api.linkedin.com/v2/ugcPosts",
    method: "post",
    header: {
      ContentType: "application/json",
    },
    params: {
      oauth2_access_token: accesstoken,
    },
    data: {
      author: `urn:li:organization:${uploadTo.organaization_id}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          media: [
            {
              media: `urn:li:digitalmediaAsset:${mediaAssest}`,
              status: "READY",
              thumbnails: [],
              title: {
                attributes: [],
                text: description,
              },
            },
          ],
          shareCommentary: {
            attributes: [],
            text: description,
          },
          shareMediaCategory: "VIDEO",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    },
  });
};
const uploadImage = async (mediaAssest, uploadTo, accesstoken, description) => {
  return await axios({
    url: "https://api.linkedin.com/v2/ugcPosts",
    method: "post",
    header: {
      ContentType: "application/json",
    },
    params: {
      oauth2_access_token: accesstoken,
    },
    data: {
      author: `urn:li:organization:${uploadTo.organaization_id}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          media: [
            {
              media: `urn:li:digitalmediaAsset:${mediaAssest}`,
              status: "READY",
              title: {
                attributes: [],
                text: description,
              },
            },
          ],
          shareCommentary: {
            attributes: [],
            text: description,
          },
          shareMediaCategory: "IMAGE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    },
  });
};
const uploadingText = async (description, uploadTo, accesstoken) => {
  try {
    return axios({
      url: "https://api.linkedin.com/v2/shares",
      method: "post",
      params: {
        oauth2_access_token: accesstoken,
      },
      data: {
        distribution: {
          linkedInDistributionTarget: {},
        },
        owner: `urn:li:organization:${uploadTo.organaization_id}`,
        subject: "Testing",
        text: {
          text: description,
        },
      },
    });
  } catch (e) {
    console.log("errortext", e);
  }
};
const UserPosts = async (id, accesstoken) => {
  try {
    return await axios({
      url: `https://api.linkedin.com/v2/shares/${id}`,
      method: "get",
      params: {
        oauth2_access_token: accesstoken,
      },
    });
  } catch (e) {
    console.log("error", e);
  }
};

const getLinkedInAccestoken = async (req, res) => {
  try {
    const data = await getAccessTokenFromCode(req.body.body.code);
    const _user = await getLinkedInUserData(data.access_token);
    const _userpages = await getuserPages(data.access_token);
    const _userEmail = await getuserEmail(data.access_token);
    const connectedPages = _userpages.data.elements.map((item) => {
      return {
        organaization_name: item["organization~"].localizedName,
        organaization_id: item.organization.split(":")[3],
        roleAssignee_id: item.roleAssignee.split(":")[3],
      };
    });
    const _userLinkedin = await user.findById(req.userID);
    _userLinkedin.linkedin.access_token = data.access_token;
    _userLinkedin.linkedin.id = _user.data.id;
    _userLinkedin.linkedin.first_name = _user.data.localizedFirstName;
    _userLinkedin.linkedin.last_name = _user.data.localizedLastName;
    _userLinkedin.linkedin.email =
      _userEmail.data.elements[0]["handle~"].emailAddress;
    _userLinkedin.linkedin.pages = connectedPages;
    await _userLinkedin.save();
    return res.json({ code: data });
  } catch (e) {
    console.log("e", e);
  }
};
const revokedlinkdinAccount = async (req, res) => {
  try {
    const _user = await user.findById(req.userID);
    _user.linkedin = {};
    await _user.save();
    res.status(200).json({
      success: true,
      message: "Successfully Revoked account ",
      data: _user.linkedin,
    });
  } catch (e) {
    console.log("e", e);
    res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};
const getInfo = async (req, res) => {
  try {
    const { linkedin } = await user.findById(req.userID);

    if (linkedin.access_token.length) {
      linkedin.access_token = uuidv4();
    }
    const _pages = linkedin.pages.map((item) => {
      return item;
    });
    linkedin.pages = _pages;
    return res.json({ success: true, msg: "sucess", linkedin });
  } catch (e) {
    console.log("error", e);
  }
};
const postVideo = async (req, res) => {
  try {
    const _user = await user.findById(req.userID);
    let { linkedin } = _user;
    let { description, uploadTo, target } = req.body;
    uploadTo = JSON.parse(uploadTo);

    const file = req.file;

    if (!file) {
      const textUpload = await uploadingText(
        description,
        uploadTo,
        linkedin.access_token
      );
      var share_id = textUpload.data.activity.split(":")[3];
      var posts = new LinkedinPost({
        author: req.userID,
        username: _user.displayName,
        target: target,
        message: description,
        share_id: share_id,
        organaization: uploadTo.organaization_id,
      });
      await posts.save();
      sendToActivityFeed({
        userId: req.userID,
        platform: "Linkedin",
        activity: `posted a text  to`,
      });
      return res.json({
        success: true,
        data: textUpload.data,
        userPosts: posts,
        organization: uploadTo.organaization_id,
      });
    }
    if (
      file.mimetype.split("/")[0] === "video" ||
      file.mimetype.split("/")[1] == "octet-stream"
    ) {
      const registerVideooo = await registerVideo(
        uploadTo,
        linkedin.access_token
      );
      //////////////////////asssets api///////////
      const uploadUrl =
        registerVideooo.data.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
      const siaLink = await uploadtoSia(file.path);
      if (siaLink) {
        io.emit("message", { upload: true });
      }

      if (uploadUrl) {
        const curlCommand = `curl -v -H "Content-Type:application/octet-stream" --upload-file ${file.path} '${uploadUrl}'`;
        await runCurl(curlCommand);
      }
      const mediaAssest = registerVideooo.data.value.asset.split(":")[3];
      //////////////////////////create ugc post api//////////////////////////
      const Uploadvalue = await uploadFile(
        mediaAssest,
        uploadTo,
        linkedin.access_token,
        description
      );

      if (Uploadvalue.data) {
        var share_id = Uploadvalue.data.id.split(":")[3];
        var posts = new LinkedinPost({
          author: req.userID,
          username: _user.displayName,
          share_id: share_id,
          target: target,
          organaization: uploadTo.organaization_id,
          media_type: file.mimetype && file.mimetype.split("/")[0],
          sia_url: siaLink,
          message: description,
        });
        await posts.save();
      }
      sendToActivityFeed({
        userId: req.userID,
        platform: "Linkedin",
        userVideoId: share_id,
        activity: `posted a ${
          file.mimetype.split("/")[0] === "video" ? "video" : "image"
        } to`,
      });
      return res.json({
        success: true,
        userPosts: posts,
        organization: uploadTo.organaization_id,
      });
    } else {
      ////////////////// register for the image///////////////
      const uploadImageUrl = await registerImage(
        uploadTo,
        linkedin.access_token
      );
      const uploadURL =
        uploadImageUrl.data.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
      const siaLink = await uploadtoSia(file.path);
      if (siaLink) {
        io.emit("message", { upload: true });
      }
      /////////////////// uploading image to the linkedin plateform  /////////////////
      const curlCommand = `curl -i --upload-file ${file.path} -H 'Authorization: Bearer ${linkedin.access_token}'  '${uploadURL}'`;
      runCurl(curlCommand);
      /////////////// status check for the image /////////////////
      const mediaAssest = uploadImageUrl.data.value.asset.split(":")[3];
      //////// create ugc post ///////////////////
      const uploadImages = await uploadImage(
        mediaAssest,
        uploadTo,
        linkedin.access_token,
        description
      );
      if (uploadImages.data) {
        let share_id = uploadImages.data.id.split(":")[3];
        var postsData = await UserPosts(share_id, linkedin.access_token);
        if (postsData) {
          var posts = new LinkedinPost({
            author: req.userID,
            username: _user.displayName,
            share_id: share_id,
            target: target,
            media_type: file.mimetype && file.mimetype.split("/")[0],
            sia_url: siaLink,
            message: description,
            organaization: uploadTo.organaization_id,
            post_url:
              postsData.data.content &&
              postsData.data.content.contentEntities &&
              postsData.data.content.contentEntities[0] &&
              postsData.data.content.contentEntities[0].thumbnails &&
              postsData.data.content.contentEntities[0].thumbnails[0][
                "resolvedUrl"
              ],
          });
          await posts.save();
        }
      }
      sendToActivityFeed({
        userId: req.userID,
        platform: "Linkedin",
        userVideoId: share_id,
        activity: `posted a ${target === "VIDEO" ? "video" : "image"} to`,
      });
      return res.json({
        success: true,
        ugcPost: uploadImages.data,
        mediaAssest: mediaAssest,
        UserPosts: postsData.data,
        userPosts: posts,
        organization: uploadTo.organaization_id,
      });
    }
  } catch (e) {
    console.log("errorResponse", e);
    res.status(500).json({
      error: e,
    });
  }
};

const runCurl = (command) => {
  const util = require("util");
  const exec = require("child_process").exec;
  exec(command, function (error, stdout, stderr) {
    console.log("stdout: " + stdout);
    console.log("stderr: " + stderr);

    if (error !== null) {
      console.log("exec error: " + error);
    }
  });
};

const getPosts = async (req, res) => {
  try {
    const { linkedin } = await user.findById(req.userID);
    let accesstoken = linkdin.access_token;
    const orgs_id = linkdin.pages.map((item) => {
      return item.organaization_id;
    });
    const userPosts = await usersLinkedInPosts();
  } catch (e) {
    console.log("e", e);
  }
};
const FetchPosts = async (req, res) => {
  try {
    const _user = await user.findById(req.userID);
    let { linkedin } = _user;
    const posts = await LinkedinPost.find({
      author: new mongoose.Types.ObjectId(req.userID),
    });
    let share_ids = [];
    if (posts) {
      posts.forEach((element) => {
        share_ids.push(element.share_id);
      });
    }
    const getLinkedInInfoPromises = [];
    for (const id of share_ids) {
      getLinkedInInfoPromises.push(UserPosts(id, linkedin.access_token));
    }
    const LinkedInInfoResult = await Promise.all(getLinkedInInfoPromises);
    let LinkedInfoData = [];

    LinkedInInfoResult.forEach((element) => {
      let obj = {};
      obj.text = element && element.data.text.text;
      obj.post_url =
        element &&
        element.data.content &&
        element.data.content.contentEntities &&
        element.data.content.contentEntities[0] &&
        element.data.content.contentEntities[0].thumbnails &&
        element.data.content.contentEntities[0].thumbnails[0]["resolvedUrl"];
      obj.active = true;
      obj.share_id = element && element.data.id;
      LinkedInfoData.push(obj);
    });
    let post = [];
    LinkedInfoData.forEach((element) => {
      posts.forEach((elem) => {
        if (elem.share_id === element.share_id) {
          post.push(elem);
        }
      });
    });
    res.json({
      success: true,
      posts: post,
    });
  } catch (e) {
    console.log("error in fetch post", e);
  }
};
const addCollaborator = async (req, res, next) => {
  try {
    const { collaborator, p_id, s_id } = req.body;
    const collList = collaborator.map((coll) => {
      return {
        user: coll.user,
        role: coll.role,
        email: coll.email,
        varified: false,
      };
    });
    const LinkedinPostUpdate = await LinkedinPost.findOneAndUpdate(
      { _id: p_id },
      { collaborators: collList },
      { new: true }
    );
    const _user = await user
      .findById(req.userID)
      .select({ displayName: 1, linkedin: 1 });

    const { collaborators } = LinkedinPostUpdate;
    collaborators.forEach(async (doc) => {
      var link = `${process.env.APP_URL_build}api/linkedin/verify-collaborator/active/${doc._id}/${LinkedinPostUpdate._id}`;
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
      post: LinkedinPostUpdate,
    });
  } catch (error) {
    console.log("something went wrong", error);
    next(error);
  }
};
const verifyCollaborator = async (req, res, next) => {
  try {
    const { collaborator, post } = req.params;
    const linkedin = await LinkedinPost.findById(post);

    var collName = "";
    let verified = false;
    const collabortors = linkedin.collaborators.map((coll) => {
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

    var updated = await LinkedinPost.findOneAndUpdate(
      { _id: post },
      { collaborators: collabortors },
      { new: true }
    );

    if (updated) {
      var userDoc = await user.findById(linkedin.author);
      const doc = new activityFeed({
        userId: linkedin.author,
        platform: "Linkedin",
        userVideoId: linkedin.post_id,
        activity: `is now a verified collaborator  `,
        userName: collName,
      });

      // activity
      const activityDoc = await doc.save();
      io.to(`userId:${linkedin.author}`).emit("activity_feed", {
        activity: activityDoc,
        user: linkedin.author,
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
const getCollaborators = async (req, res) => {
  try {
    console.log("res", req.userID);
    var data = await LinkedinPost.find({
      author: new mongoose.Types.ObjectId(req.userID),
    });
    const temp = [];
    await data.forEach((item) => {
      item.collaborators.forEach(({ user, role, verified, email }) => {
        if (verified) {
          temp.push({ user, role, email, verified });
        }
      });
    });
    res.json({
      collaborators: temp,
    });
  } catch (e) {
    console.log("error in getCollabratos", e);
  }
};
module.exports = {
  getLinkedInAccestoken,
  revokedlinkdinAccount,
  getInfo,
  postVideo,
  getPosts,
  FetchPosts,
  addCollaborator,
  verifyCollaborator,
  addCollaborator,
  getCollaborators,
};
