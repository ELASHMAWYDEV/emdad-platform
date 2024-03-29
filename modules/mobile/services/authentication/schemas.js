const { countryCodes } = require("../../../../models/constants");

module.exports = {
  loginSchema: {
    type: "object",
    required: ["user", "password"],
    additionalProperties: false,
    properties: {
      user: {
        type: "string",
      },
      password: {
        type: "string",
      },
      firebaseToken: {
        type: "string",
      },
    },
  },
  registrationSchema: {
    type: "object",
    required: ["name", "password", "primaryPhoneNumber", "primaryEmail"],
    additionalProperties: false,
    properties: {
      name: {
        type: "string",
      },
      password: {
        type: "string",
        minLength: 6,
        format: "password",
      },
      primaryPhoneNumber: {
        type: "object",
        required: ["countryCode", "number"],
        properties: {
          countryCode: {
            type: "string",
            enum: Object.values(countryCodes),
          },
          number: {
            type: "string",
          },
        },
      },
      secondaryPhoneNumber: {
        type: "object",
        nullable: true,
        required: ["countryCode", "number"],
        properties: {
          countryCode: {
            type: "string",
            enum: Object.values(countryCodes),
          },
          number: {
            type: "string",
          },
        },
      },
      primaryEmail: {
        type: "string",
        format: "email",
      },
      secondaryEmail: {
        type: "string",
        nullable: true,
        format: "email",
      },
      firebaseToken: {
        type: "string",
      },
    },
  },
  verifyOtpSchema: {
    type: "object",
    required: ["otp", "type"],
    properties: {
      otp: {
        type: ["string", "number"],
      },
      type: {
        type: "string",
        enum: ["phone", "email"],
      },
    },
  },
};
