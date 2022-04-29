const ProfileService = require("../../services/profile");

const getUserProfile = async (req, res, next) => {
  try {
    const result = await ProfileService.getUserProfile(req.user._id);

    return res.json({
      status: true,
      message: "تم استرجاع بيانات حسابك بنجاح",
      data: { user: result },
    });
  } catch (e) {
    next(e);
  }
};

const completeProfile = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await ProfileService.completeUserProfile({
      ...userData,
      _id: req.user._id,
    });

    return res.json({
      status: true,
      message: "تم تحديث  بيانات حسابك بنجاح وهو الأن مفعل",
      data: { user: result },
    });
  } catch (e) {
    next(e);
  }
};

const editProfile = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await ProfileService.editUserProfile({
      ...userData,
      _id: req.user._id,
    });

    return res.json({
      status: true,
      message: "تم تعديل  بيانات حسابك بنجاح",
      data: { user: result },
    });
  } catch (e) {
    next(e);
  }
};

const editPassword = async (req, res, next) => {
  try {
    const passwords = req.body;
    await ProfileService.editUserPassword({
      ...passwords,
      _id: req.user._id,
    });

    return res.json({
      status: true,
      message: "تم تعديل  كلمة مرور حسابك بنجاح",
      data: null,
    });
  } catch (e) {
    next(e);
  }
};

const editEmail = async (req, res, next) => {
  try {
    const { oldEmail, newEmail, password } = req.body;
    const userAfterUpdate = await ProfileService.editUserEmail({
      oldEmail,
      newEmail,
      password,
      _id: req.user._id,
    });

    return res.json({
      status: true,
      message: "تم تعديل  بريدك الالكتروني بنجاح",
      data: { user: userAfterUpdate },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getUserProfile,
  completeProfile,
  editProfile,
  editPassword,
  editEmail,
};
