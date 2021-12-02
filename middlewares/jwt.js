const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const createToken = async (payload) => {
  try {
    const token = await jwt.sign(payload, process.env.ACCESS_TOKEN || "randomaccesstoken");
    return token;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const checkToken = async (req, res, next) => {
  try {
    const token =
      (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]) ||
      (req.cookies && req.cookies["access_token"]);

    if (!token) {
      return res.json({
        status: false,
        message: "You must login first"
      });
    }

    const user = await jwt.verify(token, process.env.ACCESS_TOKEN || "randomaccesstoken");

    //check DB existence
    const searchUser = await UserModel.findOne({
      _id: user._id
    });
    if (searchUser) {
      req.user = searchUser;
      return next();
    } else {
      return res.json({
        status: false,
        message: "You must login first"
      });
    }
  } catch (e) {
    console.log(e);
    return next();
  }
};

module.exports = {
  createToken,
  checkToken
};