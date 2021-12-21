const authenticationService = require("../../services/authentication");

const login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    const result = await authenticationService.loginUser({
      email,
      phone,
      password,
    });

    //Verification & Profile completion steps
    if (result.data?.step) {
      return res.json(result);
    }

    res.cookie("access_token", result.accessToken, {
      maxAge: 86400 * 1000,
    });
    res.cookie("user_data", JSON.stringify(result.user), {
      maxAge: 86400 * 1000,
    });

    return res.json({
      status: true,
      message: "تم تسجيل الدخول بنجاح",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (e) {
    next(e);
  }
};

const register = async (req, res, next) => {
  try {
    const user = req.body;
    const result = await authenticationService.registerNewUser(user);

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
    const { otp, type } = req.body;
    await authenticationService.verifyOneTimePass({
      userId: req.user._id,
      otp,
      type,
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

const resendOtp = async (req, res, next) => {
  try {
    const { type } = req.body;
    const result = await authenticationService.sendOtp(req.user._id, type);

    return res.json({
      status: true,
      message: `تم ارسال الكود الي ${type == "phone" ? "رقم هاتفك" : "بريدك الالكتروني"}`,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  login,
  register,
  verifyOtp,
  resendOtp,
};
