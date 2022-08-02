require("dotenv").config();
var express = require("express");
var { auth } = require("../middleware/auth");
var router = express.Router();
const instagramWallet = require("../helper/instagramFlo");

const {
  userFeedTest,
  sendToActivityFeed,
} = require("../../task-manager/services/activityFeedService");

const {
  getAccessTokenFromCode,
  getFacebookUserData,
  getFacebookUserPageData,
  getInstagramBusinessAccount,
  addIndex,
  verifyColaborator,
  addCollaborator,
  get_verifyCollaborator,
  getIndex,
  getPost,
  instagramRevoke,
  instagramAccessToken,
} = require("../controller/instagram");

router.post("/add-index", auth, addIndex);
router.post("/verify-collaborator", [auth], verifyColaborator);
router.post("/add-collaborator", [auth], addCollaborator);
// wallet/flo route
router.post("/instagram-flo-blockchain", async (req, res, next) => {
  const txid = await instagramWallet(req.body, req.headers["authorization"]);
  res.json({ success: true, msg: "ok", txid });
});

router.get("/verify-collaborator/active/:author/:post", get_verifyCollaborator);
router.get("/get-index", getIndex);
router.get("/get-posts", auth, getPost);
router.get("/instagram-revoke", auth, instagramRevoke);
router.post("/instagram-access-token", auth, instagramAccessToken);

module.exports = router;
