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
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  primaryPhoneNumber: {
    type: {
      countryCode: {
        type: String,
        enum: Object.values(countryCodes),
        required: true
      },
      number: {
        type: String,
        required: true
      },
    },
    required: true,
    unique: true
  },
  secondaryPhoneNumber: {
    type: {
      countryCode: {
        type: String,
        enum: Object.values(countryCodes),
        required: true
      },
      number: {
        type: String,
        required: true
      },
    },
    unique: true
  },
  primaryEmail: {
    type: String,
    required: true,
    unique: true
  },
  secondaryEmail: {
    type: String,
    unique: true
  },
  userType: {
    type: String,
    enum: Object.values(userTypes),
  },
  oraganizationName: {
    type: Object.values(supportedLanguages).reduce((a, c) => ({
      ...a,
      [c]: String
    }), {}),
    required: isUserTypeSpecified,
  },
  commercialRegister: {
    type: String,
    unique: true
  },
  transportationMethodDescription: {
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
  firebaseToken: {
    type: String,
  }
});

function isSupplierTypeRequired() {
  return this.userType == userTypes.SUPPLIER;
}

function isUserTypeSpecified() {
  return !!this.userType;
}

module.exports = model("User", UserSchema, "users");