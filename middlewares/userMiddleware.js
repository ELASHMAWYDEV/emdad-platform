const { userTypes } = require("../models/constants");

module.exports = (req, res, next) => {
  try {
    if (req.isGuestUser) return next();

    if (req.user && req?.user?.userType != userTypes.USER)
      return res.json({
        status: false,
        message: "انت لست مستخدم ، يجب تسجيل الدخول كمستخدم اولا",
      });

    next();
  } catch (e) {
    return next(e);
  }
};
