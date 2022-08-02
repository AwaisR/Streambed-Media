const proxy = require("http-proxy-middleware");
require("dotenv").config();
module.exports = function (app) {
  app.use(
    proxy("/uploads", {
      target: "http://localhost:5000/",
      changeOrigin: true,
    })
  );
};
