const { Schema, model } = require("mongoose");
const { userTypes, countryCodes } = require("./constants");

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const phoneNumberSchema = new Schema({
  countryCode: {
    type: String,
    enum: Object.values(countryCodes),
    required: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
});

const UserSchema = new Schema(
  {
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    primaryPhoneNumber: {
      type: phoneNumberSchema,
      required: true,
    },
    secondaryPhoneNumber: {
      type: phoneNumberSchema,
    },
    primaryEmail: {
      type: String,
      required: true,
      unique: true,
    },
    secondaryEmail: {
      type: String,
    },
    userType: {
      type: String,
      enum: Object.values(userTypes),
    },
    oraganizationName: {
      type: String,
      required: isUserTypeSpecified,
    },
    commercialRegister: {
      type: String,
      required: isUserTypeSpecified && !isTransporterTypeRequired,
    },
    location: {
      type: pointSchema,
      index: "2dsphere",
      required: isUserTypeSpecified,
    },

    vendorType: {
      type: [String],
      required: isVendorTypeRequired,
    },
    firebaseToken: {
      type: String,
    },
    country: {
      type: String,
      enum: Object.keys(countryCodes),
      required: isUserTypeSpecified,
    },
    city: {
      type: String,
      required: isUserTypeSpecified,
    },
    transportationMethods: {
      type: [String],
      required: isTransporterTypeRequired,
    },
  },
  { timestamps: true }
);

function isVendorTypeRequired() {
  return this.userType == userTypes.VENDOR;
}

function isTransporterTypeRequired() {
  return this.userType == userTypes.TRANSPORTER;
}

function isUserTypeSpecified() {
  return !!this.userType;
}

module.exports = model("User", UserSchema, "users");
