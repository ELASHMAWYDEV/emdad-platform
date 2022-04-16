const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const ApiError = require("../errors/ApiError");
const { errorCodes } = require("../errors");
const { userTypes } = require("../models/constants");

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
      throw new ApiError(errorCodes.UNAUTHURIZED);
    }

    const user = jwt.verify(token, process.env.ACCESS_TOKEN || "randomaccesstoken");

    //check DB existence
    const searchUser = await UserModel.findOne({
      _id: user._id,
    });

    // ignore if he is guest
    if (user?.userType == userTypes.GUEST) {
      req.user = user;
      return next();
    }

    if (searchUser) {
      req.user = searchUser;
      return next();
    } else {
      throw new ApiError(errorCodes.UNAUTHURIZED);
    }
  } catch (e) {
    console.log(e);
    next(new ApiError(errorCodes.UNAUTHURIZED));
  }
};

module.exports = {
  createToken,
  checkToken,
};
