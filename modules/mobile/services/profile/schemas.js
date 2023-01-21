const { countryCodes, userTypes } = require("../../../../models/constants");

module.exports = {
  completeProfileSchema: {
    type: "object",
    additionalProperties: false,
    required: ["_id", "userType", "location", "country", "city"],
    properties: {
      _id: {
        type: "object",
      },
      logo: { type: "string", nullable: true },
      userType: {
        type: "string",
        enum: Object.values(userTypes),
      },
      vendorType: {
        type: "array",
        items: [
          {
            type: "string",
          },
        ],
      },
      city: {
        type: "string",
      },
      country: {
        type: "string",
        enum: Object.keys(countryCodes),
      },
      transportationMethods: {
        type: "array",
        items: [
          {
            type: "string",
          },
        ],
      },
      oraganizationName: {
        type: "string",
      },
      commercialRegister: {
        type: "string",
      },
      location: {
        type: "object",
        required: ["lat", "lng"],
        properties: {
          lat: {
            type: "number",
          },
          lng: {
            type: "number",
          },
        },
      },
    },
  },
  editProfileSchema: {
    type: "object",
    additionalProperties: false,
    required: ["_id"],
    properties: {
      _id: {
        type: "object",
      },
      name: { type: "string" },
      logo: { type: "string", nullable: true },
      vendorType: {
        type: "array",
        items: [
          {
            type: "string",
          },
        ],
      },
      transportationMethods: {
        type: "array",
        items: [
          {
            type: "string",
          },
        ],
      },
      oraganizationName: {
        type: "string",
      },
      commercialRegister: {
        type: "string",
      },
      city: {
        type: "string",
      },
      country: {
        type: "string",
        enum: Object.keys(countryCodes),
      },
      location: {
        type: "object",
        required: ["lat", "lng"],
        properties: {
          lat: {
            type: "number",
          },
          lng: {
            type: "number",
          },
        },
      },
    },
  },
  editPasswordSchema: {
    type: "object",
    required: ["_id", "oldPassword", "newPassword", "newPasswordConfirm"],
    properties: {
      _id: {
        type: "object",
      },
      oldPassword: {
        type: "string",
      },
      newPassword: {
        type: "string",
        minLength: 6,
      },
      confirmPassword: {
        type: "string",
      },
    },
  },
  editEmailSchema: {
    type: "object",
    required: ["_id", "oldEmail", "newEmail", "password"],
    properties: {
      _id: {
        type: "object",
      },
      oldEmail: {
        type: "string",
        format: "email",
      },
      newEmail: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
      },
    },
  },
};
