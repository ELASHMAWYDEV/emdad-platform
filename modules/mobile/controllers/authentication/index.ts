import { loginUser, registerNewUser } from "../../services/authentication";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const result = await loginUser({ username, password });
    res.cookie("access_token", result.accessToken, { maxAge: 86400 * 1000 });
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
    const { name, username, password, primaryPhoneNumber, secondaryPhoneNumber, primaryEmail, secondaryEmail } =
      req.body;
    const result = await registerNewUser({
      name,
      username,
      password,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      primaryEmail,
      secondaryEmail,
    });

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

export { login, register };
