const UserModel = require("../../../../models/User");
const FavourteModel = require("../../../../models/Favourite");
const RatingModel = require("../../../../models/Rating");
const ProductModel = require("../../../../models/Product");
const { userTypes } = require("../../../../models/constants");
const ApiError = require("../../../../errors/ApiError");
const { errorCodes } = require("../../../../errors");
const { validateSchema } = require("../../../../middlewares/schema");
const schemas = require("./schemas");
const { Types } = require("mongoose");

const listVendors = validateSchema(schemas.listVendorsSchema)(
  async ({ fullData = false, paginationToken = null, searchQuery = "", vendorType = "", city = "", country = "" }) => {
    const vendors = await UserModel.find({
      userType: userTypes.VENDOR,
      ...(paginationToken && {
        _id: {
          $gt: paginationToken,
        },
      }),
      ...(searchQuery && {
        oraganizationName: {
          $regex: ".*" + searchQuery + ".*",
        },
      }),
      ...(vendorType && {
        vendorType: {
          $in: vendorType,
        },
      }),
      ...(city && {
        city: {
          $regex: ".*" + city + ".*",
        },
      }),
      ...(country && {
        country: {
          $regex: ".*" + country + ".*",
        },
      }),
    })
      .limit(10)
      .lean();

    // Delete sensitive attributes
    vendors.forEach((v) => {
      delete v.firebaseToken;
      delete v.password;
    });

    if (vendors.length == 0) return [];

    if (fullData) return vendors;
    else
      return vendors.map((s) => ({
        _id: s._id,
        oraganizationName: s.oraganizationName,
        vendorType: s.vendorType,
        city: s.city,
        country: s.country,
      }));
  }
);

const getVendorRatings = async ({ vendorId, paginationToken = null }) => {
  const ratings = await RatingModel.find({
    ...(paginationToken && {
      _id: {
        $gt: paginationToken,
      },
    }),
    targetId: vendorId,
  })
    .limit(10)
    .populate({ path: "userId", select: "name country city" })
    .lean();

  // Calculate the average
  const overAllRating = ratings?.reduce((curr, acc) => (curr + acc.rating) / 2, ratings[0]?.rating);

  return { ratings, overAllRating };
};

const getVendorProducts = async ({ vendorId, productType = null, paginationToken = null }) => {
  const products = await ProductModel.find({
    ...(paginationToken && {
      _id: {
        $gt: paginationToken,
      },
    }),
    ...(productType && { productType }),
    vendorId,
  })
    .limit(10)
    .lean();

  return products;
};

const getProductInfo = async (productId) => {
  const product = await ProductModel.findOne({ _id: new Types.ObjectId(productId) }).lean();

  if (!product) throw new ApiError(errorCodes.PRODUCT_NOT_FOUND);

  return product;
};

const getVendorInfo = async (vendorId) => {
  // Get the vendor data
  const vendorInfo = await UserModel.findOne({ _id: vendorId }).lean();
  delete vendorInfo.firebaseToken;
  delete vendorInfo.password;

  // Get vendor ratings
  const { ratings, overAllRating } = await getVendorRatings({ vendorId });

  // Get vendor products
  const products = await getVendorProducts({ vendorId });
  return {
    vendorInfo,
    ratings,
    overAllRating,
    products,
  };
};

const getFavouriteVendors = async (userId) => {
  const favourites = await FavourteModel.findOne({
    userId,
  }).populate("favouriteVendors", "organizationName vendorType city country");

  return favourites?.favouriteVendors || [];
};

const addVendorToFavourites = async ({ vendorId, userId }) => {
  await FavourteModel.findOneAndUpdate(
    { userId },
    { $addToSet: { favouriteVendors: new Types.ObjectId(vendorId) } },
    { upsert: true }
  );
};

const rateTarget = validateSchema(schemas.rateTargetSchema)(async ({ targetId, userId, rating, comment }) => {
  const ratingResult = await RatingModel.findOneAndUpdate(
    { userId, targetId },
    { $set: { rating, comment } },
    { upsert: true, new: true }
  );

  return ratingResult;
});

module.exports = {
  listVendors,
  getFavouriteVendors,
  addVendorToFavourites,
  getVendorInfo,
  getVendorRatings,
  getVendorProducts,
  getProductInfo,
  rateTarget,
};
