var express = require("express");
var router = express.Router();
const companyControler = require("../controller/company");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const fetch = require("node-fetch");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const vid = uuidv4();
    req.vid = vid;
    const dir = `public/magnify-upload/${vid}`;
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
  "/create-company",
  upload.single("image"),
  companyControler.AddCompany
);
router.get("/get-company", auth, companyControler.getCompanies);
router.get("/get-allcompanies", companyControler.getAllCompanies);
router.put(
  "/update-company",
  [auth, upload.single("image")],
  companyControler.UpdateCompanies
);
module.exports = router;
