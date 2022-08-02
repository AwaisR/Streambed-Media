const User_mag = require("../models/user_mag");
const Company = require("../models/company");
const bcrypt = require("bcrypt");
const client = require("../../client");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const jwtDecode = require("jwt-decode");
const sendMail = require("../../task-manager/mailer");
const auth = require("../middleware/auth");
const sendActivationEmail = require("../helper/ActivationEmail");
const signupEmailMagnify = require("../helper/signupEmailMagnify");
const resetPasswordEmailMagni = require("../helper/resetPasswordEmailMagni");
const moment = require("moment");
const ENCRYPTION_CONST = 8;
const { v4: uuidv4 } = require("uuid");
const wallet = require("../helper/UserWallet");
const CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");
const HDMW = require("oip-hdmw");
var mongoose = require("mongoose");
exports.activate_user = async (req, res, next) => {
  try {
    const { activeToken } = req.params;
    const user = await User_mag.findOne({
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
exports.user_sign_up_magnify = async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    userType,
    company_id,
  } = req.body;

  try {
    const company = await Company.findOne({ _id: company_id });
    const user = await User_mag.findOne({
      email: email,
    });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "Email already exist ",
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
          const user = new User_mag({
            email: email,
            password: hash,
            first_name: first_name,
            last_name: last_name,
            userType: userType ? userType : "Admin",
            memberSince: Date.now(),
            company: company_id,
          });

          user
            .save()
            .then((data) => {
              company.company_users.push(data._id);
              company.save().then(() => {});
              // Generate 20bit activation code
              crypto.randomBytes(20, function (err, buf) {
                // Ensure the activation code is unique.
                user.activeToken = user._id + buf.toString("hex");

                user.activeExpires = moment().add(1, "days");
                var link = `${
                  process.env.NODE_ENV === "development"
                    ? process.env.REACT_APP_URL_MAGNIFY
                    : process.env.REACT_APP_URL
                }account/active/${user.email}/${user.activeToken}/${
                  user.activeExpires
                } `;
                signupEmailMagnify(user, link);

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

              wallet(password, user._id);

              res.status(201).json({
                success: true,
                createdUser: user,
                token: token,
              });
            })
            .catch((err) => {
              res.status(500).json({
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

exports.user_login_post_magnify = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    let user = await User_mag.findOne({
      $or: [{ email }],
    }).populate("company", "_id company_name");

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
        msg:
          "It Seems you have not activated your account, please activate from your email",
        activated: false,
        user: user,
        success: false,
      });
    }
    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Please enter correct credentials" });
    }
    if (req.body.remember) {
      req.session.cookie.maxAge = 20000000000; //If they want to be remembered, its set maxAge to a ~8 months
    }
    // Issue token
    const payload = { userID: user["_id"], companyId: user.company._id };
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
      //   mnemonic: user.mnemonic,
      token: token,
      user: user,
      success: true,
    });
  } catch (e) {
    console.log("yes", e);
    res.status(200).json({
      msg: "something went wrong",
      success: false,
    });
  }
};

exports.user_forgot_pwd_mag = async (req, res, next) => {
  try {
    const { email, userType } = req.body;

    const existingUser = await User_mag.find({
      email: email,
    });
    if (existingUser.length) {
      const buff = await crypto.randomBytes(30);
      activeToken = buff.toString("hex");
      // valid for one days
      activeExpires = moment().add(1, "days");

      var link = `${
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_URL_MAGNIFY
          : process.env.REACT_APP_URL
      }users/account/forgot-password/${email}/${activeToken}/${activeExpires} `;
      var doc = await User_mag.findOneAndUpdate(
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
      const obj = {};
      existingUser &&
        existingUser.map(({ email, first_name, last_name }) => {
          return (
            (obj.email = email),
            (obj.first_name = first_name),
            (obj.last_name = last_name)
          );
        });
      resetPasswordEmailMagni(obj, link);
      res.status(201).json({ success: true, msg: "user Exist" });
    } else {
      res.status(404).json({
        success: false,
        msg: "Email does not exist",
      });
    }
  } catch (error) {
    console.log("something went wrong", error);
  }
};

exports.verify_reset_link = async (req, res, next) => {
  const { email, activeToken, expiryTime } = req.params;

  // check time
  //  check if the expire time > the current time       activeExpires: {$gt: Date.now()}
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

/////////second app reset-password ///////////
exports.reset_password_mag = async (req, res, next) => {
  try {
    const { email, token, valid, password, userType } = req.body;
    const user = await User_mag.findOne({
      activeToken: token,
      email: email,
    });
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
    user.activeToken = activeToken;
    await user.save();

    res.json({ success: true, msg: "ok" });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

exports.resetPwdWallet = async (req, res) => {
  try {
    const { data, pwArr } = req.body;
    const { mnemonic } = data;
    let deCrypt = AES.decrypt(mnemonic.toString(), pwArr[0]);
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
    let deCrypt = AES.decrypt(mnemonic.toString(), result.value[0]);
    let plaintext = deCrypt.toString(CryptoJS.enc.Utf8);

    return res.json({ success: true, msg: "ok", plaintext: plaintext });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

exports.UsersData = async (req, res) => {
  try {
    const user = await User_mag.findOne({ _id: req.userID }).populate(
      "company",
      "company_name company_img "
    );
    if (user) {
      res.json({
        success: true,
        message: "User get Successfully",
        data: user,
      });
    } else {
      res.json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (e) {
    console.log("error in fetching user", e);
  }
};

exports.user_updated = async (req, res) => {
  const { id, first_name, last_name, password, email, userType } = req.body;
  try {
    const existingUser = await User_mag.find();
    const existingUsers = await User_mag.findById(id);
    console.log("existingUsers", existingUsers);
    if (existingUser) {
      if (existingUser.email === email) {
        res.status(302).json({
          success: false,
          message: "Email already exist",
        });
      } else {
        var updateData = {};
        if (first_name) {
          updateData.first_name = first_name;
        }

        if (last_name) {
          updateData.last_name = last_name;
        }

        if (password) {
          const hash = await bcrypt.hash(password, 8);
          updateData.password = hash;
        } else {
          updateData.password = existingUsers.password;
        }
        if (userType) {
          updateData.userType = userType;
        }
        var activeToken;
        var activeExpires;

        if (email) {
          updateData.email = email;
        }
        const updatedData = await User_mag.update(
          { _id: id },
          {
            first_name: updateData.first_name,
            email: updateData.email,
            last_name: updateData.last_name,
            userType: updateData.userType,
            password: updateData.password,
          }
        );
        if (updateData) {
          res.json({
            success: true,
            message: "User Updated",
            updatedData: updatedData,
          });
        } else {
          res.json({
            success: false,
            message: "not updated",
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Someone already took this email",
      error: error,
    });
  }
};
const filterEmail = (data) => {
  const emails = data.map(({ email, active }) => {
    return {
      email,
      active,
    };
  });
  return emails;
};
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
exports.other_users = async (req, res) => {
  try {
    const { first_name, last_name, password, userType } = req.body;
    const email = req.body.email.trim();
    const isValidEmail = validateEmail(email);
    const users = await User_mag.find();
    const current_user = await User_mag.findById(req.userID);
    //current_user.other_email = [];

    if (isValidEmail) {
      const ExistEmail = current_user.other_user.some(
        (item) => item.email === email
      );
      if (ExistEmail) {
        return res.status(422).json({
          success: false,
          message: "Email already exist",
        });
      }
      for (user of users) {
        const ExistEmail = user.other_user.some((item) => item.email === email);
        if (ExistEmail) {
          return res.json({
            success: false,
            message: "someone already took this email",
          });
        } else if (user.email === email) {
          return res.json({
            success: false,
            message: "someone already took this email",
          });
        }
      }

      crypto.randomBytes(20, async function (err, buf) {
        // Ensure the activation code is unique.
        let obj = {};
        const hash = await bcrypt.hash(password, 8);
        obj.email = email;
        (obj.first_name = first_name),
          (obj.last_name = last_name),
          (obj.password = hash),
          (obj.userType = userType),
          (obj.activeToken = user._id + buf.toString("hex"));
        obj.activeExpires = moment().add(1, "days");
        obj.active = false;

        current_user.other_user.push(obj);
        current_user.save().then(() => {});
        const filtredData = filterEmail(current_user.other_user);
        res.status(200).json({
          success: true,
          message: "User added successfully",
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
exports.delete_users = async (req, res) => {
  try {
    const user_id = req.body.id;
    const company = await Company.findById(req.companyId);
    if (company) {
      company.company_users = company.company_users.filter((obj) => {
        return obj.toString() !== user_id;
      });
      await company.save();
      const Curent_user = await User_mag.findByIdAndDelete({ _id: user_id });
      if (Curent_user) {
        return res.json({
          success: true,
          message: "deleted successfully",
        });
      } else {
        res.json({
          success: false,
          message: " not found",
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
exports.update_company = async (req, res) => {
  try {
    const { company_name, description } = req.body;
    const existingUser = await User_mag.findById({ _id: req.userID });
    let obj = {};
    let filter = { _id: req.userID };
    if (existingUser) {
      if (company_name) {
        const varifyCompanyName = await User_mag.find({
          "company.company_name": company_name,
        });
        if (varifyCompanyName.length) {
          res.status(200).json({
            success: false,
            message: "Company already exist",
          });
        } else {
          if (company_name != "undefined") {
            obj.company_name = company_name;
          } else {
            obj.company_name = existingUser.company.company_name;
          }
        }
      }
      if (description != "undefined") {
        obj.description = description;
      } else {
        obj.description = existingUser.company.description;
      }
      if (req.fileName) {
        obj.company_img = `${req.dir}/${req.fileName}`;
      }
      const UpdateCompany = await User_mag.updateOne(
        { _id: req.userID },
        {
          "company.company_name": obj.company_name
            ? obj.company_name
            : existingUser.company.company_name,
          "company.company_img": obj.company_img
            ? obj.company_img
            : existingUser.company.company_img,
          "company.description": obj.description
            ? obj.description
            : existingUser.company.description,
        }
        // { $set: { "company.company_name": "asdf" } },
      );
      if (UpdateCompany) {
        res.status(200).json({
          success: true,
          msg: "Company updated",
        });
      } else {
        res.json({
          success: false,
          msg: "something went wrong",
        });
      }
    }
  } catch (e) {
    console.log("error in update company", e);
  }
};
exports.companyCheck = async (req, res) => {
  try {
    const { company_name, userType } = req.body;
    const varifyCompanyName = await User_mag.find({
      "company.company_name": company_name,
    });
    if (varifyCompanyName.length) {
      res.status(200).json({
        success: true,
        message: "Company already exist",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Company does not exist ",
      });
    }
  } catch (e) {
    console.log("error in varify email", e);
  }
};
exports.otherUsers = async (req, res) => {
  const { email, password, first_name, last_name, userType } = req.body;

  try {
    const company = await Company.findById(req.companyId);
    const user = await User_mag.findOne({
      email: email,
    });
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      res.status(403).json({
        success: false,
        message: "Enter a valid email",
      });
    } else {
      if (user) {
        return res.status(409).json({
          success: false,
          message: "Email already exist ",
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
            const user = new User_mag({
              email: email,
              password: hash,
              first_name: first_name,
              last_name: last_name,
              userType: userType ? userType : "Admin",
              memberSince: Date.now(),
              company: req.companyId,
            });

            user
              .save()
              .then((data) => {
                company.company_users.push(data._id);
                company.save().then(() => {});
                // Generate 20bit activation code
                crypto.randomBytes(20, function (err, buf) {
                  // Ensure the activation code is unique.
                  user.activeToken = user._id + buf.toString("hex");
                  user.activeExpires = moment().add(1, "days");
                  user.active = true;
                  let obj = {};
                  obj.email = data.email;
                  obj.first_name = data.first_name;
                  obj.last_name = data.last_name;
                  var link = `${process.env.REACT_APP_URL}users/account/forgot-password/${email}/${user.activeToken}/${user.activeExpires} `;
                  resetPasswordEmailMagni(obj, link);

                  user.save().then(() => {});
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

                wallet(password, user._id);

                res.status(201).json({
                  success: true,
                  createdUser: user,
                  message: "User added successfully",
                  token: token,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                  success: false,
                  msg: "something went wrong",
                });
              });
          }
        });
      }
    }
  } catch (e) {
    console.log("Error in addother user", e);
  }
};
