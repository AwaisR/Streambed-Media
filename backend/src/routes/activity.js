var express = require("express");
var router = express.Router();

const getweeklyAnalytics = require("../controller/analytics.js");

router.get("/get-weekly-report", getweeklyAnalytics);

module.exports = router;
