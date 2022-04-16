const { userTypes } = require("../models/constants");

module.exports = (req, res, next) => {
  try {
    if (req.user && req.user.userType != userTypes.GUEST)
      return res.json({
        status: false,
        message: "انت لست مستخدم ، يجب تسجيل الدخول كمستخدم اولا",
      });

    req.isGuestUser = true;
    next();
  } catch (e) {
    return next(e);
  }
};
