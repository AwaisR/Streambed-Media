require("dotenv").config();
var express = require("express");
var { auth } = require("../middleware/auth");
var router = express.Router();

const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");

const facebookWallet = require("../helper/facebookFlo");

const {
  getAccessTokenFromCode,
  getFacebookUserData,
  getFacebookUserGroups,
  getFacebookUserPageData,
  addToIndex,
  facebookAccessToken,
  addCollaborator,
  getInfo,
  verifyCollaborator,
  getIndex,
} = require("../controller/facebook");
const facebookController = require("../controller/facebook");

router.post("/add-index", auth, facebookController.addToIndex);

router.get("/get-posts", auth, facebookController.getPosts);

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const vid = uuidv4();
    req.vid = vid;
    const dir = `public/facebook-upload/${req.userID}/${vid}`;
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
    cb(null, "media" + "." + file.originalname.split(".")[1]);
  },
});

var upload = multer({ storage: storage });
router.post(
  "/post-video",
  [auth, upload.single("myFile")],
  facebookController.postVideo
);

router.get("/facebook-revoke", auth, facebookController.revokeAccess);

router.post(
  "/facebook-access-token",
  auth,
  facebookController.facebookAccessToken
);

router.get("/get-pages", auth, (req, res) => {
  return res.json({ msg: "ok", success: true });
});

router.post("/add-collaborator", [auth], facebookController.addCollaborator);

router.get("/get-info", auth, facebookController.getInfo);
// wallet/flo route
router.post("/facebook-flo-blockchain", async (req, res, next) => {
  const txid = await facebookWallet(req.body, req.headers["authorization"]);
  res.json({ success: true, msg: "ok", txid });
});

router.get(
  "/verify-collaborator/active/:collaborator/:post",
  facebookController.verifyCollaborator
);

router.get("/get-index", facebookController.getIndex);

module.exports = router;
