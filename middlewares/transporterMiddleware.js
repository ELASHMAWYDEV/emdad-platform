const {
  userTypes
} = require("../models/constants");

module.exports = (req, res, next) => {
  try {

    if (req.user && req.user.userType != userTypes.TRANSPORTER) return res.json({
      status: false,
      message: "انت لست شركة توصيل ، يجب تسجيل الدخول كشركة توصيل اولا"
    });
    
    next();

  } catch (e) {
    return next(e);
  }
}