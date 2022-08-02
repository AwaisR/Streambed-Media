var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const contentController = require("../controller/contentStream");
///// content streams routes ///////////////
router.post("/add-content-stream", auth, contentController.addContent);
router.delete("/remove-content-stream", auth, contentController.removeContent);
router.get("/get-content-stream", auth, contentController.getContent);
router.put("/update-content-stream", auth, contentController.updateContent);
router.put(
  "/update-all-content-stream",
  auth,
  contentController.UpdateAllContent
);
module.exports = router;
