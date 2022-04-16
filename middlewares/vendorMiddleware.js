const {
  userTypes
} = require("../models/constants");

module.exports = (req, res, next) => {
  try {

    if (req.user && req.user.userType != userTypes.VENDOR) return res.json({
      status: false,
      message: "انت لست مورد ، يجب تسجيل الدخول كمورد اولا"
    });

    next();

  } catch (e) {
    return next(e);
  }
}