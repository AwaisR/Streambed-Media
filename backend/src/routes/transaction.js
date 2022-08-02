var express = require("express");
var router = express.Router();
const transactionController = require("../controller/transaction");
const { auth } = require("../middleware/auth");

router.get("/get-transection", [auth], transactionController.getTransactions);
router.post("/add-transection", [auth], transactionController.PostTransactions);
router.post(
  "/add-magnifyPrice",
  [auth],
  transactionController.PostMagnifyPrice
);
router.get(
  "/getOne-transection",
  [auth],
  transactionController.getOnetaransaction
);

module.exports = router;
