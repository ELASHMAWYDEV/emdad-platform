const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
const { sendNotification } = require("../../../helpers");
const CustomError = require("../../../errors/CustomError");

// Temporary route to send notifications
router.post("/sendNotification", async (req, res, next) => {
  try {
    const { title, body, userId } = req.body;

    if (!title || !body || !userId) {
      throw new CustomError("MISSING_PARAMETERS", "بعض الحقول مفقودة");
    }

    const userSearch = await User.findById(userId);

    if (!userSearch) {
      throw new CustomError("USER_NOT_FOUND", "لم يتم العثور على المستخدم");
    }

    if (!userSearch.firebaseToken) {
      throw new CustomError("FIREBASE_TOKEN_NOT_FOUND", "لم يتم العثور على مفتاح الإشعارات");
    }

    await sendNotification({
      firebaseToken: userSearch.firebaseToken,
      title,
      body,
      type: 1,
      deviceType: userSearch.deviceType,
    });

    return res.status(200).json({ status: true, message: "تم ارسال الاشعار بنجاح" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
