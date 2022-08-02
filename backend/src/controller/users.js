const User = require("../models/user");
const Youtube = require("../models/youtube.js");
const userVideo = require("../models/userVideo");
const twitterPost = require("../models/twitterPost");
const facebookPost = require("../models/facebook");
const instagramPost = require("../models/Instagram.js");
const bcrypt = require("bcrypt");
const client = require("../../client");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const jwtDecode = require("jwt-decode");
const sendMail = require("../../task-manager/mailer");
const auth = require("../middleware/auth");
const { checkTwitterToken } = require("../../twitter/helpers");
const sendActivationEmail = require("../helper/ActivationEmail");
const signupEmail = require("../helper/signupEmail");
const signupEmailMagnify = require("../helper/signupEmailMagnify");
const resetPasswordEmail = require("../helper/resetPasswordEmail");
const resetPasswordEmailMagni = require("../helper/resetPasswordEmailMagni");
const moment = require("moment");
const io = require("../../socket");
const ENCRYPTION_CONST = 8;
const { v4: uuidv4 } = require("uuid");
const wallet = require("../helper/UserWallet");
const CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");
const HDMW = require("oip-hdmw");
exports.activate_user = async (req, res, next) => {
  try {
    const { activeToken } = req.params;
    const user = await User.findOne({
      activeToken: req.params.activeToken,
    });
    if (!user) {
      return res.json({
        message: {
          title: "fail to activate",
          content: "Your activation link is invalid, please register again ",
          activated: false,
        },
      });
    }

    if (user.active) {
      return res.status(200).json({
        message: {
          sucess: true,
          content: "user already activated",
          activated: true,
        },
      });
    }

    //  check if the expire time > the current time       activeExpires: {$gt: Date.now()}
    if (new Date() - user.activeExpires > 0) {
      return res.json({
        message: {
          title: "fail to activate",
          content: "Your activation link is invalid, please register again ",
          activated: false,
        },
      });
    }

    user.active = true;
    user.save(function (err, user) {
      if (err) return next(err);

      // send activation welcome Email
      sendActivationEmail(user);

      res.json({
        message: {
          title: "Activated ",
          content: "Acccount activated sccuessfully",
          activated: true,
        },
      });
    });
  } catch (error) {
    console.log("something went wrong", error);
  }
};
exports.activate_email = async (req, res, next) => {
  try {
    const { activeToken, userID } = req.params;
    const user = await User.findById({
      _id: userID,
    });
    if (!user) {
      return res.status(404).json({
        message: {
          title: "fail to activate",
          content: "Your activation link is invalid, please register again ",
          activated: false,
        },
      });
    }
    let activeTokenflag = false;
    for (let i = 0; i < user.other_email.length; i++) {
      if (user.other_email[i].activeToken === activeToken) {
        if (user.other_email[i].active) {
          return res.json({
            message: "Your account is already active",
            success: false,
            title: "Already Active",
            activated: true,
          });
        }
        if (new Date() - user.other_email[i].activeExpires > 0) {
          return res.json({
            message: "Your activation link is invalid, please register again",
            success: false,
            title: "Fail to activate",
            activated: false,
          });
        }
        user.other_email[i].active = true;
        delete user.other_email[i].activeExpires;
        delete user.other_email[i].activeToken;
        activeTokenflag = true;
        break;
      }
    }
    if (activeTokenflag) {
      user.save(function (err) {
        if (err) return next(err);
        res.json({
          message: "Your Acccount activated sccuessfully",
          success: true,
          activated: true,
        });
      });
    } else {
      return res.json({
        message: "Your activation link is invalid, please register again",
        success: false,
        title: "your account does not found",
        activated: false,
      });
    }
  } catch (error) {
    console.log("something went wrong", error);
    return res.status(500).json({ success: false, error });
  }
};
exports.user_get_by_name = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.user })
      .select({
        _id: 1,
        email: 1,
        displayName: 1,
        memberSince: 1,
        twitterTokens: 1,
        rT: 1,
        channelName: 1,
        createdAt: 1,
        about: 1,
      })
      .lean();
    if (!user) {
      return res.json({ success: true, msg: "user record not found" });
    }

    const { twitterTokens, rT, ...rest } = user;

    rest.twitter = twitterTokens.screen_name;
    rest.youtube = rT.length > 0;
    const { screen_name } = user.twitterTokens;

    // const _userVideo = await userVideo.find({ userId: user.id });
    // var collaborated = [];
    let getColl = getCollaborator();

    const _userVideo = await userVideo.find();
    // let collaborated = await getColl(_userVideo);
    let collaborated = [];

    let ownVideo;
    if (_userVideo.length) {
      ownVideo = _userVideo.filter((video, index) => {
        collaborated = getColl(video);
        return video.userId.toString() == user._id.toString();
      });
    }
    const _twitterPost = await twitterPost.find();
    let _posts;
    if (_twitterPost.length) {
      _posts = _twitterPost.filter((post, index) => {
        collaborated = getColl(post);
        return post.author.toString() == user._id.toString();
      });
    }

    const _facebookPost = await facebookPost.find();
    const _instagramPost = await instagramPost.find();

    let facebook = [];

    facebook = _facebookPost.filter((post, index) => {
      collaborated = getColl(post);
      // if (!post.author) return false;
      return post.author && post.author.toString() == user._id.toString();
    });

    let instagram = [];
    instagram = _instagramPost.filter((post, index) => {
      collaborated = getColl(post);
      return post.author.toString() === user._id.toString();
    });

    function getCollaborator() {
      let collaborator = [];
      return function (post) {
        // if (posts.length) {
        // await posts.forEach((post, index) => {
        let filter = post.collaborators.find(
          (coll) => coll.user === user.displayName || coll.user === user.email
        );
        if (filter) {
          collaborator.push(post);
        }
        // });
        // }
        return collaborator;
      };
    }
    // let collaborated = await getColl(_userVideo);
    // if (_userVideo.length) {
    //   await _userVideo.forEach((video, index) => {
    //     let _filter = video.collaborators.find(
    //       (coll) => coll.verified && coll.user === user.displayName
    //     );
    //     if (_filter) {
    //       // return video;
    //       collaborated.push(video);
    //     }
    //   });
    // }

    // res.json({ user });
    return res.json({
      msg: "ok",
      user: rest,
      params: req.params.user,
      ownVideo,
      collaborated,
      twitter: _posts,
      facebook,
      instagram,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// TODO: add more field as needed for front end
exports.user_get = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userID }).select({
      displayName: 1,
      email: 1,
      dateofBirth: 1,
      about: 1,
      active: 1,
      memberSince: 1,
      profileImage: 1,
      _id: 1,
    });
    res.json({ user });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.delete_user = async (req, res) => {
  try {
    await User.deleteOne({ activeToken: req.params.activeToken });
    res.json({
      message: {
        content: "delete",
        success: true,
      },
    });
  } catch (error) {
    return res.json({
      message: {
        content: "Something went wrong",
        success: false,
      },
    });
  }
};

/***USER CREATION,Currently hashes password using bcrypt, it also checks if email was used and wont let another user be created with the same email twice */
exports.user_sign_up = async (req, res) => {
  const { displayName, email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ displayName: displayName }, { email: email }],
    });

    if (user) {
      return res.status(409).json({
        error: "Display name or email already exists",
        success: false,
        msg: "Display name or email already exists",
      });
    } else {
      bcrypt.hash(password, ENCRYPTION_CONST, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
            success: false,
            msg: "something went wrong, try again later",
          });
        } else {
          const user = new User({
            displayName: displayName,
            email: email,
            password: hash,
            memberSince: Date.now(),
          });

          user
            .save()
            .then(() => {
              // Generate 20bit activation code
              crypto.randomBytes(20, function (err, buf) {
                // Ensure the activation code is unique.
                user.activeToken = user._id + buf.toString("hex");

                user.activeExpires = moment().add(1, "days");
                var link = `${process.env.APP_URL_build}account/active/${user.email}/${user.activeToken}/${user.activeExpires} `;
                signupEmail(user, link);

                user.save().then(() => {});

                // return res.json(user);
              });

              // Issue token
              req.session.userId = user._id;
              const payload = { userID: user["_id"] };
              const token = jwt.sign(
                {
                  payload,
                },
                process.env.SECRET_CODE_JWT,
                { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }
              );

              wallet(password, displayName, user._id);

              res.status(201).json({
                success: true,
                createdUser: user,
                token: token,
              });
            })
            .catch((err) => {
              res.status(400).json({
                error: err,
                success: false,
                msg: "something went wrong",
              });
            });
        }
      });
    }
  } catch (e) {
    console.log("somethign went wrong", e);
  }
};

////////second user create
/***User creation end*/

/***user update email */
exports.user_email_update = (req, res) => {
  // TODO! seems not in used.
  // to be verify
  res.send({ msg: "ok", ID: req.userID });
};
/***user update email end */

/***This is called after user is created without errors, it then stores the create wallet and pubKey */
exports.user_store_wallet_pub = async (req, res) => {
  try {
    // TODO! session.id or token reivew what
    const { mnemonic, pub, userID } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: userID },
      { $set: { mnemonic: mnemonic, pub: pub } }
    );
    res.status(200).json({ success: true, msg: "All Good!" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

/******Login GET */
exports.user_login_get = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userID });
    if (!user) {
      res.status(400).send({ error: "User Does not exist" });
    }

    // If session id doesn't exist skips redirects back to login page
    if (!userId) {
      res.redirect("/");
    } else {
      // Issue token
      const payload = { userID: user["_id"] };
      const token = jwt.sign(
        {
          payload,
        },
        process.env.SECRET_CODE_JWT,
        { expiresIn: "1d" }
      );
      res.status(201).send({ token: token, user: user });
    }
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).json({ success: false, msg: "server Error" });
  }
};
/****Login Get End */

/**Login POST */
exports.user_login_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({
      $or: [
        { email },
        { displayName: email },
        { other_email: { $elemMatch: { email } } },
      ],
    });
    if (user) {
      if (user.other_email) {
        var optionalEmail =
          user.other_email &&
          user.other_email.find((obj) => obj.email == email);
      }
    }
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Please enter correct credentials" });
    } else if (!user.active) {
      if (user.activeExpires - new Date()) {
        return res.status(401).json({
          msg: "It Seems activation code is expired, please try again",
          activated: false,
          success: false,
        });
      }
      return res.status(401).json({
        msg: "It Seems you have not activated your account, please activate from your email",
        activated: false,
        user: user,
        success: false,
      });
    } else if (optionalEmail) {
      if (!optionalEmail.active) {
        return res.status(401).json({
          msg: "It Seems you have not activated your account, please activate from your email",
          activated: false,
          user: user,
          success: false,
        });
      }
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Please enter correct credentials" });
    }
    if (req.body.remember) {
      req.session.cookie.maxAge = 20000000000; //If they want to be remembered, its set maxAge to a ~8 months
    }
    // Issue token
    const payload = { userID: user["_id"] };
    const token = jwt.sign(
      {
        payload,
      },
      process.env.SECRET_CODE_JWT,
      { expiresIn: "1d" }
    );
    req.session.userId = user["_id"];
    res.status(200).json({
      msg: "this good",
      mnemonic: user.mnemonic,
      token: token,
      user: user,
      success: true,
    });
  } catch (e) {
    res.redirect("/?error=" + e);
  }
};

/**Login POST End*/

/** forgot password */
exports.user_forgot_pwd = async (req, res, next) => {
  try {
    const email = req.body.email;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const buff = await crypto.randomBytes(30);
      activeToken = buff.toString("hex");
      // valid for one days
      activeExpires = moment().add(1, "days");

      var link = `${process.env.APP_URL_build}users/account/forgot-password/${email}/${activeToken}/${activeExpires} `;

      var doc = await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            activeToken: activeToken,
            activeExpires: activeExpires,
          },
        },
        {
          new: true,
        }
      );
      resetPasswordEmail(existingUser, link);
      res.status(201).json({ success: true, msg: "user Exist" });
    } else {
      res.status(404).json({
        success: true,
        msg: "user do not exist",
      });
    }
  } catch (error) {
    console.log("something went wrong", error);
  }
};

exports.verify_reset_link = async (req, res, next) => {
  const { email, activeToken, expiryTime } = req.params;

  if (new Date() - expiryTime > 0) {
    return res.json({
      success: false,
      message: {
        title: "fail to reset Password",
        content: "It seems the reset password in invalid ",
        reset: false,
      },
    });
  }
  // check the user with activetoken

  const user = await User.findOne({
    activeToken: activeToken,
  });
  if (!user) {
    return res.redirect(
      `${process.env.APP_URL_build}reset-password?token=${activeToken}&valid=false&user=${email}`
    );
  }

  // here redirect user to reset password page
  return res.redirect(
    `${process.env.APP_URL_build}reset-password?token=${activeToken}&valid=true&user=${email}`
  );
};

exports.reset_password = async (req, res, next) => {
  try {
    const { email, token, valid, password } = req.body;
    const user = await User.findOne({ activeToken: token, email: email });
    if (!valid) {
      return res
        .status(400)
        .json({ success: false, msg: "something went wrong" });
    }
    if (!user) {
      return res.status(400).json({ success: false, msg: "record not found" });
    }

    // change password

    const passHash = await bcrypt.hash(password, 8);
    if (!passHash) {
      return res.status(500).json({ success: false, msg: "Server Error" });
    }
    user.password = passHash;
    const buff = await crypto.randomBytes(30);
    activeToken = buff.toString("hex");
    // dont allow user to use same link again for activation
    user.activeToken = activeToken;
    await user.save();

    res.json({ success: true, msg: "ok" });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

/////////second app reset-password ///////////

/****Reset password */
/****Also set newly encrypted mnemoic with new pw as secret key */
exports.user_resetpw = async (req, res) => {
  try {
    // TODO change to auth
    //decode token first
    var decoded = await jwtDecode(req.headers["authorization"]);
    const { userID } = decoded.payload;

    const pass = req.body.password;
    const mnemonic = req.body.encryption;
    bcrypt.hash(pass, 8, (err, hash) => {
      User.findOneAndUpdate(
        { _id: userID },
        { $set: { password: hash, mnemonic: mnemonic } }
      ).then(() => console.log(hash));
    });
  } catch (error) {
    console.log("Errorr");
  }
};
/****Reset password End*/

const decodeToken = async (req) => {
  try {
    //decode token first
    var decoded = await jwtDecode(req.headers["authorization"]);
    const { userID } = decoded.payload;
    return userID;
  } catch (error) {
    console.log("Errorr", error);
    return false;
  }
};
//Retrieves the stored refreshToken and sets it in the client.js so the accessToken can be refreshed
/******Remember and rT GET */
exports.user_rt = async (req, res) => {
  const userID = await decodeToken(req);

  try {
    const rememberInfo = await User.findOne(
      {
        _id: userID,
      },
      ["rT"]
    );
    let { rT } = rememberInfo;

    client.refresh(userID, rT);
    const aT = await client.getNewAcc(userID);

    res.header("authorization", aT);
    return res.status(200).json({ aT: aT });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, msg: "Server Error", error: error });
  }
};
exports.user_rt_by_id = async (req, res) => {
  // TODO! handle invalid/expire/rovoke tokens
  try {
    const _user = await User.findOne({ _id: req.headers["owner"] });

    if (!_user) {
      return res
        .status(200)
        .json({ success: false, msg: "user record not found" });
    }

    let { rT } = _user;

    if (rT) {
      client.refresh(_user._id, rT);
      const aT = await client.getNewAcc(_user._id);

      res.header("authorization", aT);
      return res.status(200).json({
        success: true,
        authorization: aT,
        publisherName: _user.displayName,
      });
    } else {
      res.status(200).json({ success: false, msg: "user record not found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error: error });
  }
};

/******Get rT value*/
exports.user_getrT = async (req, res, next) => {
  const userID = await decodeToken(req);
  try {
    const remember = await User.findOne(
      {
        _id: userID,
      },
      {
        rT: 1,
        channelName: 1,
        twitterTokens: 1,
        zoom: 1,
        zoom_rT: 1,
        instagram: 1,
        facebook: 1,
        linkedin: 1,
      }
    );
    const {
      rT,
      channelName,
      twitterTokens: { screen_name },
      zoom,
      zoom_rT,
      instagram,
      facebook,
      twitterTokens,
      linkedin,
    } = remember;

    if (facebook.access_token.length) {
      facebook.access_token = uuidv4();
    }
    if (linkedin.access_token.length) {
      linkedin.access_token = uuidv4();
    }
    const _pages = facebook.pages.map((item) => {
      item.access_token = uuidv4();
      return item;
    });

    facebook.pages = _pages;

    res.json({
      rT,
      channelName: channelName,
      screen_name,
      zoom,
      zoom_rT,
      instagram,
      facebook,
      zoomIsActive: zoom_rT.length > 5,
      twitterTokens,
      linkedin,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error", error: error });
  }
};
/****get rT Get End */

/****Delete rT from DB */
exports.user_deleterT = async (req, res) => {
  try {
    const { rt } = req.body;

    client.getOuttaHere(req.userID);
    const remember = await User.findOneAndUpdate(
      { _id: req.userID },
      { $set: { rT: "", channelName: "" } }
    );

    res.removeHeader("Authorization");
    res.status(201).json({
      msg: "Signed out of Youtube",
    });
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error" });
  }
};

/****End Delete rT from DB */

/******Get mnemonic from db*/
exports.user_getmnemonic = async (req, res) => {
  try {
    var decoded = await jwtDecode(req.headers["authorization"]);
    const { userID } = decoded.payload;
    const remember = await User.findOne(
      {
        _id: userID,
      },
      "mnemonic"
    );
    const { mnemonic } = remember;
    res.status(201).json({
      mnemonic,
    });
  } catch (error) {
    console.log("something went wrong", error);

    res.status(500).send({ success: false, msg: "Server Error" });
  }
};
/****Get mnemonic from db End */

/**Fetch password to compare before reset */
exports.user_pw_compare = async (req, res) => {
  try {
    const { password } = req.body;
    var decoded = await jwtDecode(req.headers["authorization"]);
    const { userID } = decoded.payload;
    let user = await User.findOne(
      {
        _id: userID,
      },
      ["password", "mnemonic"]
    );
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(409)
        .json({ success: false, msg: "Incorrect Password" });
    }
    res.status(200).json({
      success: true,
      msg: "Success! Your password has been changed!",
      mnemonic: user.mnemonic,
    });
  } catch (e) {
    console.log("something went wrong", e);

    res.status(200).json({ msg: "Error!", mnemonic: user.mnemonic });
  }
};
/**Fetch password to compare before reset End*/

/**Fetch pub */
exports.user_pub = async (req, res) => {
  try {
    let user = await User.findOne(
      {
        _id: req.session.userId,
      },
      "pub"
    );
    res.status(201).json({ pub: user.pub });
  } catch (e) {
    console.log("something went wrong", e);
  }
};
/**Fetch Twitter Token */
exports.get_user_twitter_token = async (req, res) => {
  try {
    if (!req.userID) {
      return res.redirect("/users/login");
    }
    let user = await User.findById(req.userID);
    if (checkTwitterToken(user.twitterTokens || {})) {
      const { screen_name, user_id } = user.twitterTokens;
      res.status(200).json({ isActive: true, screen_name, user_id });
    } else {
      res.status(200).json({ isActive: false });
    }
  } catch (e) {
    console.log("something went wrong", e);
  }
};

/**Delete Twitter Token */
exports.delete_user_twitter_token = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      {
        _id: req.userID,
      },
      {
        twitterTokens: {
          oauth_token: "",
          oauth_token_secret: "",
          user_id: "",
          screen_name: "",
        },
      }
    );

    res.status(200).send();
  } catch (e) {
    console.log("something went wrong", e);

    console.log(e);
  }
};
/**Fetch pub */

exports.editProfile = async (req, res) => {
  const { name, password, currentPassword, email, DoB, about } = req.body;
  console.log(" req.fileName", req.fileName);
  try {
    const existingUser = await User.findOne({
      $or: [{ displayName: name }, { email: email }],
    });
    if (existingUser) {
      if (existingUser.displayName === name) {
        res
          .status(302)
          .json({ success: false, msg: "User Name already exist" });
      } else if (existingUser.email === email) {
        res.status(302).json({
          success: false,
          msg:
            "Email already exist" +
            existingUser.email +
            existingUser.displayName,
        });
      }
    }
    const user = await User.findOne({ _id: req.userID });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ success: false, msg: "Please enter correct credentials" });
    }
    var updateData = {};
    if (name) {
      updateData.displayName = name;
    }

    if (password) {
      const hash = await bcrypt.hash(password, 8);
      updateData.password = hash;
    }
    if (about) {
      updateData.about = about;
    }

    if (DoB) {
      updateData.dateofBirth = DoB;
    }
    if (req.fileName) {
      updateData.profileImage = `${req.dir}/${req.fileName}`;
    }
    const filter = { _id: req.userID };

    var activeToken;
    var activeExpires;

    if (email) {
      updateData.email = email;
      updateData.active = false;
      try {
        const buff = await crypto.randomBytes(20);
        activeToken = req.userID + buff.toString("hex");
        activeExpires = moment().add(1, "days");
        var link = `${process.env.APP_URL_build}account/active/${email}/${activeToken}/${activeExpires} `;

        signupEmail(
          { email: email, displayName: user.displayName },
          link,
          "Email updated"
        );
        updateData.activeToken = activeToken;
        updateData.activeExpires = activeExpires;
      } catch (error) {
        return res.json({
          success: false,
          msg: "something went wrong",
        });
      }

      var doc = await User.findOneAndUpdate(
        filter,
        {
          $set: updateData,
        },
        {
          new: true,
        }
      );
    } else {
      var doc = await User.findOneAndUpdate(
        filter,
        {
          $set: updateData,
        },
        {
          new: true,
        }
      );
    }

    var response = {
      success: true,
      msg: "changes saved",
    };

    if (doc.email !== user.email) {
      response.msg = `Changes saved \n\n An email has been sent to ${doc.email} . \n\n Your email will be updated once you have verified your new address`;
      response.emailUpdate = true;
    }

    return res.json(response);
  } catch (error) {
    console.log("something went wrong", error);
    return res.json({
      success: false,
      msg: "something went wrong",
      error: error,
    });
  }
};

exports.updateTraining = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.userID },
      {
        $set: { training: false },
      },
      {
        new: true,
      }
    );

    res.json({ success: true, msg: "successfully updated record", user: user });
  } catch (error) {
    console.log("something went wrong", error);
  }
};
exports.getTraining = async (req, res) => {
  try {
    let user = await User.findById(req.userID);
    if (!user) {
      return res.json({
        success: false,
        msg: "not found",
        user: user,
      });
    }
    res.json({
      success: true,
      msg: "record found",
      training: user.training,
    });
  } catch (error) {
    console.log("something went wrong", error);
    res.status(500).json({
      success: false,
      msg: "server error",
    });
  }
};

exports.createWallet = async (req, res) => {
  try {
    const { mnemonic, password } = req.body;

    let deCrypt = AES.decrypt(mnemonic, password);
    let plaintext = deCrypt.toString(CryptoJS.enc.Utf8);
    const Wallet = HDMW.Wallet;
    let wif = new Wallet(plaintext, {
      supported_coins: ["flo"],
      discover: false,
    })
      .getCoin("flo")
      .getAccount(0)
      .getMainAddress()
      .getPrivateAddress();
    return res.json({ success: true, msg: "ok", wif: wif });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

exports.resetPwdWallet = async (req, res) => {
  try {
    const { data, pwArr } = req.body;
    const { mnemonic } = data;
    let deCrypt = AES.decrypt(mnemonic.toString(), pwArr);
    let plaintext = deCrypt.toString(CryptoJS.enc.Utf8);
    let encryption = AES.encrypt(plaintext, pwArr[1]).toString();

    return res.json({ success: true, msg: "ok", encryption: encryption });
  } catch (error) {
    console.log("something went wrong ", error);
  }
};

exports.backupWallet = async (req, res) => {
  try {
    const { data, result } = req.body;
    const { mnemonic } = data;

    let deCrypt = AES.decrypt(mnemonic.toString(), result);
    let plaintext = deCrypt.toString(CryptoJS.enc.Utf8);

    return res.json({ success: true, msg: "ok", plaintext: plaintext });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

// TODO: DELETE THIS
// used to delete user record by email
//  FOR DEVELOPMENT ONLY

exports.deleteByEmail = async (req, res) => {
  try {
    let user = await User.findOneAndDelete({
      email: req.params.email,
    });
    res.status(201).json({ user });
  } catch (e) {
    console.log("something went wrong", e);
  }
};
const filterEmail = (data) => {
  const emails = data.map(({ email, active, activeToken, activeExpires }) => {
    return {
      email,
      active,
      activeToken,
      activeExpires,
    };
  });
  return emails;
};
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
exports.user_email = async (req, res) => {
  try {
    const email = req.body.email.trim();
    const isValidEmail = validateEmail(email);
    const users = await User.find();
    const current_user = await User.findById(req.userID);

    if (isValidEmail) {
      const ExistEmail = current_user.other_email.some(
        (item) => item.email === email
      );
      if (ExistEmail) {
        return res.status(422).json({
          success: false,
          message: "Email already exist",
        });
      }
      for (user of users) {
        const ExistEmail = user.other_email.some(
          (item) => item.email === email
        );
        if (ExistEmail) {
          return res.json({
            success: false,
            message: "someone already took this email",
          });
        }
      }

      if (current_user.other_email.length > 4) {
        return res.status(422).json({
          success: false,
          message: "maximum no of emails storage reached",
        });
      }

      crypto.randomBytes(20, function (err, buf) {
        // Ensure the activation code is unique.
        let obj = {};
        obj.email = email;
        obj.activeToken = user._id + buf.toString("hex");
        obj.activeExpires = moment().add(1, "days");
        obj.active = false;
        var link = `${process.env.APP_URL}users/account/emailActive/${req.userID}/${obj.activeToken}/${obj.activeExpires}/addEmail`;
        let t = {};
        t.email = email;
        t.displayName = current_user.displayName;
        signupEmail(t, link, "Activate your new email");
        current_user.other_email.push(obj);
        current_user.save().then(() => {});
        const filtredData = filterEmail(current_user.other_email);
        res.status(200).json({
          success: true,
          message: "email added successfully",
          email: filtredData,
        });
      });

      // await current_user.save();
    } else {
      res.status(422).json({
        success: false,
        message: "Please Enter valid Email",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
    console.log("something went wrong", e);
  }
};

exports.get_other_email = async (req, res) => {
  try {
    const users_emails = await User.findById(req.userID);
    if (users_emails) {
      const filtredData = await filterEmail(users_emails.other_email);

      return res.status(201).json({
        success: true,
        email: filtredData,
        primary_email: users_emails.email,
        message: "Email get successfully",
      });
    } else {
      res.status(422).json({
        success: false,
        message: "user not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
    console.log("something went wrong", e);
  }
};
exports.delete_other_email = async (req, res) => {
  try {
    const user_email = req.body.email.trim();
    const users_emails = await User.findById(req.userID);
    if (users_emails) {
      const Index = users_emails.other_email.findIndex(
        (obj) => obj.email == user_email
      );
      if (Index > -1) {
        users_emails.other_email.splice(Index, 1);
        const emails = await filterEmail(users_emails.other_email);

        await users_emails.save();
        return res.json({
          success: true,
          message: "deleted successfully",
          email: emails,
        });
      } else {
        res.json({
          success: false,
          message: "email not found",
        });
      }
    } else {
      res.status(422).json({
        success: false,
        message: "user not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
    console.log("something went wrong", e);
  }
};
exports.edit_other_email = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("tesssssssssst", email);
    const _user = await User.updateOne(
      { _id: req.userID },
      { other_email: email }
    );
    res.json({
      success: true,
      msg: "Email Updated Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      msg: "something went wrong",
    });
  }
};
exports.deactivateAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({ _id: req.userID });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ success: false, msg: "Please enter correct credentials" });
    }
    const filter = { _id: req.userID };
    var doc = await User.findOneAndUpdate(filter, {
      active: false,
    });
    res.json({
      success: true,
      msg: "Account deactivated Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      msg: "something went wrong",
    });
  }
};
