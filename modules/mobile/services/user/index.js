const UserModel = require("../../../../models/User");
const FavouriteModel = require("../../../../models/Favourite");
const RatingModel = require("../../../../models/Rating");
const ProductModel = require("../../../../models/Product");
const ProductService = require("../product");
const { userTypes } = require("../../../../models/constants");
const ApiError = require("../../../../errors/ApiError");
const { errorCodes } = require("../../../../errors");
const { validateSchema } = require("../../../../middlewares/schema");
const schemas = require("./schemas");
const { Types } = require("mongoose");
const { WEBSITE_URL } = require("../../../../globals");

const listTransporters = validateSchema(schemas.listTransportersSchema)(
  async ({
    paginationToken = null,
    limit = 10,
    searchQuery = "",
    transportationMethods = [],
    city = "",
    country = "",
  }) => {
    const vendors = await UserModel.find({
      userType: userTypes.TRANSPORTER,
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
      ...(transportationMethods && {
        transportationMethods: {
          $in: transportationMethods,
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
      .limit(limit)
      .select("-password")
      .lean();

    return vendors;
  }
);

const listVendors = validateSchema(schemas.listVendorsSchema)(
  async ({ paginationToken = null, limit = 10, searchQuery = "", vendorType = [], city = "", country = "" }) => {
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
      .limit(limit)
      .select("-firebaseToken -password -userType")
      .lean();

    return vendors;
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
    .populate({
      path: "userId",
      select: "name country city",
    });
  // Calculate the average
  const overAllRating = ratings?.reduce((curr, acc) => (curr + acc.rating) / 2, ratings[0]?.rating);

  return {
    ratings,
    overAllRating,
  };
};

const getProductInfo = async (productId) => {
  const product = await ProductModel.findOne({
    _id: new Types.ObjectId(productId),
  }).lean();

  if (!product) throw new ApiError(errorCodes.PRODUCT_NOT_FOUND);

  return {
    ...product,
    images: product?.images?.map((img) => `${WEBSITE_URL}/images/products/${img}`),
  };
};

const getVendorInfo = async (vendorId) => {
  // Get the vendor data
  const vendorInfo = await UserModel.findOne({
    _id: vendorId,
  }).lean();
  delete vendorInfo.firebaseToken;
  delete vendorInfo.password;

  // Get vendor ratings
  const { ratings, overAllRating } = await getVendorRatings({
    vendorId,
  });

  // Get vendor products
  const products = await ProductService.listProducts({
    vendorId,
  });
  return {
    vendorInfo,
    ratings,
    overAllRating,
    products,
  };
};

const getFavouriteVendors = async (userId) => {
  const favourites = await FavouriteModel.findOne({
    userId,
  }).populate("favouriteVendors", "-firebaseToken -password -userType");

  return favourites?.favouriteVendors || [];
};

const toggleVendorToFavourites = async ({ vendorId, userId }) => {
  // Check if exist in favourites list
  const isExist = await FavouriteModel.findOne({
    userId,
    favouriteVendors: {
      $in: [vendorId],
    },
  });

  console.log(isExist);
  if (isExist)
    await FavouriteModel.updateOne(
      {
        userId,
      },
      {
        $pull: {
          favouriteVendors: vendorId,
        },
      }
    );
  else
    await FavouriteModel.findOneAndUpdate(
      {
        userId,
      },
      {
        $addToSet: {
          favouriteVendors: new Types.ObjectId(vendorId),
        },
      },
      {
        upsert: true,
      }
    );

  return !!isExist ? "تم حذف البائع من المفضلة بنجاح" : "تم اضافة البائع الي المفضلة بنجاح";
};

const rateTarget = validateSchema(schemas.rateTargetSchema)(async ({ targetId, userId, rating, comment }) => {
  const ratingResult = await RatingModel.findOneAndUpdate(
    {
      userId,
      targetId,
    },
    {
      $set: {
        rating,
        comment,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return ratingResult;
});

module.exports = {
  listVendors,
  listTransporters,
  getFavouriteVendors,
  toggleVendorToFavourites,
  getVendorInfo,
  getVendorRatings,
  getProductInfo,
  rateTarget,
};
