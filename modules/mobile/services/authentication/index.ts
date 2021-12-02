import { errorCodes } from "../../../../errors";
import UserModel from "../../../../models/User";
import { createToken } from "../../../../middlewares/jwt";
import { validateSchema } from "../../../../middlewares/schema";
import schemas from "./schemas.json";
import bcrypt from "bcrypt";
import ApiError from "../../../../errors/ApiError";

const loginUser = validateSchema(schemas.loginSchema)(async ({ username, password }) => {
  let userObject = await UserModel.findOne({
    username,
  });

  if (!userObject) throw new ApiError(errorCodes.WRONG_LOGIN_CREDENTIALS);

  //Password Match
  if (!(await bcrypt.compare(password, userObject.password))) {
    throw new ApiError(errorCodes.WRONG_LOGIN_CREDENTIALS);
  }

  //Send the jwt token with the success response
  const accessToken = await createToken({ _id: userObject._id });

  return {
    user: userObject,
    accessToken,
  };
});

const registerNewUser = async (user: {
  name: string;
  username: string;
  password: string;
  primaryPhoneNumber: { countryCode: string; number: string };
  secondaryPhoneNumber: { countryCode: string; number: string };
  primaryEmail: string;
  secondaryEmail: string;
}): Promise<{ user: object; accessToken: string }> => {
  console.log(user);
  //Validation
  const emptyKey = Object.keys(user).find((k) => !!!user[k] || Object.keys(user[k]).find((k2) => !!!user[k][k2]));
  if (emptyKey) throw { errorCode: errorCodes.EMPTY_FIELD, details: emptyKey };

  /**********************************************/
  //Encrypt password
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const userObject = await UserModel.create({ ...user, password: hashedPassword });
  console.log("he");

  //Send the jwt token with the success response
  const accessToken = await createToken({ _id: userObject._id });

  return {
    user: userObject,
    accessToken,
  };
};

export { loginUser, registerNewUser };
