const { userTypes } = require("../models/constants");

module.exports = (req, res, next) => {
  try {
    if (req.user && ![userTypes.GUEST, userTypes.USER].includes(req.user.userType))
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
