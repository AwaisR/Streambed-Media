const Transaction = require("../models/transaction");
const auth = require("../middleware/auth");
exports.getTransactions = async (req, res) => {
  try {
    const getTransactions = await Transaction.find({ userId: req.userID });
    res.json({
      message: "get successfully",
      data: getTransactions,
    });
  } catch (error) {
    console.log("something went wrong", error.message);
  }
};
exports.PostTransactions = async (req, res) => {
  try {
    const { type, Date, amount, remaining } = req.body;
    const transaction = await new Transaction({
      userId: req.userID,
      type: type,
      amount: amount,
      remaining: parseInt(remaining) + parseInt(amount),
      totalBalance: remaining,
    });
    await transaction
      .save()
      .then((data) => {
        res.status(201).json({
          success: true,
          msg: "transection created Succesfully",
          transaction: data,
        });
      })
      .catch((e) => {
        res.status(500).json({
          success: false,
          msg: "something went wrong",
          error: e,
        });
      });
  } catch (error) {
    console.log("something went wrong", error.message);
  }
};
exports.PostMagnifyPrice = async (req, res) => {
  try {
    const { amount, type } = req.body;
    const transaction = await Transaction.find({ userId: req.userID })
      .sort({ createdAt: -1 })
      .limit(1);
    if (transaction) {
      const remaining = transaction[0].remaining;
      const totalBalance = transaction[0].totalBalance;
      const balance = totalBalance - amount;
      const price = remaining - amount;
      const transactions = await new Transaction({
        userId: req.userID,
        type: type,
        amount: amount,
        remaining: price,
        totalBalance: price,
      });
      await transactions
        .save()
        .then((data) => {
          res.status(201).json({
            success: true,
            msg: "transection created Succesfully",
            transactions: data,
          });
        })
        .catch((e) => {
          res.status(500).json({
            success: false,
            msg: "something went wrong",
            error: e,
          });
        });
    }
  } catch (error) {
    console.log("error", error.message);
  }
};
exports.getOnetaransaction = async (req, res) => {
  try {
    const transaction = await Transaction.find({ userId: req.userID })
      .sort({ createdAt: 1 })
      .limit(1);
    if (transaction) {
      res.json({
        succcess: true,
        data: transaction,
      });
    } else {
      res.json({
        success: false,
        msg: "not found",
      });
    }
  } catch (error) {
    console.log("error", error.message);
  }
};
