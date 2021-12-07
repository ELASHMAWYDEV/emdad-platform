const bcrypt = require("bcrypt");
const ApiError = require("../../../../errors/ApiError");
const {
  errorCodes
} = require("../../../../errors");
const UserModel = require("../../../../models/User");
const {
  validateSchema
} = require("../../../../middlewares/schema");
const schemas = require("./schemas.json");





const completeUserProfile = validateSchema(schemas.completeProfileSchema)(async ({
  _id,
  location,
  ...user
}) => {

  //Check if user already updated his profile
  if (await UserModel.findOne({
      _id,
      userType: {
        $exists: true
      }
    })) throw new ApiError(errorCodes.PROFILE_ALREADY_COMPLETED);

  await UserModel.updateOne({
    _id
  }, {
    ...user,
    location: {
      coordinates: [location.lng, location.lat]
    },
    modificationDate: new Date()
  });

  // Get the user after update
  const userSearch = await UserModel.findById(_id);

  return userSearch;

});


const editUserProfile = validateSchema(schemas.editProfileSchema)(async ({
  _id,
  location,
  ...user
}) => {

  console.log(user);
  await UserModel.updateOne({
    _id
  }, {
    ...user,
    ...(location && {
      location: {
        coordinates: [location.lng, location.lat]
      }
    }),
    modificationDate: new Date()
  });

  // Get the user after update
  const userSearch = await UserModel.findById(_id);

  return userSearch;
});



const editUserPassword = validateSchema(schemas.editPasswordSchema)(async ({
  _id,
  oldPassword,
  newPassword,
  newPasswordConfirm
}) => {
  let userObject = await UserModel.findById(_id);

  //Password Match
  if (!(await bcrypt.compare(oldPassword, userObject.password)))
    throw new ApiError(errorCodes.OLD_PASSWORD_INCORRECT);

  if (newPassword != newPasswordConfirm) throw new ApiError(errorCodes.PASSWORD_NOT_MATCH, {
    key: "newPasswordConfirm",
    message: "تأكيد كلمة المرور غير متطابق"
  });


  //Encrypt password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserModel.updateOne({
    _id
  }, {
    password: hashedPassword
  });

});


const editUserEmail = validateSchema(schemas.editEmailSchema)(async ({
  _id,
  email
}) => {

  await UserModel.updateOne({
    _id
  }, {
    primaryEmail: email
  });

});


module.exports = {
  completeUserProfile,
  editUserProfile,
  editUserPassword,
  editUserEmail
}