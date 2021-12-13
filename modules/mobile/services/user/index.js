const UserModel = require("../../../../models/User");
const FavourtieModel = require("../../../../models/Favourite");
const {
  userTypes,
} = require("../../../../models/constants");
const ApiError = require("../../../../errors/ApiError");
const {
  errorCodes
} = require("../../../../errors");
const {
  validateSchema
} = require("../../../../middlewares/schema");
const schemas = require("./schemas.json");


const listVendors = validateSchema(schemas.listVendorsSchema)(async ({
  fullData = false,
  paginationToken,
  searchQuery,
  vendorType,
  city,
  country
}) => {

  const vendors = await UserModel.find({
    ...(paginationToken && {
      _id: {
        $gt: paginationToken
      }
    }),
    userType: userTypes.VENDOR,
    ...(searchQuery && {
      oraganizationName: {
        $regex: ".*" + searchQuery + ".*"
      }
    }),
    ...(vendorType && {
      vendorType: {
        $in: vendorType
      }
    }),
    ...(city && {
      city: {
        $regex: ".*" + city + ".*"
      }
    }),
    ...(country && {
      country: {
        $regex: ".*" + country + ".*"
      }
    }),
  }).limit(10);

  if (vendors.length == 0) return [];

  if (fullData) return vendors;
  else
    return vendors.map(s => ({
      _id: s._id,
      oraganizationName: s.oraganizationName,
      vendorType: s.vendorType,
      district: s.district,
    }));

})


const getFavouriteVendors = async (userId) => {
  const favourites = await FavourtieModel.findOne({
    userId
  }).populate("favouriteVendors");


  console.log(favourites);
  if (favourites?.favouriteVendors.length != 0)
    return favourites.favouriteVendors;
  else return [];
}


module.exports = {
  listVendors,
  getFavouriteVendors
}