const mongoose = require("mongoose");
const contentStream = require("../models/contentStream");
exports.addContent = async (req, res) => {
  try {
    const { videoId, title, publisherDate, platform } = req.body;
    const content = new contentStream({
      videoId,
      title,
      publisherDate,
      platform,
      checked: false,
      userId: req.userID,
    });
    const data = await content.save();
    if (data) {
      res.json({
        success: true,
        data: data,
        msg: "Succesfully",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: e.message,
    });
  }
};
exports.removeContent = async (req, res) => {
  try {
    const { videoId } = req.body;
    const deleteUser = await contentStream.findOneAndDelete({
      videoId: videoId,
    });
    if (deleteUser) {
      res.json({
        success: true,
        msg: "remove content success",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: e.message,
    });
  }
};
exports.getContent = async (req, res) => {
  try {
    const contentData = await contentStream.find({
      userId: new mongoose.Types.ObjectId(req.userID),
    });
    if (contentData) {
      res.json({
        success: true,
        data: contentData,
        message: "get content data successfully",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: e.message,
    });
  }
};
exports.updateContent = async (req, res) => {
  try {
    const { videoId, checked } = req.body;
    const updateData = await contentStream.update(
      {
        videoId: videoId,
      },
      { $set: { checked: checked } }
    );
    if (updateData) {
      res.json({
        success: true,
        message: "video updated successfully",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};
exports.UpdateAllContent = async (req, res) => {
  try {
    const { checked } = req.body;
    const updateData = await contentStream.updateMany(
      { userId: new mongoose.Types.ObjectId(req.userID) },
      { $set: { checked: checked } },
      { multi: true }
    );
    if (updateData) {
      res.json({
        success: true,
        message: updateData,
      });
    }
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};
