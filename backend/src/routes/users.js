var express = require("express");
var router = express.Router();
const UsersController = require("../controller/users");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const fetch = require("node-fetch");
/// Upload Profile image consumer-app /////
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const vid = uuidv4();
    req.vid = vid;
    const dir = `public/consumer-profiles/${vid}`;
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

/*POST user signup, posting to /users/signup with json will create entry in DB */
router.post("/signup", UsersController.user_sign_up);

/*POST this stores wallet and pub after the user is confrimed created with no errors */
router.post("/storePubAndWallet", UsersController.user_store_wallet_pub);

// Pretty much only used if session id still exist
router.get("/login", auth, UsersController.user_login_get);

//Acutal route to check login creds
router.post("/login", UsersController.user_login_post);

/****Route to forgot password*************/
router.post("/forgot-password", UsersController.user_forgot_pwd);

//Activate account
router.get(
  "/account/forgot-password/:email?/:activeToken?/:expiryTime?",
  UsersController.verify_reset_link
);
router.get(
  "/account/emailActive/:userID/:activeToken/:expiryTime",
  UsersController.activate_email
);
router.post(
  "/account/reset-password/:token?/:valid?/:user?",
  UsersController.reset_password
);

/***********Post others Emails */
router.post("/other-emails", auth, UsersController.user_email);
router.get("/other-emails", auth, UsersController.get_other_email);
router.put("/edit-other-emails", auth, UsersController.edit_other_email);
router.delete("/delete_other-emails", auth, UsersController.delete_other_email);

/****Route to reset password*************/
router.post("/reset", UsersController.user_resetpw);

// Refresh rT
router.get("/rt", auth, UsersController.user_rt);
router.get("/ref-token/:user", auth, UsersController.user_rt_by_id);
//Get the rT for frontend
router.get("/getrT", UsersController.user_getrT);

//Get the mnemonic for frontend
router.get("/getmnemonic", UsersController.user_getmnemonic);

//Get the mnemonic for frontend
router.post("/comparepw", UsersController.user_pw_compare);

//Remove rT from DB and unAuth
router.post("/deleterT", auth, UsersController.user_deleterT);

//Get publisher Id from DB
router.get("/pub", UsersController.user_pub);

//Get Twitter token object from DB
router.get("/getTwitterToken", auth, UsersController.get_user_twitter_token);

//Delete Twitter token object from DB
router.post(
  "/deleteTwitterToken",
  auth,
  UsersController.delete_user_twitter_token
);

//Get the user record
router.get("/getuser", auth, UsersController.user_get);

//Activate account
router.get(
  "/account/active/:email?/:activeToken?/:expiryTime?",
  UsersController.activate_user
);

//Get the user record
router.get("/get-create-user/:user?", UsersController.user_get_by_name);
// training
router.get("/set-training", auth, UsersController.updateTraining);
router.get("/get-training", auth, UsersController.getTraining);

// user email update
router.post("/email-update", auth, UsersController.user_email_update);

// Delete user record
router.delete("/account/delete/:activeToken", UsersController.delete_user);

router.put(
  "/editprofile",
  auth,
  upload.single("image"),
  UsersController.editProfile
);
// TODO: DELETE THIS ROUTE AND CONTROLLER
// used for devlopment -teseting only

router.delete("/account/delete/:email", UsersController.deleteByEmail);

router.post("/createWallet", UsersController.createWallet);

router.post("/backup-wallet", UsersController.backupWallet);

router.post("/password-reset", UsersController.resetPwdWallet);
router.put("/deactivate-account", auth, UsersController.deactivateAccount);

module.exports = router;
