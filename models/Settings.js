const { Schema, model, Types } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

SettingsSchema.virtual("id").get(() => {
  return this._id;
});

SettingsSchema.plugin(mongooseLeanVirtuals);

module.exports = model("Settings", SettingsSchema, "settings");
