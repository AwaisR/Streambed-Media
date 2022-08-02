require("dotenv").config();
var _ = require("lodash");
var nodemailer = require("nodemailer");
const io = require("../socket");
const config = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    // user: "info@streambedmedia.com",
    // pass: "Str3amb3dAdm1n!",
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
};
let transporter = nodemailer.createTransport(config);

var defaultMail = {
  from: "info@streambedmedia.com",
  to: "dev.saqi@gmail.com",
  subject: "Registration successfull ",
  text: "Streambed app",
};

const sendMail = (mail) => {
  // use default setting
  mail = _.merge({}, defaultMail, mail);

  // send email
  transporter.sendMail(mail, function (error, info) {
    if (error) return console.log(error);
    io.emit("message", {
      message: "Mail has been sent to your email  please verify it.",
    });
    console.log("Email sent");
  });
};

module.exports = sendMail;
