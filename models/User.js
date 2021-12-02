const {
  Schema,
  model
} = require("mongoose");
const {
  userTypes,
  supportedLanguages,
  countryCodes
} = require("./constants");

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

const UserSchema = new Schema({
  name: {
    type: Object.values(supportedLanguages).reduce((a, c) => ({
      ...a,
      [c]: {
        type: String,
        required: true
      }
    }), {}), // All languages are required
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  primaryPhoneNumber: {
    type: {
      countryCode: Object.values(countryCodes),
      number: String,
    },
    required: true,
  },
  secondaryPhoneNumber: {
    type: {
      countryCode: Object.values(countryCodes),
      number: String,
    },
  },
  primaryEmail: {
    type: String,
    required: true,
  },
  secondaryEmail: {
    type: String,
  },
  userType: {
    type: String,
    required: true,
    enum: Object.values(userTypes),
  },
  oraganizationName: {
    type: Object.values(supportedLanguages).reduce((a, c) => ({
      ...a,
      [c]: String
    }), {}),
    required: true,
  },
  commercialRegister: {
    type: String,
  },
  transportationMethorDescription: {
    type: String,
  },
  location: {
    type: pointSchema,
    index: "2dsphere",
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  modificationDate: {
    type: Date,
    default: null,
  },
  supplierType: {
    type: String,
    required: isSupplierTypeRequired, // TODO: what are the supplier types ?
  },
});

function isSupplierTypeRequired() {
  return this.userType == userTypes.SUPPLIER;
}

module.exports = model("User", UserSchema, "users");