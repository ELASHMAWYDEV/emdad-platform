const {
  userTypes
} = require("../models/constants");

module.exports = (req, res, next) => {
  try {

    if (req.user && req.user.userType != userTypes.USER) return res.json({
      status: false,
      message: "انت لست شركة توصيل ، يجب تسجيل الدخول كشركة توصيل اولا"
    });
    
    next();

  } catch (e) {
    console.log(e);
    return next();
  }
}