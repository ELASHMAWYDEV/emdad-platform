const {
  Schema,
  model,
  Types
} = require("mongoose");
const {
  countryCodes,
  settingsKeys
} = require("./constants");

const SettingsSchema = new Schema({
  key: {
    type: String,
    enum: Object.values(settingsKeys),
    require: true
  },
  vendorTypes: {
    type: [String],
  },
  cities: {
    type: [{
      country: {
        type: String,
        enum: Object.keys(countryCodes)
      },
      value: String
    }],
  },
  transportationMethods: {
    type: [String],
  },
  featuredVendors: {
    type: [Types.ObjectId],
    ref: "User",
  }
});

module.exports = model("Settings", SettingsSchema, "settings");