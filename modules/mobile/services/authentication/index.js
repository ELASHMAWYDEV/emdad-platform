const {
  errorCodes
} = require("../../../../errors");
const UserModel = require("../../../../models/User");
const {
  createToken
} = require("../../../../middlewares/jwt");
const {
  validateSchema
} = require("../../../../middlewares/schema");
const schemas = require("./schemas.json");
const bcrypt = require("bcrypt");
const ApiError = require("../../../../errors/ApiError");

const loginUser = validateSchema(schemas.loginSchema)(async ({
  username,
  password
}) => {
  let userObject = await UserModel.findOne({
    username,
  });

  if (!userObject) throw new ApiError(errorCodes.WRONG_LOGIN_CREDENTIALS);

  //Password Match
  if (!(await bcrypt.compare(password, userObject.password))) {
    throw new ApiError(errorCodes.WRONG_LOGIN_CREDENTIALS);
  }

  //Send the jwt token with the success response
  const accessToken = await createToken({
    _id: userObject._id
  });

  return {
    user: userObject,
    accessToken,
  };
});

const registerNewUser = async (user) => {
  console.log(user);
  //Validation
  const emptyKey = Object.keys(user).find((k) => !!!user[k] || Object.keys(user[k]).find((k2) => !!!user[k][k2]));
  if (emptyKey) throw {
    errorCode: errorCodes.EMPTY_FIELD,
    details: emptyKey
  };

  /**********************************************/
  //Encrypt password
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const userObject = await UserModel.create({
    ...user,
    password: hashedPassword
  });
  console.log("he");

  //Send the jwt token with the success response
  const accessToken = await createToken({
    _id: userObject._id
  });

  return {
    user: userObject,
    accessToken,
  };
};

module.exports ={
  loginUser,
  registerNewUser
};