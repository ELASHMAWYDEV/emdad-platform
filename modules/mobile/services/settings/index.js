const SettingsModel = require("../../../../models/Settings");
const { settingsKeys, countries } = require("../../../../models/constants");
const { errorCodes } = require("../../../../errors");
const ApiError = require("../../../../errors/ApiError");
const ProductModel = require("../../../../models/Product");

const getMobileSettings = async () => {
  let settings = await SettingsModel.findOne({
    key: settingsKeys.MOBILE,
  }).lean({ visrtuals: true });

  if (!settings) throw new ApiError(errorCodes.NO_SETTINGS_FOUND);

  const productTypes = await ProductModel.distinct("productType");
  const productUnits = await ProductModel.distinct("units.productUnit");

  // Set country name
  // @TODO: handle language
  settings = {
    ...settings,
    countries: settings.countries?.map((c) => ({ ...c, countryName: countries[c.countryCode]["ar"] })),
    productTypes,
    productUnits,
  };

  // Override 'id' from virtual --> virtual not working
  settings.id = settings._id;

  return settings;
};

const listFeaturedVendors = async () => {
  const settings = await SettingsModel.findOne({
    key: settingsKeys.FEATURED_VENDORS,
  })
    .populate("featuredVendors", "-firebaseToken -password -userType")
    .lean({ virtuals: true });

  if (!settings) throw new ApiError(errorCodes.NO_SETTINGS_FOUND);
  return settings.featuredVendors;
};

module.exports = {
  getMobileSettings,
  listFeaturedVendors,
};
