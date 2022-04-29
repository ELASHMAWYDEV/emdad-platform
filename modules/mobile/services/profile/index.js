const bcrypt = require("bcrypt");
const ApiError = require("../../../../errors/ApiError");
const { errorCodes } = require("../../../../errors");
const UserModel = require("../../../../models/User");
const { validateSchema } = require("../../../../middlewares/schema");
const schemas = require("./schemas.js");
const CustomError = require("../../../../errors/CustomError");

const getUserProfile = async (userId) => {
  const profile = await UserModel.findById(userId).select("-firebaseToken -password").lean({ virtuals: true });

  if (!profile) throw new Error("الملف الشخصي الذي تبحث عنه غير موجود");
  return profile;
};

const completeUserProfile = validateSchema(schemas.completeProfileSchema)(async ({ _id, location, ...user }) => {
  // Validation on logo
  if (user.logo && !/\w+-\w+-\w+-\w+-\w+\.\w+/.test(user.logo))
    throw new CustomError("IMAGES_NOT_CORRECT", "الصورة التي ارسلتها  لم تقم برفعها من قبل");

  //Check if user already updated his profile
  if (
    await UserModel.findOne({
      _id,
      userType: {
        $exists: true,
      },
    })
  )
    throw new ApiError(errorCodes.PROFILE_ALREADY_COMPLETED);

  const userAfterUpdate = await UserModel.updateOne(
    {
      _id,
    },
    {
      ...user,
      location: {
        coordinates: [location.lng, location.lat],
      },
    },
    { new: true }
  ).lean({ virtuals: true });

  return userAfterUpdate;
});

const editUserProfile = validateSchema(schemas.editProfileSchema)(async ({ _id, location, ...user }) => {
  // Validation on logo
  if (user.logo && !/\w+-\w+-\w+-\w+-\w+\.\w+/.test(user.logo))
    throw new CustomError("IMAGES_NOT_UPLOADED", "الصورة التي ارسلتها  لم تقم برفعها من قبل");

  const userAfterUpdate = await UserModel.findOneAndUpdate(
    {
      _id,
    },
    {
      ...user,
      ...(location && {
        location: {
          coordinates: [location.lng, location.lat],
        },
      }),
    },
    { new: true }
  ).lean({ virtuals: true });

  return userAfterUpdate;
});

const editUserPassword = validateSchema(schemas.editPasswordSchema)(
  async ({ _id, oldPassword, newPassword, newPasswordConfirm }) => {
    let userObject = await UserModel.findById(_id);

    //Password Match
    if (!(await bcrypt.compare(oldPassword, userObject.password)))
      throw new ApiError(errorCodes.OLD_PASSWORD_INCORRECT);

    if (newPassword != newPasswordConfirm)
      throw new ApiError(errorCodes.PASSWORD_NOT_MATCH, {
        key: "newPasswordConfirm",
        message: "تأكيد كلمة المرور غير متطابق",
      });

    //Encrypt password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updateOne(
      {
        _id,
      },
      {
        password: hashedPassword,
      }
    );
  }
);

const editUserEmail = validateSchema(schemas.editEmailSchema)(async ({ _id, oldEmail, newEmail, password }) => {
  let userObject = await UserModel.findById(_id);

  // Password Match
  if (!(await bcrypt.compare(password, userObject.password))) throw new ApiError(errorCodes.PASSWORD_NOT_CORRECT);

  // Email validation
  if (oldEmail !== userObject.primaryEmail) throw new ApiError(errorCodes.EMAIL_NOT_CORRECT);
  if (newEmail === userObject.primaryEmail) throw new ApiError(errorCodes.EMAIL_DID_NOT_CHANGE);

  const userAfterUpdate = await UserModel.findOneAndUpdate(
    {
      _id,
    },
    {
      primaryEmail: newEmail,
    },
    { new: true }
  ).lean({ virtuals: true });

  return userAfterUpdate;
});

module.exports = {
  getUserProfile,
  completeUserProfile,
  editUserProfile,
  editUserPassword,
  editUserEmail,
};
