const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
const { sendNotification } = require("../../../helpers");
const CustomError = require("../../../errors/CustomError");

// Temporary route to send notifications
router.post("/sendNotification", async (req, res, next) => {
  try {
    const { title, body, userId, data } = req.body;

    if (!title || !body || !userId) {
      throw new CustomError("MISSING_PARAMETERS", "بعض الحقول مفقودة");
    }

    await sendNotification({
      userId,
      title,
      body,
      data,
      type: 1,
    });

    return res.status(200).json({ status: true, message: "تم ارسال الاشعار بنجاح" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
