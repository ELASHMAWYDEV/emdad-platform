const SettingsModel = require("../../../models/Settings");
const {
  settingsKeys
} = require("../../../models/constants");
const {
  errorCodes
} = require("../../../errors");
const ApiError = require("../../../errors/ApiError");





const getMobileSettings = async () => {
  const settings = await SettingsModel.findOne({
    key: settingsKeys.MOBILE
  });

  if (!settings) throw new ApiError(errorCodes.NO_SETTINGS_FOUND);
  return settings;
}

const listFeaturedVendors = async () => {
  const settings = await SettingsModel.findOne({
    key: settingsKeys.FEATURED_VENDORS
  }).populate("featuredVendors");

  if (!settings) throw new ApiError(errorCodes.NO_SETTINGS_FOUND);
  return settings.featuredVendors;
}


module.exports = {
  getMobileSettings,
  listFeaturedVendors
}