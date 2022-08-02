require("dotenv").config();
var express = require("express");
var { auth } = require("../middleware/auth");
var router = express.Router();

const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const LinkedInController = require("../controller/linkedIn");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const vid = uuidv4();
    req.vid = vid;
    const dir = `public/linkedin-upload/${req.userID}/${vid}`;
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        req.dir = dir;
      } catch (error) {
        console.log("unable to create dir", error);
      }
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = "media" + "." + file.originalname.split(".")[1];
    req.fileName = fileName;
    cb(null, fileName);
  },
});

var upload = multer({ storage: storage });
router.post(
  "/post-video",
  [auth, upload.single("myFile")],
  LinkedInController.postVideo
);
router.post(
  "/auth/linkedin/callback",
  auth,
  LinkedInController.getLinkedInAccestoken
);
router.get(
  "/linkdin-revoke-account",
  auth,
  LinkedInController.revokedlinkdinAccount
);
router.get(
  "/verify-collaborator/active/:collaborator/:post",
  LinkedInController.verifyCollaborator
);
router.get("/get-collaborators", auth, LinkedInController.getCollaborators);
router.post("/add-collaborator", [auth], LinkedInController.addCollaborator);
router.get("/get-info", auth, LinkedInController.getInfo);
router.get("/get-posts", auth, LinkedInController.FetchPosts);
module.exports = router;
