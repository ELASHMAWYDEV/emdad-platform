const {
  completeUserProfile,
  editUserProfile,
  editUserPassword,
  editUserEmail
} = require("../../services/profile");



const completeProfile = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await completeUserProfile({
      ...userData,
      _id: req.user._id
    });

    return res.json({
      status: true,
      message: "تم تحديث  بيانات حسابك بنجاح وهو الأن مفعل",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};


const editProfile = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await editUserProfile({
      ...userData,
      _id: req.user._id
    });

    return res.json({
      status: true,
      message: "تم تعديل  بيانات حسابك بنجاح",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const editPassword = async (req, res, next) => {
  try {
    const passwords = req.body;
    const result = await editUserPassword({
      ...passwords,
      _id: req.user._id
    });

    return res.json({
      status: true,
      message: "تم تعديل  كلمة مرور حسابك بنجاح",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const editEmail = async (req, res, next) => {
  try {
    const {
      email
    } = req.body;
    const result = await editUserEmail({
      email,
      _id: req.user._id
    });

    return res.json({
      status: true,
      message: "تم تعديل  بريدك الالكتروني بنجاح",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};


module.exports = {
  completeProfile,
  editProfile,
  editPassword,
  editEmail
}