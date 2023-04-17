const SettingsModel = require("../../../../models/Settings");
const { settingsKeys, countries, ObjectId } = require("../../../../models/constants");
const { errorCodes } = require("../../../../errors");
const ApiError = require("../../../../errors/ApiError");
const ProductModel = require("../../../../models/Product");
const Notification = require("../../../../models/Notification");

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

const listNotifications = async ({ userId, paginationToken = null, limit = 10 }) => {
  const notifications = await Notification.aggregate([
    {
      $match: {
        ...(paginationToken && {
          _id: {
            $gt: paginationToken,
          },
        }),
        userId: ObjectId(userId),
      },
    },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        let: { userId: "$userId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
          { $project: { _id: 1, name: 1, country: 1, city: 1, logo: 1 } },
        ],
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
  ]);

  return notifications;
};

module.exports = {
  getMobileSettings,
  listFeaturedVendors,
  listNotifications,
};
