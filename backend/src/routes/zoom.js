require("dotenv").config();
var fs = require("fs");
var moment = require("moment");
var cookie = require("cookie");
var express = require("express");
var session = require("express-session");
var { auth } = require("../middleware/auth");
// Use the request module to make HTTP requests from Node
const request = require("request");
const user = require("../models/user");
var router = express.Router();
const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;
const axios = require("axios");

var jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
router.get("/get-zoom", auth, (req, res, next) => {
  let url =
    `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${process.env.r_t}` +
    "&redirect_uri=" +
    process.env.redirectURL;

  axios
    .post(
      url,
      {},
      {
        auth: {
          username: process.env.ZOOM_CLIENT_ID,
          password: process.env.ZOOM_CLIENT_SECRET,
        },
      }
    )
    .then(function (response) {
      return res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  // return res.json({ msg: "ok", succes: true });
});

router.get("/zoom-auth", async (req, res) => {
  // Step 1:
  // Check if the code parameter is in the url
  // if an authorization code is available, the user has most likely been redirected from Zoom OAuth
  // if not, the user needs to be redirected to Zoom OAuth to authorize

  if (req.query.code) {
    // Step 3:
    // Request an access token using the auth code

    let token = req.query.state.replace(/^"(.*)"$/, "$1"); // verify token

    jwt.verify(token, process.env.SECRET_CODE_JWT, async (err, data) => {
      if (err) {
        console.log("error auth.js", err);
        return res
          .status(403)
          .json({ success: false, msg: "Authorization failed", token });
      }
    });
    //decode token first
    var decoded = await jwtDecode(token);
    const { userID } = decoded.payload;
    req.userID = userID;
    //

    let url =
      "https://zoom.us/oauth/token?grant_type=authorization_code&code=" +
      req.query.code +
      "&redirect_uri=" +
      process.env.redirectURL;

    request
      .post(url, async (error, response, body) => {
        const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;
        // Parse response to JSON
        body = JSON.parse(body);

        // find user
        var _user = await user.findById(userID);

        _user.zoom_rT = body.refresh_token;

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("zoom_access_token", "body.access_token", {
            httpOnly: true,
            maxAge: 60 * 60 * 1, // 1 hr
          })
        );

        if (body.access_token) {
          // Step 4:
          // We can now use the access token to authenticate API calls

          const access_token = body.access_token;
          request
            .get(
              "https://api.zoom.us/v2/users",
              async (error, response, body) => {
                if (error) {
                  console.log("API Response Error: ", error);
                } else {
                  body = JSON.parse(body);

                  _user.zoom = body.users[0];
                  await _user.save();
                  // Display response in console

                  res.redirect(
                    `${process.env.APP_URL}settings/link?access_token=${access_token}`
                  );
                }
              }
            )
            .auth(null, null, true, body.access_token);
        } else {
          // Handle errors, something's gone wrong!
        }
      })
      .auth(process.env.ZOOM_CLIENT_ID, process.env.ZOOM_CLIENT_SECRET);

    return;
  }
  // Step 2:
  // If no authorization code is available, redirect to Zoom OAuth to authorize
  res.redirect(
    "https://zoom.us/oauth/authorize?response_type=code&client_id=" +
      process.env.ZOOM_CLIENT_ID +
      "&redirect_uri=" +
      process.env.redirectURL +
      "&user=" +
      req.userID
  );
});

const revokeAccessToken = () => {};

router.get("/zoom-revoke-access", auth, async (req, res) => {
  let access_token = req.query.access_token;

  var _user = await user.findById(req.userID).select({ zoom_rT: 1 });

  if (
    typeof req.query.access_token == undefined ||
    !req.query.access_token ||
    req.query.access_token == "undefined"
  ) {
    const data = await _getAccessToken(_user.zoom_rT, req.userID);
    access_token = await data.access_token;
  }

  const url = `https://zoom.us/oauth/revoke?token=${access_token}`;

  axios
    .post(
      url,
      {},
      {
        auth: {
          username: process.env.ZOOM_CLIENT_ID,
          password: process.env.ZOOM_CLIENT_SECRET,
        },
      }
    )
    .then(async function (response) {
      const query = `${req.userID}`;

      const update = {
        $set: {
          zoom_rT: "",
          zoom: {},
        },
      };
      const options = { returnNewDocument: true };

      var _user = await user.findByIdAndUpdate(query, update, options);

      return res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
});

const _getAccessToken = async (rT, userID) => {
  // Step 3:
  // Request an access token using the auth code
  let url = `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${rT}
    &redirect_uri=${process.env.redirectURL}`;
  let _token = {};

  const getAccessToken = new Promise((resolve, reject) => {
    request
      .post(url, (error, response, body) => {
        const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

        _token = body;

        const { access_token, token_type, refresh_token } = body;
        if (error) {
          reject({ success: false, msg: "something went wrong!" });
          return;
        }
        resolve({
          success: true,
          body: JSON.parse(body),
        });
      })
      .auth(ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET);
  });
  return await getAccessToken
    .then(async (data) => {
      const {
        body: { refresh_token, access_token },
      } = data;
      // find user
      // TODO! dynamic user should get updated
      var _user = await user.findById(userID);

      _user.zoom_rT = refresh_token;
      await _user.save();
      return { success: true, msg: "ok", access_token: access_token };
    })
    .catch((error) => {
      console.log("something went wrong", error);
      return { success: false, body: error };
    });
};
router.get("/zoom-access-token", auth, async (req, res) => {
  var _user = await user.findById(req.userID).select({ zoom_rT: 1 });

  const data = await _getAccessToken(_user.zoom_rT, req.userID);

  return res.json({ data });
});

router.get("/oauthcallback/:code?", async (req, res, next) => {
  const url = `https://zoom.us/oauth/token?grant_type=code&code=${req.query.code}`;

  const _key = `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`;

  let buff = new Buffer.from(_key);
  let base64data = await buff.toString("base64");

  await axios
    .post(url, {
      headers: {
        Authorization: `Basic ${base64data}`,
      },
    })
    .then(function (response) {})
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });

  return res.json({ msg: "ok", succes: true });
});

router.get("/get-user", (req, res) => {
  const access_token = req.query.access_token;
  request
    .get("https://api.zoom.us/v2/users", async (error, response, body) => {
      if (error) {
        return res.json({ success: false, error });
      } else {
        body = JSON.parse(body);

        return res.json({ success: true, msg: "ok", body });
      }
    })
    .auth(null, null, true, access_token);
});
router.get("/download-recording", async (req, res) => {
  let { access_token, download_url } = req.query;

  axios
    .get(download_url + "?access_token=" + access_token, {
      responseType: "stream",
    })
    .then((data) => {
      data.data.pipe(res);
    });
});
router.get("/get-recordings", auth, (req, res) => {
  let access_token = req.query.access_token;
  const today = moment().format("yyyy-MM-DD");
  // TODO make dates dynamic, add pagination
  request
    .get(
      `https://api.zoom.us/v2/users/me/recordings?from=2019-04-01&to=${today}`,
      async (error, response, body) => {
        if (error) {
          // console.log("API Response Error: ", error);
          return res.json({ success: false, error });
        } else {
          body = JSON.parse(body);
          if (body.code === 124) {
            var _user = await user.findById(req.userID).select({ zoom_rT: 1 });
            const data = await _getAccessToken(_user.zoom_rT, req.userID);
            access_token = data.access_token;
            // return res.redirect("/api/zoom/zoom-access-token");
          }

          return res.json({ success: true, msg: "ok", body });
        }
      }
    )
    .auth(null, null, true, access_token);
});

module.exports = router;
