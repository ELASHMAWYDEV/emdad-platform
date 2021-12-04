const bcrypt = require("bcrypt");
const {
  TWILIO_SID,
  TWILIO_TOKEN,
  TWILIO_SERVICE_ID
} = require("../../../../globals");
const twilioClient = require("twilio")(TWILIO_SID, TWILIO_TOKEN);
const {
  errorCodes
} = require("../../../../errors");
const UserModel = require("../../../../models/User");
const OtpModel = require("../../../../models/Otp");
const {
  countryCodes
} = require("../../../../models/constants");
const {
  createToken
} = require("../../../../middlewares/jwt");
const {
  validateSchema
} = require("../../../../middlewares/schema");
const schemas = require("./schemas.json");
const ApiError = require("../../../../errors/ApiError");

const checkPhoneNumber = ({
  countryCode,
  number
}) => {
  switch (countryCode) {
    case countryCodes.EG:
      if (number.length < 10 || number.length > 11)
        throw new ApiError(errorCodes.VALIDATION_ERROR, [{
          key: "number",
          message: "رقم الهاتف غير صحيح",
        }, ]);
      number = number.charAt(0) == "0" ? number : `0${number}`;
      return {
        countryCode,
        number,
      };
    case countryCodes.SA:
      if (number.length < 9 || number.length > 10)
        throw new ApiError(errorCodes.VALIDATION_ERROR, [{
          key: "number",
          message: "رقم الهاتف غير صحيح",
        }, ]);
      number = number.charAt(0) == "0" ? number : `0${number}`;
      return {
        countryCode,
        number,
      };
    default:
      throw new ApiError(errorCodes.VALIDATION_ERROR, [{
        key: "countryCode",
        message: `كود الدولة ${countryCode} غير مدعوم`,
      }, ]);
  }
};

/*******************************************/

const sendOtp = async (userId) => {
  const userSearch = await UserModel.findById(userId);

  if (!userSearch) throw new Error(`The user is with ID: ${userId} is not registered`);

  const {
    primaryPhoneNumber,
    primaryEmail
  } = userSearch;

  if (!primaryPhoneNumber) throw new ApiError(errorCodes.USER_HAS_NO_PHONE);
  if (!primaryEmail) throw new ApiError(errorCodes.USER_HAS_NO_EMAIL);

  //Check if there is unverified otp already
  const unverifiedOtps = await OtpModel.find({
    userId,
    isVerified: false
  });

  let phoneOtp, emailOtp;
  if (unverifiedOtps.length == 0) {

    //Create the otp for the user 4-digit-otp
    phoneOtp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    emailOtp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

    //Save on DB
    await OtpModel.insertMany([{
      userId: userSearch._id,
      type: "phone",
      otp: phoneOtp
    }, {
      userId: userSearch._id,
      type: "email",
      otp: emailOtp
    }])

  } else {
    phoneOtp = unverifiedOtps.find(e => e.type == "phone");
    emailOtp = unverifiedOtps.find(e => e.type == "email");
  }



  if (phoneOtp) {
    await twilioClient.messages.create({
      body: `Your OTP is: ${phoneOtp}`,
      messagingServiceSid: TWILIO_SERVICE_ID,
      to: `${primaryPhoneNumber.countryCode}${primaryPhoneNumber.number.slice(1)}`
    });
  }

  if (emailOtp) {
    // @TODO: send email to the user with the OTP 
  }
}

/*******************************************/


const verifyOneTimePass = validateSchema(schemas.verifyOtpSchema)(async ({
  userId,
  otp,
  type
}) => {
  //Search for it on DB
  const otpSearch = await OtpModel.find({
    userId,
    type,
    otp,
    isVerified: false
  });

  if (otpSearch.length == 0) throw new ApiError(errorCodes.OTP_INCORRECT);

  //Set all otps' from this type to verified!
  await OtpModel.updateMany({
    userId,
    type,
    isVerified: false
  }, {
    $set: {
      isVerified: true
    }
  });
})

/*******************************************/

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
    _id: userObject._id,
  });

  return {
    user: userObject,
    accessToken,
  };
});

/*******************************************/

const registerNewUser = validateSchema(schemas.registrationSchema)(async (user) => {
  //Check phone numbers
  if (user.primaryPhoneNumber) user.primaryPhoneNumber = checkPhoneNumber(user.primaryPhoneNumber);
  if (user.secondaryPhoneNumber) user.secondaryPhoneNumber = checkPhoneNumber(user.secondaryPhoneNumber);

  //Encrypt password
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const userObject = await UserModel.create({
    ...user,
    password: hashedPassword,
  });

  //Send the jwt token with the success response
  const accessToken = await createToken({
    _id: userObject._id,
  });

  //Send OTP to the user
  await sendOtp(userObject._id);

  return {
    user: userObject,
    accessToken,
  };
});

module.exports = {
  loginUser,
  registerNewUser,
  verifyOneTimePass
};