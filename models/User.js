const {
  Schema,
  model
} = require("mongoose");
const {
  userTypes,
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
  isVerified: {
    type: Boolean,
    required: true,
    default: false
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
    type: String,
    required: isUserTypeSpecified,
  },
  commercialRegister: {
    type: String,
    required: isUserTypeSpecified
  },
  transportationMethodDescription: {
    type: String,
  },
  location: {
    type: pointSchema,
    index: "2dsphere",
    required: isUserTypeSpecified
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  modificationDate: {
    type: Date,
    default: null,
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
    required: isUserTypeSpecified
  },
  city: {
    type: String,
    required: isUserTypeSpecified
  }
});

function isVendorTypeRequired() {
  return this.userType == userTypes.VENDOR;
}

function isUserTypeSpecified() {
  return !!this.userType;
}

module.exports = model("User", UserSchema, "users");