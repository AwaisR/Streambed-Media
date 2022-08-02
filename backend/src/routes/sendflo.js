const express = require("express");
const router = express.Router();
const sendFlo = require("../middleware/sendFlo.js").sendFlo;
const { sendToBlockChain } = require("../../blockchain");
const userVideo = require("../models/userVideo");
const twitterPost = require("../models/twitterPost");
const facebookPost = require("../models/facebook");

const instagramPost = require("../models/Instagram");
const { auth } = require("../middleware/auth");
router.post("/send-to-flo", async (req, res) => {
  await sendToBlockChain(req.body.obj);
  return res.json({ success: true, msg: "send flo" });
});

router.post("/sendFlo", auth, (req, res, next) => {
  // let signed64 = req.body.signed64;

  // TODO: req.body.signed64 is undefined
  // what is it used for for now add random
  try {
    // let signed64 = req.body.signed64;
    // const postID = req.body.videoID;

    const { signed64, postID, plateform, vid } = req.body;

    sendFlo(signed64)
      .then((txid) => {
        console.log(txid);
        if (plateform == "facebook") {
          facebookPost.findOneAndUpdate(
            { post_id: postID },
            { $set: { txid: txid } },
            function (err, doc) {
              if (err) {
                console.log("Something wrong when updating data!");
              }
            }
          );
        } else if (plateform == "twitter") {
          twitterPost.findOneAndUpdate(
            { id_str: postID },
            { $set: { txid: txid } },
            function (err, doc) {
              if (err) {
                console.log("Something wrong when updating data!");
              }
            }
          );
        } else if (plateform == "instagram") {
          instagramPost.findOneAndUpdate(
            { post_id: postID, vid: vid },
            { $set: { txid: txid } },
            function (err, doc) {
              if (err) {
                console.log("Something wrong when updating data!");
              }
            }
          );
        } else {
          userVideo.findOneAndUpdate(
            { videoId: postID },
            { $set: { txid: txid } },
            function (err, doc) {
              if (err) {
                console.log("Something wrong when updating data!");
              }
            }
          );
        }

        res.status(201).json({
          txid: txid,
        });
      })
      .catch((err) => console.log("Catch error", err));
  } catch (error) {
    console.log("something went wrong", error);
    next(error);
  }
});

module.exports = router;
