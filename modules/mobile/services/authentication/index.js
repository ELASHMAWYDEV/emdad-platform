const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const {
  TWILIO_SID,
  TWILIO_TOKEN,
  TWILIO_SERVICE_ID,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  WEBSITE_URL,
} = require("../../../../globals");
const twilioClient = require("twilio")(TWILIO_SID, TWILIO_TOKEN);
const { errorCodes } = require("../../../../errors");
const UserModel = require("../../../../models/User");
const OtpModel = require("../../../../models/Otp");
const { countryCodes } = require("../../../../models/constants");
const { createToken } = require("../../../../middlewares/jwt");
const { validateSchema } = require("../../../../middlewares/schema");
const schemas = require("./schemas");
const ApiError = require("../../../../errors/ApiError");

const checkPhoneNumber = ({ countryCode, number }) => {
  switch (countryCode) {
    case countryCodes.EG:
      if (number.length < 10 || number.length > 11)
        throw new ApiError(errorCodes.VALIDATION_ERROR, [
          {
            key: "number",
            message: "رقم الهاتف غير صحيح",
          },
        ]);
      number = number.charAt(0) == "0" ? number : `0${number}`;
      return {
        countryCode,
        number,
      };
    case countryCodes.SA:
      if (number.length < 9 || number.length > 10)
        throw new ApiError(errorCodes.VALIDATION_ERROR, [
          {
            key: "number",
            message: "رقم الهاتف غير صحيح",
          },
        ]);
      number = number.charAt(0) == "0" ? number : `0${number}`;
      return {
        countryCode,
        number,
      };
    default:
      throw new ApiError(errorCodes.VALIDATION_ERROR, [
        {
          key: "countryCode",
          message: `كود الدولة ${countryCode} غير مدعوم`,
        },
      ]);
  }
};

/*******************************************/

const sendOtp = async (userId, type) => {
  const userSearch = await UserModel.findById(userId);

  if (!userSearch) throw new Error(`The user is with ID: ${userId} is not registered`);

  const { primaryPhoneNumber, primaryEmail } = userSearch;

  if (!primaryPhoneNumber) throw new ApiError(errorCodes.USER_HAS_NO_PHONE);
  if (!primaryEmail) throw new ApiError(errorCodes.USER_HAS_NO_EMAIL);

  //Check if there is unverified otp already
  const unverifiedOtps = await OtpModel.find({
    userId,
    isVerified: false,
  });

  let phoneOtp, emailOtp;
  if (unverifiedOtps.length == 0) {
    //Create the otp for the user 4-digit-otp
    phoneOtp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    emailOtp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

    //Save on DB
    await OtpModel.insertMany([
      ...[
        (!type || type == "phone") && {
          userId: userSearch._id,
          type: "phone",
          otp: phoneOtp,
        },
      ],
      ...[
        (!type || type == "email") && {
          userId: userSearch._id,
          type: "email",
          otp: emailOtp,
        },
      ],
    ]);
  }

  if ((!type || type == "phone") && unverifiedOtps.find((e) => e.type == "phone")) {
    phoneOtp = unverifiedOtps.find((e) => e.type == "phone").otp;
  }

  if ((!type || type == "email") && unverifiedOtps.find((e) => e.type == "email")) {
    emailOtp = unverifiedOtps.find((e) => e.type == "email").otp;
  }

  if (phoneOtp) {
    // await twilioClient.messages.create({
    //   body: `Your OTP is: ${phoneOtp}`,
    //   messagingServiceSid: TWILIO_SERVICE_ID,
    //   to: `${primaryPhoneNumber.countryCode}${primaryPhoneNumber.number.slice(1)}`,
    // });

    if (type == "phone") return { phoneOtp };
  }

  if (emailOtp) {
    let transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    transporter.sendMail({
      from: "no-reply@emdad.com",
      to: primaryEmail,
      priority: "high",
      subject: "Emdad: Verify your Email",
      html: `
      <body>
        <div style="padding: 40px 10px;">
          <h1 style="text-align:center; padding: 20px 10px;width: 100%; background-color: #34495e; color: #fff;">Verify Your Email</h1>
          <div style="width:100%; padding: 70px 10px; background-color: #ecf0f1;">
            <p style="font-size: 22px; text-align:center; color:#2c3e50;">Your OTP is: <strong>${emailOtp}</strong></p>
          </div>
        </div>
      </body>
      `,
    });

    if (type == "email") return { emailOtp };
  }
  return {
    emailOtp,
    phoneOtp,
  };
};

/*******************************************/

const verifyOneTimePass = validateSchema(schemas.verifyOtpSchema)(async ({ userId, otp, type }) => {
  //Search for it on DB
  const otpSearch = await OtpModel.find({
    userId,
    type,
    otp,
    isVerified: false,
  });

  if (otpSearch.length == 0) throw new ApiError(errorCodes.OTP_INCORRECT);

  //Set all otps' from this type to verified!
  await OtpModel.updateMany(
    {
      userId,
      type,
      isVerified: false,
    },
    {
      $set: {
        isVerified: true,
      },
    }
  );

  //Check if there are no more otps & verify the user
  if (
    !(await OtpModel.findOne({
      userId,
      isVerified: false,
    }))
  )
    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          isVerified: true,
        },
      }
    );
});

/*******************************************/

const loginUser = validateSchema(schemas.loginSchema)(async ({ user, password, firebaseToken }) => {
  let userObject = await UserModel.findOne({
    $or: [{ primaryEmail: user }, { "primaryPhoneNumber.number": user }],
  });

  if (!userObject) throw new ApiError(errorCodes.WRONG_LOGIN_CREDENTIALS);

  //Password Match
  if (!(await bcrypt.compare(password, userObject.password))) {
    throw new ApiError(errorCodes.WRONG_LOGIN_CREDENTIALS);
  }

  //Update firebase token
  await UserModel.updateOne(
    {
      _id: userObject._id,
    },
    {
      $set: {
        firebaseToken,
      },
    }
  );

  //Send the jwt token with the success response
  const accessToken = await createToken({
    _id: userObject._id,
    userType: userObject.userType,
  });

  //Check for OTP
  if (userObject.isVerified == false) {
    const otps = await sendOtp(userObject._id); // @TODO: remove the return from sendOtp
    return {
      status: true,
      message: `يجب تأكيد ${otps.phoneOtp ? "هاتفك ," : ""} ${otps.emailOtp ? "بريدك الالكتروني" : ""} أولا`,
      data: {
        accessToken,
        step: "verification",
        ...otps,
      },
    };
  }

  //Check for profile completion
  if (!userObject.userType) {
    return {
      status: true,
      message: "يجب عليك اكمال بياناتك أولا",
      data: {
        accessToken,
        step: "profile",
      },
    };
  }

  // Set the logo url
  if (userObject.logo) userObject.logo = `${WEBSITE_URL}/images/users/${userObject.logo}`;

  return {
    accessToken,
    user: userObject,
  };
});

/*******************************************/

const registerNewUser = validateSchema(schemas.registrationSchema)(async (user) => {
  //Check phone numbers
  if (user.primaryPhoneNumber) user.primaryPhoneNumber = checkPhoneNumber(user.primaryPhoneNumber);
  if (user.secondaryPhoneNumber) user.secondaryPhoneNumber = checkPhoneNumber(user.secondaryPhoneNumber);

  // Extra check on primary & secondary numbers -> mongo doesn't handle it properly
  if (await UserModel.findOne({ "primaryPhoneNumber.number": user.primaryPhoneNumber.number }))
    throw new ApiError(errorCodes.DUPLICATION_ERROR, [
      { key: "primaryPhoneNumber", message: "رقم الهاتف الاساسي مسجل من قبل" },
    ]);

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
  sendOtp(userObject._id);

  // Set the logo url
  if (userObject.logo) userObject.logo = `${WEBSITE_URL}/images/users/${userObject.logo}`;
  return {
    user: userObject,
    accessToken,
  };
});

module.exports = {
  loginUser,
  registerNewUser,
  verifyOneTimePass,
  sendOtp,
};
