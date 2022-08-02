var express = require("express");
var router = express.Router();
const UsersController = require("../controller/user_mag");
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

router.post("/signup_magnify", UsersController.user_sign_up_magnify);

router.put("/update-users", [auth], UsersController.user_updated);

router.post("/login_magnify", UsersController.user_login_post_magnify);

router.post("/forgot-password_magnify", UsersController.user_forgot_pwd_mag);

// //Activate account
router.get(
  "/account/forgot-password/:email?/:activeToken?/:expiryTime?",
  UsersController.verify_reset_link
);
router.post(
  "/accounts/reset-password/:token?/:valid?/:user?",
  UsersController.reset_password_mag
);

// //Activate account
router.get(
  "/account/active/:email?/:activeToken?/:expiryTime?",
  UsersController.activate_user
);

router.post("/company_check", UsersController.companyCheck);
router.get("/user_data", [auth], UsersController.UsersData);
router.post("/other_users", [auth], UsersController.other_users);
router.delete("/delete_user", [auth], UsersController.delete_users);
router.post("/add-otherUser", [auth], UsersController.otherUsers);
router.put(
  "/update_company",
  [auth, upload.single("image")],
  UsersController.update_company
);
module.exports = router;
