require("dotenv");
var jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    //  if no token found return
    if (req.headers["authorization"] == "null") {
      return res
        .status(401)
        .json({ success: false, msg: "authorization failed" });
    } else {
      // TODO! add access and refresh token

      // remove quotes from beginning and end
      let token = req.headers["authorization"].replace(/^"(.*)"$/, "$1"); // verify token

      jwt.verify(
        token.includes("Bearer") ? token.split(" ")[1] : token,
        process.env.SECRET_CODE_JWT,
        async (err, data) => {
          if (err) {
            return res
              .status(403)
              .json({ success: false, msg: "Authorization failed", token });
          }
          //decode token first
          var decoded = await jwtDecode(token);
          const { userID } = decoded.payload;
          const { companyId } = decoded.payload;
          req.userID = userID;
          req.companyId = companyId;
          next();
        }
      );
    }

    // return userID;
  } catch (error) {
    console.log("Errorr", error);
    // next();
    return res.redirect("/login");
    // return res
    //   .status(401)
    //   .json({ success: false, msg: "you are not authorized", error });
    // return false;
  }
};
