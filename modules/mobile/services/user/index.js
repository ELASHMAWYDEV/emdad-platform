const UserModel = require("../../../../models/User");
const FavouriteModel = require("../../../../models/Favourite");
const RatingModel = require("../../../../models/Rating");
const ProductModel = require("../../../../models/Product");
const ProductService = require("../product");
const { userTypes, ObjectId } = require("../../../../models/constants");
const ApiError = require("../../../../errors/ApiError");
const { errorCodes } = require("../../../../errors");
const { validateSchema } = require("../../../../middlewares/schema");
const schemas = require("./schemas");
const { Types } = require("mongoose");
const { sendNotification } = require("../../../../helpers");
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
          $options: "i"
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
      .select("-password -firebaseToken")
      .lean();

    return vendors;
  }
);

const listVendors = validateSchema(schemas.listVendorsSchema)(
  async ({
    paginationToken = null,
    limit = 10,
    searchQuery = "",
    vendorType = [],
    city = "",
    country = "",
    includeRatings,
  }) => {
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
          $options: "i"
        },
      }),
      ...(vendorType.length !== 0 && {
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
      .lean({ virtuals: true });

    return vendors;
  }
);

const getVendorRatings = async ({ vendorId, paginationToken = null, limit = 10 }) => {
  let ratings = await RatingModel.aggregate([
    {
      $match: {
        ...(paginationToken && {
          _id: {
            $gt: paginationToken,
          },
        }),
        targetId: ObjectId(vendorId),
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

  ratings = ratings.map((rating) => ({
    ...new RatingModel(rating).toJSON(),
    user: new UserModel(rating.user).toJSON(),
  }));

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
  }).lean({ virtuals: true });

  if (!product) throw new ApiError(errorCodes.PRODUCT_NOT_FOUND);

  return {
    ...product,
    // images: product?.images?.map((img) => `${WEBSITE_URL}/images/products/${img}`),
  };
};

const getVendorInfo = async (vendorId) => {
  // Get the vendor data
  const vendorInfo = await UserModel.findOne({
    _id: vendorId,
  }).lean({ virtuals: true });
  delete vendorInfo.firebaseToken;
  delete vendorInfo.password;

  // Get vendor ratings
  const { ratings, overAllRating } = await getVendorRatings({
    vendorId,
  });

  // Get vendor products
  const products = await ProductService.listProducts({
    vendorId,
    categorized: true,
  });

  return {
    vendorInfo,
    ratings,
    overAllRating,
    categories: products.categories,
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

  // Send notification to vendor
  if (!!!isExist) {
    const vendor = await UserModel.findById(vendorId);
    const user = await UserModel.findById(userId);
    sendNotification({
      firebaseToken: vendor.firebaseToken,
      deviceType: vendor.deviceType,
      title: `تم اضافتك الي التجار المفضلين الخاصة بالمستخدم ${user.name}`,
      body: `تم اضافتك الي التجار المفضلين الخاصة بالمستخدم ${user.name}`,
      type: 11,
    });
  }

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

  // Send notification to vendor
  const vendor = await UserModel.findById(targetId);
  const user = await UserModel.findById(userId);
  sendNotification({
    firebaseToken: vendor.firebaseToken,
    deviceType: vendor.deviceType,
    title: `تم تقييمك بنجاح`,
    body: `قام المستخدم ${user.name} بتقييمك بنجاح`,
    type: 12,
    data: ratingResult,
  });

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
