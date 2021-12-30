const { Schema, model, Types } = require("mongoose");
const { countryCodes, settingsKeys } = require("./constants");

const SettingsSchema = new Schema(
  {
    key: {
      type: String,
      enum: Object.values(settingsKeys),
      require: true,
    },
    vendorTypes: {
      type: [String],
    },
    countries: {
      type: {
        countryCode: {
          type: String,
          enum: Object.keys(countryCodes),
          unique: true,
        },
        cities: [String],
      },
    },
    transportationMethods: {
      type: [String],
    },
    featuredVendors: {
      type: [Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Settings", SettingsSchema, "settings");
