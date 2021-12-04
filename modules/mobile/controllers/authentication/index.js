const {
  loginUser,
  registerNewUser,
  verifyOneTimePass
} = require("../../services/authentication");

const login = async (req, res, next) => {
  try {
    const {
      username,
      password
    } = req.body;

    const result = await loginUser({
      username,
      password
    });
    res.cookie("access_token", result.accessToken, {
      maxAge: 86400 * 1000
    });
    res.cookie("user_data", JSON.stringify(result.user), {
      maxAge: 86400 * 1000,
    });

    return res.json({
      status: true,
      message: "تم تسجيل الدخول بنجاح",
      data: result.user,
      accessToken: result.accessToken,
    });
  } catch (e) {
    next(e);
  }
};

const register = async (req, res, next) => {
  try {
    const user = req.body;
    const result = await registerNewUser(user);

    return res.json({
      status: true,
      message: "تم تسجيل حسابك بنجاح ، يرجي استكمال بياناتك",
      data: result.user,
      accessToken: result.accessToken,
    });
  } catch (e) {
    next(e);
  }
};


const verifyOtp = async (req, res, next) => {
  try {
    const {
      otp,
      type
    } = req.body;
    await verifyOneTimePass({
      userId: req.user._id,
      otp,
      type
    });

    return res.json({
      status: true,
      message: `تم تأكيد ${type == "phone" ? "رقم هاتفك" : "بريدك الالكتروني"} بنجاح`,
      data: null,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  login,
  register,
  verifyOtp
};