var express = require("express");
var router = express.Router();
const PostController = require("../controller/posts");
const { auth } = require("../middleware/auth");

router.get("/get-video", [auth], PostController.get_video);
router.post("/stripe-payment", PostController.StripePayment);

module.exports = router;
