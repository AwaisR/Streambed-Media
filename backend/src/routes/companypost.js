var express = require("express");
var router = express.Router();
const companyPostControler = require("../controller/comapnypost");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const fetch = require("node-fetch");

router.get("/getCompanyPosts", auth, companyPostControler.getCompanyPost);
router.put("/video_paid", auth, companyPostControler.paidVideoPrice);
router.put("/delete_video", auth, companyPostControler.deleteVideo);

module.exports = router;
